import * as React from "react";
import { Form, useActionData } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "./+types/admin.paket";
import { AdminFeedbackBanner } from "~/components/admin/admin-feedback-banner";
import { ConfirmDeleteDialog } from "~/components/admin/confirm-delete-dialog";
import { PackageCategorySection } from "~/components/admin/package-category-section";
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
  deletePackageCategoryRecord,
  deleteServicePackageRecord,
  getAdminPackagesData,
  upsertPackageCategoryRecord,
  upsertServicePackageRecord,
} from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import {
  formatPackageFeaturesForTextarea,
  parseOptionalId,
  parsePackageAddonLines,
  parsePackageFeatureLines,
  parsePositiveInt,
  toSlug,
} from "~/lib/validations";
import { formatPackagePrice } from "~/lib/whatsapp";
import type { ServicePackage } from "~/types/content";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  return getAdminPackagesData(env.DB);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = await requireAdminAccess(request, context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "save-category") {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return { ok: false, error: "Nama kategori wajib diisi." };
    }
    const existingSlug = String(formData.get("slug") ?? "").trim();
    const slug = existingSlug
      ? toSlug(existingSlug, "kategori")
      : toSlug(name, "kategori");

    await upsertPackageCategoryRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      name,
      slug,
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
    });

    return { ok: true, savedMessage: "Kategori paket berhasil disimpan." };
  }

  if (intent === "delete-category") {
    const id = parseOptionalId(formData.get("id"));
    if (!id) return null;
    const result = await deletePackageCategoryRecord(env.DB, id);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return { ok: true, savedMessage: "Kategori paket berhasil dihapus." };
  }

  if (intent === "save-package") {
    const name = String(formData.get("name") ?? "").trim();
    const tagline = String(formData.get("tagline") ?? "").trim();
    const estimatedDuration = String(
      formData.get("estimatedDuration") ?? "",
    ).trim();

    if (!name || !tagline || !estimatedDuration) {
      return {
        ok: false,
        error: "Nama paket, deskripsi singkat, dan estimasi pengerjaan wajib diisi.",
      };
    }

    const existingSlug = String(formData.get("slug") ?? "").trim();
    const slug = existingSlug ? toSlug(existingSlug, "paket") : toSlug(name, "paket");

    const priceDigits = String(formData.get("startingPrice") ?? "").replace(
      /\D/g,
      "",
    );
    const startingPrice = priceDigits ? Number(priceDigits) : null;
    const labelOverrideRaw = String(
      formData.get("priceLabelOverride") ?? "",
    ).trim();

    const features = parsePackageFeatureLines(
      String(formData.get("featuresText") ?? ""),
    );
    if (features.length === 0) {
      return {
        ok: false,
        error: "Masukkan minimal satu poin cakupan fitur paket.",
      };
    }

    const addons = parsePackageAddonLines(
      String(formData.get("addonsText") ?? ""),
    );

    await upsertServicePackageRecord(env.DB, {
      id: parseOptionalId(formData.get("id")),
      categoryId: parsePositiveInt(formData.get("categoryId"), 1),
      name,
      slug,
      tagline,
      startingPrice,
      priceLabelOverride:
        startingPrice && !labelOverrideRaw
          ? null
          : labelOverrideRaw || (startingPrice ? null : "Mulai Rp X.XXX.XXX"),
      estimatedDuration,
      renewalNote: String(formData.get("renewalNote") ?? "").trim(),
      isHighlighted: formData.get("isHighlighted") === "on",
      isPublished: formData.get("isPublished") === "on",
      sortOrder: parsePositiveInt(formData.get("sortOrder"), 1),
      features,
      addons,
    });

    return { ok: true, savedMessage: "Paket layanan berhasil disimpan." };
  }

  if (intent === "delete-package") {
    const id = parseOptionalId(formData.get("id"));
    if (id) {
      await deleteServicePackageRecord(env.DB, id);
    }
    return { ok: true, savedMessage: "Paket layanan berhasil dihapus." };
  }

  return null;
}

