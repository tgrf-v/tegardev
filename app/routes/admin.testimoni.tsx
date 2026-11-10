import * as React from "react";
import { Form, useActionData } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.testimoni";
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
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  deleteTestimonialRecord,
  getAdminTestimonialsData,
  upsertTestimonialRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { parseOptionalId, parsePositiveInt } from "~/lib/validations";
import type { TestimonialItem } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminTestimonialsData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "save-testimonial") {
    const clientName = String(formData.get("clientName") ?? "").trim();
    const clientRoleOrg = String(formData.get("clientRoleOrg") ?? "").trim();
    const quote = String(formData.get("quote") ?? "").trim();

    if (!clientName || !clientRoleOrg || !quote) {
      return {
        ok: false,
        error: "Nama klien, jabatan atau instansi, serta isi kutipan wajib diisi.",
      };
    }

    await upsertTestimonialRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      clientName,
      clientRoleOrg,
      quote,
      isFeatured: formData.get("isFeatured") === "on",
      isPublished: formData.get("isPublished") === "on",
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
    });

    return { ok: true, savedMessage: "Testimoni berhasil disimpan." };
  }

  if (intent === "delete-testimonial") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteTestimonialRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Testimoni berhasil dihapus." };
  }

  return null;
}

export default function AdminTestimoniRoute({
  loaderData,
}: Route.ComponentProps) {
  const { testimonials } = loaderData;
  const actionData = useActionData<typeof action>();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TestimonialItem | null>(null);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const [deleting, setDeleting] = React.useState<TestimonialItem | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setDialogOpen(false);
    }
  }, [actionData]);

  const openCreate = () => {
    setEditing(null);
    setIsFeatured(false);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEdit = (item: TestimonialItem) => {
    setEditing(item);
    setIsFeatured(item.isFeatured);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
            Testimoni
          </h1>
          <p className="mt-2 text-[14.5px] text-cream-dim">
            Kelola ulasan klien yang berputar pada seksi Testimoni Klien serta tentukan ulasan pembuka utama.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah Testimoni</Button>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <div
        tabIndex={0}
        role="region"
        aria-labelledby="testimonials-table-caption"
        className="admin-table-region rounded-[5px] border border-line bg-bg2"
      >
        <table className="admin-responsive-table w-full text-left text-[13.5px]">
          <caption id="testimonials-table-caption" className="sr-only">
            Daftar testimoni klien
          </caption>
          <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Nama Klien
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Jabatan / Instansi
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Urutan Awal
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {testimonials.map((item) => (
              <tr key={item.id}>
                <th scope="row" className="px-4 py-3.5 font-semibold text-cream">
                  {item.clientName}
                  {item.isFeatured ? (
                    <span className="ml-2 rounded-[3px] bg-rust px-2 py-0.5 text-[11px] font-medium text-white">
                      Pembuka Utama
                    </span>
                  ) : null}
                </th>
                <td data-label="Instansi" className="px-4 py-3.5 text-cream-dim">
                  {item.clientRoleOrg}
                </td>
                <td
                  data-label="Urutan"
                  className="tabular-price px-4 py-3.5 text-cream-dim"
                >
                  {item.sortOrder}
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
                <td data-label="Aksi" className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Ubah testimoni ${item.clientName}`}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Hapus testimoni ${item.clientName}`}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Testimoni" : "Tambah Testimoni"}
            </DialogTitle>
            <DialogDescription>
              Masukkan kutipan pengalaman kolaborasi beserta nama dan asal instansi klien.
            </DialogDescription>
          </DialogHeader>

          <Form method="post" className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="intent" value="save-testimonial" />
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            {isFeatured ? (
              <input type="hidden" name="isFeatured" value="on" />
            ) : null}
            {isPublished ? (
              <input type="hidden" name="isPublished" value="on" />
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="testi-name">Nama Pemberi Ulasan</Label>
                <Input
                  id="testi-name"
                  name="clientName"
                  autoFocus
                  required
                  defaultValue={editing?.clientName ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="testi-sort">Urutan</Label>
                <Input
                  id="testi-sort"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editing?.sortOrder ?? testimonials.length + 1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="testi-org">Jabatan &amp; Nama Instansi / Bisnis</Label>
              <Input
                id="testi-org"
                name="clientRoleOrg"
                required
                defaultValue={editing?.clientRoleOrg ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="testi-quote">Isi Kutipan Testimoni</Label>
              <Textarea
                id="testi-quote"
                name="quote"
                rows={4}
                required
                defaultValue={editing?.quote ?? ""}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3">
                <Label htmlFor="testi-feat-switch">Jadikan Ulasan Pembuka</Label>
                <Switch
                  id="testi-feat-switch"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>

              <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3">
                <Label htmlFor="testi-pub-switch">Tampilkan di Publik</Label>
                <Switch
                  id="testi-pub-switch"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
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
        <input type="hidden" name="intent" value="delete-testimonial" />
        <input type="hidden" name="id" value={deleting?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Testimoni"
        description={`Apakah Anda yakin ingin menghapus testimoni dari "${deleting?.clientName ?? ""}"?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </div>
  );
}
