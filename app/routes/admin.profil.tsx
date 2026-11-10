import * as React from "react";
import { Form, useActionData } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.profil";
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
  deleteServiceRecord,
  getAdminProfileData,
  saveSiteSettings,
  upsertServiceRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { parseOptionalId, parsePositiveInt } from "~/lib/validations";
import type { ServiceItem } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminProfileData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "save-settings") {
    const whatsappClean = String(formData.get("whatsappNumber") ?? "").replace(
      /\D/g,
      "",
    );
    if (!/^62\d{8,14}$/.test(whatsappClean)) {
      return {
        ok: false,
        error:
          "Nomor WhatsApp wajib diawali kode negara 62 diikuti 8 hingga 14 digit angka.",
      };
    }

    await saveSiteSettings(env.DB, {
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      aboutTitle:
        String(formData.get("aboutTitle") ?? "").trim() || "Tentang Saya",
      aboutBody: String(formData.get("aboutBody") ?? "").trim(),
      whatsappNumber: whatsappClean,
      contactEmail: String(formData.get("contactEmail") ?? "").trim(),
      githubUrl: String(formData.get("githubUrl") ?? "").trim(),
      linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim(),
      ctaHeadline: String(formData.get("ctaHeadline") ?? "").trim(),
      ctaSubtext: String(formData.get("ctaSubtext") ?? "").trim(),
    });

    return {
      ok: true,
      savedMessage: "Pengaturan profil berhasil disimpan ke database D1.",
    };
  }

  if (intent === "save-service") {
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return {
        ok: false,
        error: "Nama layanan atau jenis solusi web wajib diisi.",
      };
    }

    await upsertServiceRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      title,
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
      isPublished: formData.get("isPublished") === "on",
    });

    return {
      ok: true,
      savedMessage: "Layanan web berhasil disimpan.",
    };
  }

  if (intent === "delete-service") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteServiceRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Layanan web berhasil dihapus." };
  }

  return null;
}

