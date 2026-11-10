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
import { Textarea } from "~/components/ui/textarea";
import {
  deleteSkillGroupRecord,
  getAdminProfileData,
  saveSiteSettings,
  upsertSkillGroupRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { parseOptionalId, parsePositiveInt } from "~/lib/validations";
import type { SkillGroup } from "~/types/content";

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

  if (intent === "save-skill") {
    const groupName = String(formData.get("groupName") ?? "").trim();
    const items = String(formData.get("items") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!groupName || items.length === 0) {
      return {
        ok: false,
        error: "Nama kelompok dan minimal satu keahlian teknologi wajib diisi.",
      };
    }

    await upsertSkillGroupRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      groupName,
      items,
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
    });

    return {
      ok: true,
      savedMessage: "Kelompok keahlian berhasil disimpan.",
    };
  }

  if (intent === "delete-skill") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteSkillGroupRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Kelompok keahlian dihapus." };
  }

  return null;
}

export default function AdminProfilRoute({ loaderData }: Route.ComponentProps) {
  const { settings, skills } = loaderData;
  const actionData = useActionData<typeof action>();

  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<SkillGroup | null>(
    null,
  );
  const [deletingSkill, setDeletingSkill] = React.useState<SkillGroup | null>(
    null,
  );
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setSkillDialogOpen(false);
    }
  }, [actionData]);

  const openCreateSkill = () => {
    setEditingSkill(null);
    setSkillDialogOpen(true);
  };

  const openEditSkill = (group: SkillGroup) => {
    setEditingSkill(group);
    setSkillDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
          Profil &amp; Keahlian
        </h1>
        <p className="mt-2 text-[14.5px] text-cream-dim">
          Kelola judul Hero, narasi Tentang Saya, kontak tujuan Brief Proyek, serta barisan teknologi berjalan.
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-hero-headline">Judul Utama Hero</Label>
            <Input
              id="field-hero-headline"
              name="heroHeadline"
              defaultValue={settings.heroHeadline}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-about-title">Judul Seksi Tentang Saya</Label>
            <Input
              id="field-about-title"
              name="aboutTitle"
              defaultValue={settings.aboutTitle}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="field-about-body">Narasi Tentang Saya</Label>
            <span id="hint-about-body" className="text-[12.5px] text-cream-dim">
              Pisahkan setiap paragraf menggunakan satu baris kosong agar tampil rapi di halaman utama.
            </span>
            <Textarea
              id="field-about-body"
              name="aboutBody"
              aria-describedby="hint-about-body"
              rows={7}
              defaultValue={settings.aboutBody}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="field-wa">Nomor WhatsApp Tujuan Brief</Label>
            <span id="hint-wa" className="text-[12.5px] text-cream-dim">
              Gunakan kode negara 62 tanpa tanda tambah atau spasi, contoh: 6285196802314.
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
          <Button type="submit">Simpan</Button>
        </div>
      </Form>

      <section className="rounded-[5px] border border-line bg-bg2 p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[18px] font-semibold text-cream">
              Daftar Keahlian Teknologi
            </h2>
            <p className="mt-1 text-[13.5px] text-cream-dim">
              Teknologi yang digulir otomatis pada pita berjalan tepat di bawah Hero.
            </p>
          </div>
          <Button size="sm" onClick={openCreateSkill}>
            Tambah Kelompok
          </Button>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="skills-table-caption"
          className="admin-table-region rounded-[4px] border border-line"
        >
          <table className="admin-responsive-table w-full text-left text-[13.5px]">
            <caption id="skills-table-caption" className="sr-only">
              Daftar kelompok keahlian teknologi
            </caption>
            <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Kelompok
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Daftar Teknologi
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Urutan
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-bg">
              {skills.map((group) => (
                <tr key={group.id}>
                  <th scope="row" className="px-4 py-3 font-semibold text-cream">
                    {group.groupName}
                  </th>
                  <td
                    data-label="Teknologi"
                    className="px-4 py-3 text-cream-dim"
                  >
                    {group.items.join(", ")}
                  </td>
                  <td
                    data-label="Urutan"
                    className="tabular-price px-4 py-3 text-cream-dim"
                  >
                    {group.sortOrder}
                  </td>
                  <td data-label="Aksi" className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Ubah ${group.groupName}`}
                        onClick={() => openEditSkill(group)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Hapus ${group.groupName}`}
                        onClick={() => setDeletingSkill(group)}
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

      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSkill
                ? "Ubah Kelompok Keahlian"
                : "Tambah Kelompok Keahlian"}
            </DialogTitle>
            <DialogDescription>
              Atur nama pengelompokan dan daftar keahlian teknologi yang ditampilkan.
            </DialogDescription>
          </DialogHeader>

          <Form method="post" className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="intent" value="save-skill" />
            {editingSkill ? (
              <input type="hidden" name="id" value={editingSkill.id} />
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="skill-group-name">Nama Kelompok</Label>
                <Input
                  id="skill-group-name"
                  name="groupName"
                  autoFocus
                  required
                  defaultValue={editingSkill?.groupName ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="skill-sort">Urutan Tampil</Label>
                <Input
                  id="skill-sort"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editingSkill?.sortOrder ?? skills.length + 1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skill-items">Daftar Teknologi</Label>
              <span
                id="skill-items-hint"
                className="text-[12.5px] text-cream-dim"
              >
                Pisahkan nama teknologi dengan tanda koma.
              </span>
              <Textarea
                id="skill-items"
                name="items"
                aria-describedby="skill-items-hint"
                required
                defaultValue={editingSkill?.items.join(", ") ?? ""}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSkillDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Form method="post" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="intent" value="delete-skill" />
        <input type="hidden" name="id" value={deletingSkill?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deletingSkill)}
        onOpenChange={(open) => {
          if (!open) setDeletingSkill(null);
        }}
        title="Hapus Kelompok Keahlian"
        description={`Apakah Anda yakin ingin menghapus kelompok "${deletingSkill?.groupName ?? ""}"?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeletingSkill(null);
        }}
      />
    </div>
  );
}
