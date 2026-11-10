import * as React from "react";
import { cn } from "~/lib/utils";

interface BrandWordmarkProps {
  className?: string;
}

/**
 * Wordmark raksasa TEGARDEV selebar kontainer menggunakan font Anton.
 * Menerapkan pengukuran rasio satu kali baca lalu satu kali tulis pada ResizeObserver
 * sebagai fallback progresif ketika CSS text-fit belum tersedia di browser pengunjung.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  const lockupRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const lockup = lockupRef.current;
    if (!lockup) return;
    if (typeof CSS !== "undefined" && CSS.supports("text-fit", "grow per-line-all 300%")) {
      return;
    }

    const fitLines = () => {
      const lines = Array.from(
        lockup.querySelectorAll<HTMLSpanElement>(":scope > span"),
      );
      if (lines.length === 0) return;

      for (const line of lines) {
        line.style.removeProperty("--text-fit-scale");
      }

      // Semua pembacaan geometri dilakukan terlebih dahulu sebelum penulisan style
      const containerWidth = lockup.clientWidth;
      const measuredWidths = lines.map((line) => line.offsetWidth || 1);
      const scales = measuredWidths.map((w) =>
        containerWidth > 0 ? containerWidth / w : 1,
      );

      lines.forEach((line, index) => {
        line.style.setProperty("--text-fit-scale", scales[index].toFixed(4));
      });
    };

    fitLines();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(fitLines).catch(() => {});
    }

    const observer = new ResizeObserver(() => {
      fitLines();
    });
    observer.observe(lockup);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={lockupRef}
      aria-label="tegardev"
      className={cn("wordmark-lockup select-none overflow-hidden", className)}
    >
      <span>
        <span className="text-cream">TEGAR</span>
        <span className="text-rust">DEV</span>
      </span>
    </div>
  );
}