export default function AdminProfilRoute({ loaderData }: Route.ComponentProps) {
  const { settings, services } = loaderData;
  const actionData = useActionData<typeof action>();

  const [serviceDialogOpen, setServiceDialogOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<ServiceItem | null>(
    null,
  );
  const [isPublished, setIsPublished] = React.useState(true);
  const [deletingService, setDeletingService] = React.useState<ServiceItem | null>(
    null,
  );
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setServiceDialogOpen(false);
    }
  }, [actionData]);

  const openCreateService = () => {
    setEditingService(null);
    setIsPublished(true);
    setServiceDialogOpen(true);
  };

  const openEditService = (item: ServiceItem) => {
    setEditingService(item);
    setIsPublished(item.isPublished);
    setServiceDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
          Profil &amp; Layanan
        </h1>
        <p className="mt-2 text-[14.5px] text-cream-dim">
          Kelola teks profil pengembang, kontak resmi, tautan media sosial, serta daftar layanan web yang ditampilkan pada pita berjalan.
        </p>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <Form
        method="post"
        className="flex flex-col gap-6 rounded-[5px] border border-line bg-bg2 p-6"
      >
        <input type="hidden" name="intent" value="save-settings" />

        <div className="border-b border-line pb-4">
          <h2 className="text-[18px] font-semibold text-cream">
            Pengaturan Profil &amp; Narasi
          </h2>
          <p className="mt-1 text-[13.5px] text-cream-dim">
            Teks ini tampil langsung pada kartu Hero, section Tentang Saya, dan Footer situs publik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-headline">Headline Hero Utama</Label>
            <Input
              id="field-headline"
              name="heroHeadline"
              defaultValue={settings.heroHeadline}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-about-title">Judul Kartu Tentang Saya</Label>
            <Input
              id="field-about-title"
              name="aboutTitle"
              defaultValue={settings.aboutTitle}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-about-body">
              Paragraf Narasi Pengembang
            </Label>
            <span id="hint-about" className="text-[12.5px] text-cream-dim">
              Pisahkan antar-paragraf dengan satu baris kosong (enter dua kali).
            </span>
            <Textarea
              id="field-about-body"
              name="aboutBody"
              aria-describedby="hint-about"
              rows={8}
              defaultValue={settings.aboutBody}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="field-wa">Nomor WhatsApp Resmi</Label>
            <span id="hint-wa" className="text-[12.5px] text-cream-dim">
              Wajib format 62 diawali tanpa tanda plus atau angka 0.
            </span>
            <Input
              id="field-wa"
              name="whatsappNumber"
              aria-describedby="hint-wa"
              pattern="62[0-9]{8,14}"
              defaultValue={settings.whatsappNumber}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="field-email">Alamat Email Resmi</Label>
            <span className="text-[12.5px] text-cream-dim">
              Digunakan pada identitas skema terstruktur SEO situs.
            </span>
            <Input
              id="field-email"
              type="email"
              name="contactEmail"
              defaultValue={settings.contactEmail}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="field-github">Tautan GitHub</Label>
            <Input
              id="field-github"
              type="url"
              name="githubUrl"
              defaultValue={settings.githubUrl}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="field-linkedin">Tautan LinkedIn</Label>
            <Input
              id="field-linkedin"
              type="url"
              name="linkedinUrl"
              defaultValue={settings.linkedinUrl}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-cta-headline">Judul Ajakan Band Bawah</Label>
            <Input
              id="field-cta-headline"
              name="ctaHeadline"
              defaultValue={settings.ctaHeadline}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-cta-sub">Kalimat Pendukung Band Bawah</Label>
            <Textarea
              id="field-cta-sub"
              name="ctaSubtext"
              defaultValue={settings.ctaSubtext}
              required
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-line pt-4">
          <Button type="submit">Simpan Profil</Button>
        </div>
      </Form>

      <section className="rounded-[5px] border border-line bg-bg2 p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[18px] font-semibold text-cream">
              Daftar Layanan &amp; Solusi Web
            </h2>
            <p className="mt-1 text-[13.5px] text-cream-dim">
              Layanan atau jenis solusi website yang ditampilkan pada teks pita berjalan tepat di bawah Hero.
            </p>
          </div>
          <Button size="sm" onClick={openCreateService}>
            Tambah Layanan
          </Button>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="services-table-caption"
          className="admin-table-region rounded-[4px] border border-line"
        >
          <table className="admin-responsive-table w-full text-left text-[13.5px]">
            <caption id="services-table-caption" className="sr-only">
              Daftar layanan dan solusi web
            </caption>
            <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Nama Layanan / Solusi
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Urutan
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-bg">
              {services.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className="px-4 py-3 font-semibold text-cream">
                    {item.title}
                  </th>
                  <td
                    data-label="Urutan"
                    className="tabular-price px-4 py-3 text-cream-dim"
                  >
                    {item.sortOrder}
                  </td>
                  <td data-label="Status" className="px-4 py-3">
                    {item.isPublished ? (
                      <span className="rounded-[3px] bg-rust/20 px-2 py-0.5 text-[11px] font-medium text-rust">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-[3px] bg-line px-2 py-0.5 text-[11px] text-cream-dim">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td data-label="Aksi" className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Ubah ${item.title}`}
                        onClick={() => openEditService(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Hapus ${item.title}`}
                        onClick={() => setDeletingService(item)}
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
      </section>

      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Ubah Layanan Web" : "Tambah Layanan Web"}
            </DialogTitle>
            <DialogDescription>
              Atur nama solusi web dan status publikasi pada pita teks berjalan.
            </DialogDescription>
          </DialogHeader>

          <Form method="post" className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="intent" value="save-service" />
            {editingService ? (
              <input type="hidden" name="id" value={editingService.id} />
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="service-title">Nama Layanan / Solusi Web</Label>
              <Input
                id="service-title"
                name="title"
                placeholder="Contoh: PPDB Online, Sistem Inventaris, E-Commerce"
                autoFocus
                required
                defaultValue={editingService?.title ?? ""}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service-sort">Urutan Tampil</Label>
                <Input
                  id="service-sort"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editingService?.sortOrder ?? services.length + 1}
                />
              </div>

              <div className="flex flex-col justify-end gap-1.5">
                <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg p-2.5">
                  <Label htmlFor="service-published" className="cursor-pointer text-[13px]">
                    Tampilkan di Web
                  </Label>
                  <Switch
                    id="service-published"
                    name="isPublished"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setServiceDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Form method="post" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="intent" value="delete-service" />
        <input type="hidden" name="id" value={deletingService?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => {
          if (!open) setDeletingService(null);
        }}
        title="Hapus Layanan Web"
        description={`Apakah Anda yakin ingin menghapus "${deletingService?.title ?? ""}" dari daftar layanan pita berjalan?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeletingService(null);
        }}
      />
    </div>
  );
}
