import { cn } from "~/lib/utils";
import type { SiteSettings } from "~/types/content";
import { DeveloperVisualArt } from "~/components/public/developer-visual-art";

interface AboutSkillsSectionProps {
  settings: SiteSettings;
  onStartProject?: () => void;
  theme?: "light" | "dark";
}

export function AboutSkillsSection({
  settings,
  theme = "light",
}: AboutSkillsSectionProps) {
  const isLight = theme === "light";
  const paragraphs = settings.aboutBody
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <section
      id="tentang"
      className="grid w-full grid-cols-1 gap-2 min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-2 scroll-mt-20"
    >
      {/* Kartu Kiri: Judul Besar Tentang Saya & Foto Profil */}
      <article
        className={cn(
          "relative flex h-full min-h-[380px] sm:min-h-[440px] flex-col justify-between overflow-hidden rounded-[24px] p-8 outline-none sm:p-12 lg:p-14 border-0",
          isLight
            ? "bg-rust text-white shadow-sm"
            : "bg-cream text-bg",
        )}
      >
        <div className="relative z-10">
          <p
            className={cn(
              "text-[12.5px] font-bold uppercase tracking-wider",
              isLight ? "text-white/80" : "text-rust",
            )}
          >
            Profil Rekayasa Web
          </p>
          <h2
            className={cn(
              "font-display-anton mt-3 text-[clamp(2.75rem,6.5vw,5.5rem)] uppercase leading-[0.92] tracking-tight",
              isLight ? "text-white" : "text-bg",
            )}
          >
            {settings.aboutTitle || "Tentang Saya"}
          </h2>
        </div>

        {/* Karya Visual Dua Dimensi Pengembang (Kombinasi 1: Triptych Spektrum Vertikal) */}
        <DeveloperVisualArt theme={theme} />
      </article>

      {/* Kartu Kanan: Teks Narasi Pengembang Dinamis */}
      <article
        className={cn(
          "flex h-full min-h-[280px] flex-col justify-center rounded-[24px] p-8 outline-none sm:p-12 lg:p-16",
          isLight
            ? "bg-white border border-card-border text-cream shadow-xs"
            : "bg-cream text-bg border-0",
        )}
      >
        <div
          className={cn(
            "space-y-4 text-[15.5px] leading-[1.8] sm:text-[16.5px]",
            isLight ? "text-cream-dim" : "text-bg/90",
          )}
        >
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={index === 0 ? (isLight ? "font-medium text-cream" : "font-medium text-bg") : undefined}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}
