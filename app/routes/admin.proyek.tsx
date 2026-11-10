import * as React from "react";
import { Form, useActionData } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.proyek";
import { AdminFeedbackBanner } from "~/components/admin/admin-feedback-banner";
import { ConfirmDeleteDialog } from "~/components/admin/confirm-delete-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  deleteProjectRecord,
  getAdminProjectsData,
  insertMediaAssetRecord,
  upsertProjectRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { uploadMediaToR2 } from "~/lib/r2.server";
import {
  parseOptionalId,
  parsePositiveInt,
  toSlug,
} from "~/lib/validations";
import type { ProjectItem } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminProjectsData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "save-project") {
    const title = String(formData.get("title") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    if (!title || !summary) {
      return {
        ok: false,
        error: "Nama proyek dan ringkasan proyek wajib diisi.",
      };
    }

    let resolvedImageUrl =
      String(formData.get("imageUrl") ?? "").trim() || "/media/preview-ppdb.svg";

    const uploadEntry = formData.get("uploadFile");
    if (uploadEntry instanceof File && uploadEntry.size > 0) {
      const uploadResult = await uploadMediaToR2(env.MEDIA_BUCKET, uploadEntry);
      if (!uploadResult.ok) {
        return { ok: false, error: uploadResult.error };
      }
      await insertMediaAssetRecord(env.DB, uploadResult.asset);
      resolvedImageUrl = uploadResult.asset.url;
    }

    const existingSlug = String(formData.get("slug") ?? "").trim();
    const slug = existingSlug ? toSlug(existingSlug, "proyek") : toSlug(title, "proyek");

    await upsertProjectRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      title,
      slug,
      summary,
      imageUrl: resolvedImageUrl,
      imageAlt:
        String(formData.get("imageAlt") ?? "").trim() ||
        `Pratinjau ${title}`,
      isPublished: formData.get("isPublished") === "on",
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
    });

    return { ok: true, savedMessage: "Data proyek berhasil disimpan." };
  }

  if (intent === "delete-project") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteProjectRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Proyek berhasil dihapus." };
  }

  return null;
}

export default function AdminProyekRoute({ loaderData }: Route.ComponentProps) {
  const { projects, media } = loaderData;
  const actionData = useActionData<typeof action>();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProjectItem | null>(null);
  const [isPublished, setIsPublished] = React.useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    "/media/preview-ppdb.svg",
  );
  const [deleting, setDeleting] = React.useState<ProjectItem | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setDialogOpen(false);
    }
  }, [actionData]);

  const openCreate = () => {
    setEditing(null);
    setIsPublished(true);
    setSelectedImageUrl(media[0]?.url ?? "/media/preview-ppdb.svg");
    setDialogOpen(true);
  };

  const openEdit = (item: ProjectItem) => {
    setEditing(item);
    setIsPublished(item.isPublished);
    setSelectedImageUrl(item.imageUrl);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
            Proyek Unggulan
          </h1>
          <p className="mt-2 text-[14.5px] text-cream-dim">
            Kelola portofolio yang tampil pada kisi Bento Proyek Unggulan di halaman publik.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah Proyek</Button>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <div
        tabIndex={0}
        role="region"
        aria-labelledby="projects-table-caption"
        className="admin-table-region rounded-[5px] border border-line bg-bg2"
      >
        <table className="admin-responsive-table w-full text-left text-[13.5px]">
          <caption id="projects-table-caption" className="sr-only">
            Daftar proyek portofolio
          </caption>
          <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Judul Proyek
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Gambar
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Urutan
              </th>
              <th scope="col" className="px-4 py-3.5 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {projects.map((item, idx) => (
              <tr key={item.id}>
                <th scope="row" className="px-4 py-3.5 font-semibold text-cream">
                  {item.title}
                  {idx === 0 && item.isPublished ? (
                    <span className="ml-2 rounded-[3px] border border-rust px-1.5 py-0.5 text-[11px] font-normal text-cream">
                      Kartu Utama
                    </span>
                  ) : null}
                </th>
                <td data-label="Gambar" className="px-4 py-3.5 text-cream-dim">
                  <span className="inline-block max-w-[240px] truncate align-bottom">
                    {item.imageUrl}
                  </span>
                </td>
                <td data-label="Status" className="px-4 py-3.5">
                  <span
                    className={
                      item.isPublished
                        ? "rounded-[3px] border border-rust bg-bg2 px-2 py-0.5 text-[12px] text-cream"
                        : "rounded-[3px] border border-line bg-bg2 px-2 py-0.5 text-[12px] text-cream-dim"
                    }
                  >
                    {item.isPublished ? "Publik" : "Draf"}
                  </span>
                </td>
                <td
                  data-label="Urutan"
                  className="tabular-price px-4 py-3.5 text-cream-dim"
                >
                  {item.sortOrder}
                </td>
                <td data-label="Aksi" className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Ubah proyek ${item.title}`}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Hapus proyek ${item.title}`}
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2
                        className="h-3.5 w-3.5 text-rust"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Proyek Unggulan" : "Tambah Proyek Unggulan"}
            </DialogTitle>
            <DialogDescription>
              Proyek urutan pertama akan menempati bidang utama terbesar pada kisi Bento halaman publik.
            </DialogDescription>
          </DialogHeader>

          <Form
            method="post"
            encType="multipart/form-data"
            className="mt-5 flex flex-col gap-4"
          >
            <input type="hidden" name="intent" value="save-project" />
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            <input type="hidden" name="slug" value={editing?.slug ?? ""} />
            <input type="hidden" name="imageUrl" value={selectedImageUrl} />
            {isPublished ? (
              <input type="hidden" name="isPublished" value="on" />
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="proj-title">Nama Proyek</Label>
                <Input
                  id="proj-title"
                  name="title"
                  autoFocus
                  required
                  defaultValue={editing?.title ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="proj-order">Urutan Tampil</Label>
                <Input
                  id="proj-order"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editing?.sortOrder ?? projects.length + 1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proj-summary">Ringkasan Proyek</Label>
              <Textarea
                id="proj-summary"
                name="summary"
                rows={4}
                required
                defaultValue={editing?.summary ?? ""}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="proj-image-select">Pilih dari Pustaka Media</Label>
                <Select
                  value={selectedImageUrl}
                  onValueChange={setSelectedImageUrl}
                >
                  <SelectTrigger id="proj-image-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {media.map((asset) => (
                      <SelectItem key={asset.key} value={asset.url}>
                        {asset.filename}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="proj-upload-file">Atau Unggah Gambar Baru</Label>
                <Input
                  id="proj-upload-file"
                  type="file"
                  name="uploadFile"
                  accept="image/webp,image/avif,image/png,image/jpeg,image/svg+xml"
                  className="py-2 file:mr-3 file:rounded-[4px] file:border-0 file:bg-rust file:px-2.5 file:py-1 file:text-[12px] file:font-medium file:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proj-alt">Teks Alternatif Gambar</Label>
              <Input
                id="proj-alt"
                name="imageAlt"
                required
                placeholder="Contoh: Tampilan antarmuka Portal PPDB Online"
                defaultValue={editing?.imageAlt ?? ""}
              />
            </div>

            <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3">
              <Label htmlFor="proj-pub-switch">Tampilkan di Halaman Publik</Label>
              <Switch
                id="proj-pub-switch"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Form method="post" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="intent" value="delete-project" />
        <input type="hidden" name="id" value={deleting?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Proyek"
        description={`Apakah Anda yakin ingin menghapus proyek "${deleting?.title ?? ""}" dari daftar?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </div>
  );
}
