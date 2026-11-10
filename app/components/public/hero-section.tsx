import { BrandWordmark } from "~/components/public/brand-wordmark";
import { cn } from "~/lib/utils";
import type { SiteSettings } from "~/types/content";

interface HeroSectionProps {
  settings: SiteSettings;
  onStartProject?: () => void;
  theme?: "light" | "dark";
}

export function HeroSection({ settings, theme = "light" }: HeroSectionProps) {
  const isLight = theme === "light";

  return (
    <section
      id="beranda"
      className={cn(
        "relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-8 lg:rounded-[24px] lg:p-10 pb-0 sm:pb-0 lg:pb-0 outline-none scroll-mt-20",
        isLight
          ? "bg-white border border-card-border shadow-xs"
          : "bg-bg2 border-0",
      )}
    >
      {/* Background Gambar Duotone Merah-Putih (Opsi B: Aksen Sisi Kanan) */}
      {isLight && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          <img
            src="/images/hero-duotone-botanical.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-right opacity-90 [mask-image:linear-gradient(to_right,transparent_15%,black_80%)] [-webkit-mask-image:linear-gradient(to_right,transparent_15%,black_80%)]"
          />
        </div>
      )}

      {/* Background Gambar Duotone Merah-Putih Botani (Tema Terang) */}
      {isLight && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          <img
            src="/images/hero-duotone.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-90"
          />
        </div>
      )}

      {/* Gambar Background Tema Gelap Bertekstur Heksagonal 3D (Hanya pada tema gelap) */}
      {!isLight && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          <img
            src="/media/hero-bg-dark.png"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-40 mix-blend-screen"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Bagian Atas: Headline Utama Membentang Bersih */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="font-sans text-[clamp(2rem,3.8vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-cream">
          {settings.heroHeadline}
        </h1>
      </div>

      {/* Bagian Bawah: Wordmark Raksasa Menempel di Dasar Kartu Hero */}
      <div className="relative z-10 mt-auto w-full pt-4 leading-none select-none">
        <BrandWordmark />
      </div>
    </section>
  );
}