export default function AdminPaketRoute({ loaderData }: Route.ComponentProps) {
  const { categories, packages } = loaderData;
  const actionData = useActionData<typeof action>();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ServicePackage | null>(null);
  const [categoryId, setCategoryId] = React.useState<string>("1");
  const [isHighlighted, setIsHighlighted] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const [deleting, setDeleting] = React.useState<ServicePackage | null>(null);
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (actionData?.ok) {
      setDialogOpen(false);
    }
  }, [actionData]);

  const packageCountsByCategory = React.useMemo(() => {
    const counts: Record<number, number> = {};
    for (const pkg of packages) {
      counts[pkg.categoryId] = (counts[pkg.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [packages]);

  const openCreate = () => {
    setEditing(null);
    setCategoryId(String(categories[0]?.id ?? 1));
    setIsHighlighted(false);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEdit = (pkg: ServicePackage) => {
    setEditing(pkg);
    setCategoryId(String(pkg.categoryId));
    setIsHighlighted(pkg.isHighlighted);
    setIsPublished(pkg.isPublished);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display-anton text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none text-cream">
            Paket &amp; Harga
          </h1>
          <p className="mt-2 text-[14.5px] text-cream-dim">
            Kelola tab kategori, kartu harga, fitur kata kunci beserta tooltip detail, dan modul tambahan opsional.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah Paket</Button>
      </div>

      <AdminFeedbackBanner
        message={actionData?.savedMessage}
        error={actionData?.error}
      />

      <div
        tabIndex={0}
        role="region"
        aria-labelledby="packages-table-caption"
        className="admin-table-region rounded-[5px] border border-line bg-bg2"
      >
        <table className="admin-responsive-table w-full text-left text-[13.5px]">
          <caption id="packages-table-caption" className="sr-only">
            Daftar paket layanan dan harga
          </caption>
          <thead className="border-b border-line text-[12px] uppercase tracking-wide text-cream-dim">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Nama Paket
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Kategori
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Harga
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Estimasi
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
            {packages.map((pkg) => {
              const catName =
                categories.find((c) => c.id === pkg.categoryId)?.name ?? "-";
              return (
                <tr key={pkg.id}>
                  <th scope="row" className="px-4 py-3.5 font-semibold text-cream">
                    {pkg.name}
                    {pkg.isHighlighted ? (
                      <span className="ml-2 rounded-[3px] border border-rust px-1.5 py-0.5 text-[11px] font-normal text-cream">
                        Banyak Dipilih
                      </span>
                    ) : null}
                  </th>
                  <td data-label="Kategori" className="px-4 py-3.5 text-cream-dim">
                    {catName}
                  </td>
                  <td
                    data-label="Harga"
                    className="tabular-price px-4 py-3.5 font-medium text-cream"
                  >
                    {formatPackagePrice(pkg)}
                  </td>
                  <td data-label="Estimasi" className="px-4 py-3.5 text-cream-dim">
                    {pkg.estimatedDuration}
                  </td>
                  <td data-label="Status" className="px-4 py-3.5">
                    <span
                      className={
                        pkg.isPublished
                          ? "rounded-[3px] border border-rust bg-bg2 px-2 py-0.5 text-[12px] text-cream"
                          : "rounded-[3px] border border-line bg-bg2 px-2 py-0.5 text-[12px] text-cream-dim"
                      }
                    >
                      {pkg.isPublished ? "Publik" : "Draf"}
                    </span>
                  </td>
                  <td data-label="Aksi" className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Ubah paket ${pkg.name}`}
                        onClick={() => openEdit(pkg)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Hapus paket ${pkg.name}`}
                        onClick={() => setDeleting(pkg)}
                      >
                        <Trash2
                          className="h-3.5 w-3.5 text-rust"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PackageCategorySection
        categories={categories}
        packageCountsByCategory={packageCountsByCategory}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Ubah Paket Layanan" : "Tambah Paket Layanan"}
            </DialogTitle>
            <DialogDescription>
              Isi nominal angka Rupiah untuk memformat harga otomatis, atau isi label harga kustom jika memakai placeholder.
            </DialogDescription>
          </DialogHeader>

          <Form method="post" className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="intent" value="save-package" />
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            <input type="hidden" name="slug" value={editing?.slug ?? ""} />
            <input type="hidden" name="categoryId" value={categoryId} />
            {isHighlighted ? (
              <input type="hidden" name="isHighlighted" value="on" />
            ) : null}
            {isPublished ? (
              <input type="hidden" name="isPublished" value="on" />
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-name">Nama Paket</Label>
                <Input
                  id="pkg-name"
                  name="name"
                  autoFocus
                  required
                  defaultValue={editing?.name ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-cat-trigger">Kategori Paket</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="pkg-cat-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-tagline">Deskripsi Singkat Paket</Label>
              <Input
                id="pkg-tagline"
                name="tagline"
                required
                defaultValue={editing?.tagline ?? ""}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-price">Nominal Harga Dasar Rupiah</Label>
                <span id="pkg-price-hint" className="text-[12px] text-cream-dim">
                  Isi angka murni seperti 4500000, atau kosongkan bila memakai label kustom.
                </span>
                <Input
                  id="pkg-price"
                  name="startingPrice"
                  aria-describedby="pkg-price-hint"
                  placeholder="Contoh: 4500000"
                  defaultValue={editing?.startingPrice ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-price-label">Label Harga Kustom</Label>
                <span id="pkg-label-hint" className="text-[12px] text-cream-dim">
                  Kosongkan bila ingin memformat dari nominal angka secara otomatis.
                </span>
                <Input
                  id="pkg-price-label"
                  name="priceLabelOverride"
                  aria-describedby="pkg-label-hint"
                  placeholder="Mulai Rp X.XXX.XXX"
                  defaultValue={editing?.priceLabelOverride ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-duration">Estimasi Durasi Pengerjaan</Label>
                <Input
                  id="pkg-duration"
                  name="estimatedDuration"
                  required
                  placeholder="14–21 hari kerja"
                  defaultValue={editing?.estimatedDuration ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pkg-sort">Urutan Kartu</Label>
                <Input
                  id="pkg-sort"
                  type="number"
                  name="sortOrder"
                  min={1}
                  required
                  defaultValue={editing?.sortOrder ?? 1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-renewal">Catatan Perpanjangan Tahunan</Label>
              <Input
                id="pkg-renewal"
                name="renewalNote"
                defaultValue={editing?.renewalNote ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-features">Cakupan Fitur &amp; Tooltip</Label>
              <span id="pkg-feat-hint" className="text-[12px] text-cream-dim">
                Satu fitur per baris dengan format: Kata Kunci Fitur | Penjelasan Tooltip
              </span>
              <Textarea
                id="pkg-features"
                name="featuresText"
                rows={6}
                aria-describedby="pkg-feat-hint"
                required
                defaultValue={
                  editing
                    ? formatPackageFeaturesForTextarea(editing.features)
                    : ""
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-addons">Modul Tambahan Opsional</Label>
              <span id="pkg-addon-hint" className="text-[12px] text-cream-dim">
                Satu modul per baris dengan format: Nama Modul | + Rp Nominal
              </span>
              <Textarea
                id="pkg-addons"
                name="addonsText"
                rows={4}
                aria-describedby="pkg-addon-hint"
                defaultValue={
                  editing?.addons
                    .map((a) => `${a.name} | ${a.priceDisplay}`)
                    .join("\n") ?? ""
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3">
                <Label htmlFor="pkg-highlight-switch">Tandai Banyak Dipilih</Label>
                <Switch
                  id="pkg-highlight-switch"
                  checked={isHighlighted}
                  onCheckedChange={setIsHighlighted}
                />
              </div>

              <div className="flex items-center justify-between rounded-[4px] border border-line bg-bg px-4 py-3">
                <Label htmlFor="pkg-pub-switch">Tampilkan di Publik</Label>
                <Switch
                  id="pkg-pub-switch"
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
        <input type="hidden" name="intent" value="delete-package" />
        <input type="hidden" name="id" value={deleting?.id ?? ""} />
      </Form>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus Paket Layanan"
        description={`Apakah Anda yakin ingin menghapus paket "${deleting?.name ?? ""}"?`}
        onConfirm={() => {
          deleteFormRef.current?.requestSubmit();
          setDeleting(null);
        }}
      />
    </div>
  );
}
