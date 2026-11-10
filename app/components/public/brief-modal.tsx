import * as React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { Textarea } from "~/components/ui/textarea";
import {
  buildWhatsAppBriefUrl,
  formatBriefEstimateSummary,
  formatPackagePrice,
} from "~/lib/whatsapp";
import type { ServicePackage } from "~/types/content";

interface BriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: ServicePackage[];
  initialPackage: ServicePackage | null;
  whatsappNumber: string;
}

export function BriefModal({
  open,
  onOpenChange,
  packages,
  initialPackage,
  whatsappNumber,
}: BriefModalProps) {
  const publishedPackages = React.useMemo(
    () => packages.filter((p) => p.isPublished),
    [packages],
  );

  const [selectedPackageId, setSelectedPackageId] = React.useState<string>("");
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<number[]>([]);
  const [fullName, setFullName] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      const target = initialPackage ?? publishedPackages[0] ?? null;
      setSelectedPackageId(target ? String(target.id) : "");
      setSelectedAddonIds([]);
      setFormError(null);
    }
  }, [open, initialPackage, publishedPackages]);

  const activePackage =
    publishedPackages.find((p) => String(p.id) === selectedPackageId) ??
    publishedPackages[0];

  const isCustomPackage = activePackage?.slug === "aplikasi-web-custom";

  const handleToggleAddon = (addonId: number, checked: boolean) => {
    setSelectedAddonIds((prev) =>
      checked ? [...prev, addonId] : prev.filter((id) => id !== addonId),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activePackage) return;

    if (!fullName.trim() || !organization.trim()) {
      setFormError(
        "Mohon lengkapi nama lengkap serta nama sekolah, instansi, atau bisnis.",
      );
      return;
    }

    if (isCustomPackage && !notes.trim()) {
      setFormError(
        "Mohon jelaskan gambaran sistem yang dibutuhkan pada kolom Catatan Kebutuhan untuk paket Aplikasi Web Custom.",
      );
      return;
    }

    const whatsappUrl = buildWhatsAppBriefUrl({
      fullName,
      organization,
      selectedPackage: activePackage,
      selectedAddonIds,
      notes,
      whatsappNumber,
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brief Proyek</DialogTitle>
          <DialogDescription>
            Isi rincian singkat di bawah ini untuk menyusun pesan konsultasi terstruktur langsung ke WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brief-fullname">Nama Lengkap</Label>
            <Input
              id="brief-fullname"
              name="fullName"
              autoFocus
              required
              autoComplete="name"
              placeholder="Contoh: Budi Santoso"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formError) setFormError(null);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brief-org">Nama Sekolah / Instansi / Bisnis</Label>
            <Input
              id="brief-org"
              name="organization"
              required
              autoComplete="organization"
              placeholder="Contoh: SMA Negeri 1 Harapan / CV Maju Jaya"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                if (formError) setFormError(null);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brief-package-trigger">Paket Layanan</Label>
            <Select
              value={selectedPackageId}
              onValueChange={(val) => {
                setSelectedPackageId(val);
                setSelectedAddonIds([]);
                if (formError) setFormError(null);
              }}
            >
              <SelectTrigger id="brief-package-trigger">
                <SelectValue placeholder="Pilih paket layanan" />
              </SelectTrigger>
              <SelectContent>
                {publishedPackages.map((pkg) => (
                  <SelectItem key={pkg.id} value={String(pkg.id)}>
                    {pkg.name} — {formatPackagePrice(pkg)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activePackage && activePackage.addons.length > 0 ? (
            <fieldset className="flex flex-col gap-2 rounded-[4px] border border-line bg-bg p-3.5">
              <legend className="px-1 text-[13px] font-medium text-cream">
                Fitur Tambahan Opsional
              </legend>
              {activePackage.addons.map((addon) => {
                const checkboxId = `brief-addon-${addon.id}`;
                const isChecked = selectedAddonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-start justify-between gap-3 py-1 text-[13.5px]"
                  >
                    <span className="flex items-start gap-2.5 text-cream-dim">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleToggleAddon(addon.id, checked === true)
                        }
                      />
                      <span className="leading-snug text-cream">{addon.name}</span>
                    </span>
                    <span className="tabular-price shrink-0 text-[12.5px] font-medium text-cream-dim">
                      {addon.priceDisplay}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="brief-notes">Catatan Kebutuhan</Label>
              <span className="text-[12px] text-cream-dim">
                {isCustomPackage ? "Wajib diisi" : "Opsional"}
              </span>
            </div>
            <span id="brief-notes-hint" className="text-[12.5px] text-cream-dim">
              Tuliskan target jadwal rilis, perkiraan jumlah pengguna, atau modul khusus yang dibutuhkan.
            </span>
            <Textarea
              id="brief-notes"
              name="notes"
              required={isCustomPackage}
              aria-describedby="brief-notes-hint"
              placeholder="Contoh: Kami membutuhkan sistem PPDB siap digunakan sebelum bulan Mei untuk 400 calon siswa."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (formError) setFormError(null);
              }}
            />
          </div>

          {activePackage ? (
            <div className="rounded-[4px] border border-line bg-bg px-3.5 py-3 text-[13px] leading-relaxed text-cream-dim">
              <div>
                Paket terpilih:{" "}
                <strong className="font-semibold text-cream">
                  {activePackage.name}
                </strong>{" "}
                — estimasi {activePackage.estimatedDuration}
              </div>
              <div className="tabular-price mt-1 text-cream">
                Ringkasan estimasi:{" "}
                <strong className="font-semibold">
                  {formatBriefEstimateSummary(activePackage, selectedAddonIds)}
                </strong>
              </div>
            </div>
          ) : null}

          {formError ? (
            <p role="alert" className="text-[13px] font-medium text-rust">
              {formError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Kirim ke WhatsApp</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
