import { Button } from "~/components/ui/button";
import type { SiteSettings } from "~/types/content";

interface CtaBandSectionProps {
  settings: SiteSettings;
  onStartProject: () => void;
  theme?: "light" | "dark";
}

export function CtaBandSection({
  settings,
  onStartProject,
  theme = "light",
}: CtaBandSectionProps) {
  const isLight = theme === "light";

  return (
    <section className="deferred-section w-full rounded-[24px] bg-rust p-8 text-white sm:p-12 lg:p-16 border-0 outline-none shadow-md">
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-3xl font-display-anton text-[clamp(2rem,4.2vw,3.5rem)] uppercase leading-[1.05] text-white">
          {settings.ctaHeadline}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/90 sm:text-[16px]">
          {settings.ctaSubtext}
        </p>

        <div className="mt-8 flex items-center justify-center">
          <Button
            variant={isLight ? "default" : "onRustSolid"}
            size="lg"
            className={
              isLight
                ? "bg-white text-rust font-semibold hover:bg-white/90 border-0 shadow-sm"
                : undefined
            }
            onClick={onStartProject}
          >
            Konsultasi
          </Button>
        </div>
      </div>
    </section>
  );
}
