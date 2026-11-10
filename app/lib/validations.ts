export function toSlug(input: string, fallbackPrefix: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || `${fallbackPrefix}-${Date.now()}`;
}

export function parsePositiveInt(
  raw: FormDataEntryValue | null,
  fallback = 1,
): number {
  const parsed = Number(String(raw ?? "").trim());
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
}

export function parseOptionalId(
  raw: FormDataEntryValue | null,
): number | undefined {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function parsePackageFeatureLines(
  rawText: string,
): { featureText: string; tooltip: string | null }[] {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      if (separatorIndex === -1) {
        return { featureText: line, tooltip: null };
      }
      const featureText = line.slice(0, separatorIndex).trim();
      const tooltipRaw = line.slice(separatorIndex + 1).trim();
      return {
        featureText,
        tooltip: tooltipRaw.length > 0 ? tooltipRaw : null,
      };
    })
    .filter((entry) => entry.featureText.length > 0);
}

export function formatPackageFeaturesForTextarea(
  features: { featureText: string; tooltip: string | null }[],
): string {
  return features
    .map((feat) =>
      feat.tooltip ? `${feat.featureText} | ${feat.tooltip}` : feat.featureText,
    )
    .join("\n");
}

export function parsePackageAddonLines(
  rawText: string,
): { name: string; addonPrice: number | null; priceDisplay: string }[] {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      const name =
        separatorIndex === -1 ? line : line.slice(0, separatorIndex).trim();
      const pricePart =
        separatorIndex === -1 ? "" : line.slice(separatorIndex + 1).trim();
      const digitsOnly = pricePart.replace(/\D/g, "");
      const numeric = digitsOnly ? Number(digitsOnly) : NaN;
      const validPrice =
        Number.isFinite(numeric) && numeric > 0 ? numeric : null;

      let priceDisplay = pricePart;
      if (!priceDisplay) {
        priceDisplay = "+ Rp X.XXX.XXX";
      } else if (validPrice && /^\d+$/.test(pricePart)) {
        priceDisplay = `+ Rp ${new Intl.NumberFormat("id-ID").format(validPrice)}`;
      }

      return {
        name,
        addonPrice: validPrice,
        priceDisplay,
      };
    })
    .filter((entry) => entry.name.length > 0);
}
