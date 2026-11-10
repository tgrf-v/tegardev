import { cn } from "~/lib/utils";

interface DeveloperVisualArtProps {
  className?: string;
  theme?: "light" | "dark";
}

/**
 * Komponen karya visual grafis dua dimensi pengembang.
 * Menampilkan komposisi Triptych 3 Bilah Vertikal yang dipadukan dengan
 * pahatan spektrum batang vertikal modular (Kombinasi 1).
 */
export function DeveloperVisualArt({
  className,
}: DeveloperVisualArtProps) {
  return (
    <div
      className={cn(
        "relative -mb-8 -mx-8 mt-6 flex flex-1 items-end justify-center pointer-events-none select-none sm:-mb-12 sm:-mx-12 lg:-mb-14 lg:-mx-14",
        className,
      )}
    >
      <picture className="contents">
        <source srcSet="/images/tegar-triptych-equalizer.webp" type="image/webp" />
        <img
          src="/images/tegar-triptych-equalizer.png"
          alt="Tegar Rifa'i — Karya Visual Triptych Spektrum Vertikal"
          width={960}
          height={960}
          loading="lazy"
          decoding="async"
          className="w-72 sm:w-88 md:w-96 lg:w-[480px] max-w-full max-h-[360px] sm:max-h-[440px] lg:max-h-[520px] object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
        />
      </picture>
    </div>
  );
}
