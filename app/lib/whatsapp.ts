import type { ServicePackage } from "~/types/content";

export function formatPackagePrice(
  pkg: Pick<ServicePackage, "startingPrice" | "priceLabelOverride">,
): string {
  if (pkg.priceLabelOverride && pkg.priceLabelOverride.trim().length > 0) {
    return pkg.priceLabelOverride.trim();
  }
  if (typeof pkg.startingPrice === "number" && pkg.startingPrice > 0) {
    return `Mulai Rp ${new Intl.NumberFormat("id-ID").format(pkg.startingPrice)}`;
  }
  return "Mulai Rp X.XXX.XXX";
}

export function formatBriefEstimateSummary(
  pkg: ServicePackage,
  selectedAddonIds: number[],
): string {
  const chosenAddons = pkg.addons.filter((addon) =>
    selectedAddonIds.includes(addon.id),
  );

  if (chosenAddons.length === 0) {
    return formatPackagePrice(pkg);
  }

  const allNumeric =
    typeof pkg.startingPrice === "number" &&
    pkg.startingPrice > 0 &&
    chosenAddons.every(
      (addon) => typeof addon.addonPrice === "number" && addon.addonPrice > 0,
    );

  if (allNumeric) {
    const total =
      (pkg.startingPrice ?? 0) +
      chosenAddons.reduce((sum, addon) => sum + (addon.addonPrice ?? 0), 0);
    return `Mulai Rp ${new Intl.NumberFormat("id-ID").format(total)} termasuk ${chosenAddons.length} fitur tambahan`;
  }

  const addonNames = chosenAddons.map((addon) => addon.name).join(", ");
  return `${formatPackagePrice(pkg)} + ${chosenAddons.length} fitur tambahan: ${addonNames}`;
}

export interface BriefSubmissionPayload {
  fullName: string;
  organization: string;
  selectedPackage: ServicePackage;
  selectedAddonIds: number[];
  notes: string;
  whatsappNumber: string;
}

export function buildWhatsAppBriefUrl(payload: BriefSubmissionPayload): string {
  const chosenAddons = payload.selectedPackage.addons.filter((addon) =>
    payload.selectedAddonIds.includes(addon.id),
  );

  const addonSummary =
    chosenAddons.length > 0
      ? chosenAddons.map((a) => `${a.name} (${a.priceDisplay})`).join(", ")
      : "Tidak ada";

  const trimmedNotes = payload.notes.trim() || "Belum ada catatan tambahan.";

  const lines = [
    "Halo Tegar, saya ingin berkonsultasi mengenai pembuatan website.",
    "",
    `Nama: ${payload.fullName.trim()}`,
    `Instansi/Bisnis: ${payload.organization.trim()}`,
    `Paket Pilihan: ${payload.selectedPackage.name} (${formatPackagePrice(payload.selectedPackage)})`,
    `Fitur Tambahan: ${addonSummary}`,
    "Catatan Kebutuhan:",
    trimmedNotes,
  ];

  const cleanNumber = payload.whatsappNumber.replace(/\D/g, "");
  const encodedText = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
