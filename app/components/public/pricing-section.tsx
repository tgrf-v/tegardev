import * as React from "react";
import { PackageCard } from "~/components/public/package-card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import type { PackageCategory, ServicePackage } from "~/types/content";

interface PricingSectionProps {
  categories: PackageCategory[];
  packages: ServicePackage[];
  pricingText?: string;
  onSelectPackage?: (pkg: ServicePackage) => void;
  onStartProject?: () => void;
  theme?: "light" | "dark";
}

export function PricingSection({
  categories,
  packages,
  pricingText,
  onSelectPackage,
  onStartProject,
  theme = "light",
}: PricingSectionProps) {
  const isLight = theme === "light";
  const publishedPackages = React.useMemo(
    () => packages.filter((p) => p.isPublished),
    [packages],
  );

  const hasPackages = categories.length > 0 && publishedPackages.length > 0;

  const [activeCategoryId, setActiveCategoryId] = React.useState<number>(
    () => categories[0]?.id ?? 1,
  );
  const panelsWrapperRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const wrapper = panelsWrapperRef.current;
    if (!wrapper) return;

    const handleBeforeMatch = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const matchedPanel = target?.closest<HTMLElement>("[data-category-id]");
      if (!matchedPanel) return;
      const foundId = Number(matchedPanel.dataset.categoryId);
      if (!Number.isNaN(foundId)) {
        setActiveCategoryId(foundId);
      }
    };

    wrapper.addEventListener("beforematch", handleBeforeMatch);
    return () => wrapper.removeEventListener("beforematch", handleBeforeMatch);
  }, []);

  const paragraphs = React.useMemo(() => {
    if (!pricingText) return [];
    return pricingText.split("\n\n").filter(Boolean);
  }, [pricingText]);

  return (
    <section
      id="daftar-harga"
      className={cn(
        "deferred-section w-full rounded-[24px] p-6 sm:p-10 lg:p-14 outline-none scroll-mt-20",
        isLight
          ? "bg-white border border-card-border shadow-xs"
          : "bg-bg2 border-0",
      )}
    >
      {hasPackages ? (
        <Tabs
          value={String(activeCategoryId)}
          onValueChange={(val) => setActiveCategoryId(Number(val))}
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[12.5px] font-bold uppercase tracking-wider text-rust">
                Biaya &amp; Estimasi Waktu
              </p>
              <h2 className="font-display-anton mt-1 text-[clamp(2rem,3.8vw,3.25rem)] uppercase leading-none text-cream">
                Daftar Harga
              </h2>
            </div>

            <TabsList aria-label="Kategori paket layanan">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  id={`tab-kategori-${category.slug}`}
                  value={String(category.id)}
                  aria-controls={`panel-kategori-${category.slug}`}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {paragraphs.length > 0 ? (
            <div
              className={cn(
                "mt-8 rounded-[16px] p-6 sm:p-8 border",
                isLight
                  ? "border-card-border bg-[#faf9f5]"
                  : "border-line bg-[#161616]",
              )}
            >
              <div className="max-w-3xl space-y-4">
                {paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={cn(
                      "text-[15px] sm:text-[16px] leading-relaxed",
                      idx === 0
                        ? "font-medium text-cream"
                        : "text-[14px] sm:text-[14.5px] text-cream-dim border-t border-line/40 pt-4",
                    )}
                  >
                    {p}
                  </p>
                ))}
              </div>
              {onStartProject ? (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onStartProject}
                    className="inline-flex h-11 items-center justify-center rounded-[8px] bg-rust px-6 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  >
                    Konsultasi Kebutuhan Proyek
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          <div ref={panelsWrapperRef} className="mt-8">
            {categories.map((category) => {
              const isSelected = category.id === activeCategoryId;
              const categoryPackages = publishedPackages.filter(
                (pkg) => pkg.categoryId === category.id,
              );

              return (
                <div
                  key={category.id}
                  id={`panel-kategori-${category.slug}`}
                  role="tabpanel"
                  aria-labelledby={`tab-kategori-${category.slug}`}
                  data-category-id={category.id}
                  {...(!isSelected
                    ? ({
                        hidden: "until-found",
                      } as unknown as React.HTMLAttributes<HTMLDivElement>)
                    : {})}
                >
                  <div className="flex flex-wrap items-stretch justify-center gap-6">
                    {categoryPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex w-full max-w-[380px] sm:w-[350px] lg:w-[360px]"
                      >
                        <PackageCard
                          pkg={pkg}
                          onSelectPackage={onSelectPackage ?? (() => {})}
                          theme={theme}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs>
      ) : (
        <div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[12.5px] font-bold uppercase tracking-wider text-rust">
                Biaya &amp; Estimasi Waktu
              </p>
              <h2 className="font-display-anton mt-1 text-[clamp(2rem,3.8vw,3.25rem)] uppercase leading-none text-cream">
                Daftar Harga
              </h2>
            </div>
          </div>

          {paragraphs.length > 0 ? (
            <div
              className={cn(
                "mt-8 rounded-[16px] p-6 sm:p-8 border",
                isLight
                  ? "border-card-border bg-[#faf9f5]"
                  : "border-line bg-[#161616]",
              )}
            >
              <div className="max-w-3xl space-y-4">
                {paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={cn(
                      "text-[15px] sm:text-[16px] leading-relaxed",
                      idx === 0
                        ? "font-medium text-cream"
                        : "text-[14px] sm:text-[14.5px] text-cream-dim border-t border-line/40 pt-4",
                    )}
                  >
                    {p}
                  </p>
                ))}
              </div>
              {onStartProject ? (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onStartProject}
                    className="inline-flex h-11 items-center justify-center rounded-[8px] bg-rust px-6 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  >
                    Konsultasi Kebutuhan Proyek
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
