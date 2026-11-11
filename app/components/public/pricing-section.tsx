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
  theme?: "light" | "dark";
}

export function PricingSection({
  categories,
  packages,
  pricingText,
  onSelectPackage,
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
            <div className="mt-5 max-w-3xl space-y-3">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={cn(
                    "text-[15px] sm:text-[16px] leading-relaxed",
                    isLight ? "text-cream-dim" : "text-cream/80",
                    idx === 0 ? "font-normal text-cream" : "",
                  )}
                >
                  {p}
                </p>
              ))}
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
            <div className="mt-5 max-w-3xl space-y-3">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={cn(
                    "text-[15px] sm:text-[16px] leading-relaxed",
                    isLight ? "text-cream-dim" : "text-cream/80",
                    idx === 0 ? "font-normal text-cream" : "",
                  )}
                >
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
