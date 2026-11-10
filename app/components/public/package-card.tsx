import * as React from "react";
import { Check, Clock, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatPackagePrice } from "~/lib/whatsapp";
import { cn } from "~/lib/utils";
import type { ServicePackage } from "~/types/content";

interface PackageCardProps {
  pkg: ServicePackage;
  onSelectPackage: (pkg: ServicePackage) => void;
  theme?: "light" | "dark";
}

export function PackageCard({
  pkg,
  onSelectPackage,
  theme = "light",
}: PackageCardProps) {
  const isLight = theme === "light";
  const [addonsOpen, setAddonsOpen] = React.useState(false);

  return (
    <article
      className={cn(
        "relative flex w-full h-full flex-col justify-between rounded-[24px] p-6 sm:p-8 transition-all duration-300 border outline-none",
        isLight ? "bg-white" : "bg-[#141414]",
        pkg.isHighlighted
          ? isLight
            ? "border-rust shadow-md ring-1 ring-rust/30 lg:-translate-y-1 lg:scale-[1.02]"
            : "border-rust shadow-[0_0_25px_-5px_rgba(192,56,0,0.45)] ring-1 ring-rust/50 lg:-translate-y-1 lg:scale-[1.02]"
          : isLight
          ? "border-line hover:border-slate-300 shadow-xs"
          : "border-white/10 hover:border-white/20",
      )}
    >
      <div>
        {/* Header Kartu: Badge Unggulan (Jika Ada) & Nama Paket */}
        <div>
          {pkg.isHighlighted ? (
            <div className="mb-3">
              <span className="inline-block rounded-full bg-rust px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white border-0">
                Banyak Dipilih
              </span>
            </div>
          ) : null}

          <h3 className="text-[22px] font-bold tracking-tight text-cream">
            {pkg.name}
          </h3>

          {/* Sub-deskripsi: 1 kalimat sasaran target audiens */}
          <p
            className={cn(
              "mt-2 text-[13.5px] leading-relaxed",
              isLight ? "text-cream-dim" : "text-zinc-400",
            )}
          >
            {pkg.tagline}
          </p>

          {/* Harga & Durasi */}
          <div className="mt-5 flex items-baseline gap-2">
            <span className="tabular-price text-[28px] sm:text-[32px] font-bold tracking-tight text-cream">
              {formatPackagePrice(pkg)}
            </span>
          </div>

          <div
            className={cn(
              "mt-1.5 flex items-center gap-1.5 text-[12.5px]",
              isLight ? "text-cream-dim" : "text-zinc-400",
            )}
          >
            <Clock className="h-3.5 w-3.5 shrink-0 text-rust" aria-hidden="true" />
            <span>Estimasi pengerjaan: {pkg.estimatedDuration}</span>
          </div>

          {/* Tombol CTA di Bagian Atas Langsung di Bawah Harga */}
          <div className="mt-6">
            <Button
              variant={pkg.isHighlighted ? "default" : "outline"}
              className={cn(
                "w-full py-2.5 font-semibold text-[14px]",
                pkg.isHighlighted
                  ? "bg-rust text-white hover:bg-rust-dark border-0"
                  : isLight
                  ? "border-line hover:bg-slate-50 text-cream"
                  : "border-white/20 hover:border-white text-cream bg-transparent",
              )}
              onClick={() => onSelectPackage(pkg)}
            >
              Pilih Paket
            </Button>
            <p
              className={cn(
                "mt-2 text-center text-[11.5px]",
                isLight ? "text-cream-dim" : "text-zinc-400",
              )}
            >
              Konsultasi awal &amp; penyelarasan modul gratis
            </p>
          </div>
        </div>

        {/* Pemisah Halus */}
        <div
          className={cn(
            "my-6 border-t",
            isLight ? "border-line" : "border-white/10",
          )}
        />

        {/* Daftar Fitur: Kata Kunci Ringkas dengan Tooltip Detail */}
        <div>
          <p
            className={cn(
              "text-[12px] font-bold uppercase tracking-wider mb-3.5",
              isLight ? "text-cream-dim" : "text-zinc-400",
            )}
          >
            Cakupan Fitur
          </p>
          <TooltipProvider delayDuration={150}>
            <ul className="flex flex-col gap-2.5">
              {pkg.features.map((feat) => (
                <li
                  key={feat.id}
                  className={cn(
                    "flex items-center gap-2.5 text-[13.5px]",
                    isLight ? "text-cream" : "text-zinc-300",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isLight ? "text-emerald-600" : "text-emerald-400",
                    )}
                    aria-hidden="true"
                  />
                  <span>{feat.featureText}</span>
                  {feat.tooltip ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer border-0 p-0 bg-transparent",
                            isLight
                              ? "text-cream-dim hover:text-cream"
                              : "text-zinc-500 hover:text-cream",
                          )}
                          aria-label={`Detail informasi ${feat.featureText}`}
                        >
                          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{feat.tooltip}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </li>
              ))}
            </ul>
          </TooltipProvider>
        </div>

        {/* Modul Tambahan Opsional: Teks Polos Ringkas Tanpa Kotak Card */}
        {pkg.addons.length > 0 ? (
          <div
            className={cn(
              "mt-4 border-t pt-3.5",
              isLight ? "border-line" : "border-white/10",
            )}
          >
            <button
              type="button"
              onClick={() => setAddonsOpen(!addonsOpen)}
              className="flex w-full items-center justify-between text-[12px] font-medium text-rust/90 hover:text-rust transition-colors cursor-pointer border-0 bg-transparent p-0"
              aria-expanded={addonsOpen}
            >
              <span>
                {addonsOpen
                  ? "Sembunyikan Modul Tambahan"
                  : `+ Lihat ${pkg.addons.length} Modul Tambahan`}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  addonsOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {addonsOpen ? (
              <ul className="mt-2.5 flex flex-col gap-2 pt-1">
                {pkg.addons.map((addon) => (
                  <li
                    key={addon.id}
                    className={cn(
                      "flex items-baseline justify-between gap-3 text-[12px] leading-snug",
                      isLight ? "text-cream-dim" : "text-zinc-400",
                    )}
                  >
                    <span>{addon.name}</span>
                    <span
                      className={cn(
                        "shrink-0 text-[11.5px] tabular-price",
                        isLight ? "text-cream-dim" : "text-zinc-400",
                      )}
                    >
                      {addon.priceDisplay}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Catatan Perpanjangan di Bagian Dasar */}
      {pkg.renewalNote ? (
        <div
          className={cn(
            "mt-6 border-t pt-4",
            isLight ? "border-line" : "border-white/10",
          )}
        >
          <p
            className={cn(
              "text-[11.5px] leading-relaxed",
              isLight ? "text-cream-dim" : "text-zinc-400",
            )}
          >
            {pkg.renewalNote}
          </p>
        </div>
      ) : null}
    </article>
  );
}
