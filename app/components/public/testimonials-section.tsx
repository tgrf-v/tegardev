import * as React from "react";
import { TestimonialCard } from "~/components/public/testimonial-card";
import { cn } from "~/lib/utils";
import type { TestimonialItem } from "~/types/content";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  theme?: "light" | "dark";
}

export function TestimonialsSection({
  testimonials,
  theme = "light",
}: TestimonialsSectionProps) {
  const isLight = theme === "light";
  const published = React.useMemo(
    () => testimonials.filter((t) => t.isPublished),
    [testimonials],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = React.useState(false);

  // Memastikan data ulasan mencukupi untuk rotasi tanpa henti
  const extendedItems = React.useMemo(() => {
    if (published.length === 0) return [];
    let list = [...published];
    while (list.length < 8) {
      list = [...list, ...published];
    }
    return list;
  }, [published]);

  const len = extendedItems.length;

  // Navigasi ke ulasan berikutnya (geser ke kiri)
  const handleNext = React.useCallback(() => {
    if (isAnimating || len === 0) return;
    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % len);
      setIsAnimating(false);
    }, 550);
  }, [isAnimating, len]);

  // Navigasi ke ulasan sebelumnya (geser ke kanan)
  const handlePrev = React.useCallback(() => {
    if (isAnimating || len === 0) return;
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + len) % len);
      setIsAnimating(false);
    }, 550);
  }, [isAnimating, len]);

  // Rotasi otomatis ulasan bergerak ke kiri setiap 4,5 detik
  React.useEffect(() => {
    if (isPaused || isAnimating || len === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isAnimating, len, handleNext]);

  if (published.length === 0) return null;

  // Menentukan indeks ulasan yang masuk ke masing-masing kartu saat transisi
  const incomingIndex0 = direction === "next" ? (currentIndex + 1) % len : (currentIndex - 1 + len) % len;
  const incomingIndex1 = direction === "next" ? (currentIndex + 2) % len : currentIndex;
  const incomingIndex2 = direction === "next" ? (currentIndex + 3) % len : (currentIndex + 1) % len;
  const incomingIndex3 = direction === "next" ? (currentIndex + 4) % len : (currentIndex + 2) % len;

  return (
    <section
      id="testimoni"
      className={cn(
        "deferred-section w-full rounded-[24px] p-6 sm:p-10 lg:p-12 outline-none scroll-mt-20 overflow-hidden",
        isLight
          ? "bg-white border border-card-border shadow-xs"
          : "bg-bg2 border-0",
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[12.5px] font-bold uppercase tracking-wider text-rust">
            Ulasan Mitra &amp; Klien
          </p>
          <h2 className="font-display-anton mt-1 text-[clamp(2rem,3.8vw,3.25rem)] uppercase leading-none text-cream">
            Testimoni Klien
          </h2>
        </div>

        {/* Kontrol Navigasi Manual */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Ulasan sebelumnya"
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer",
              isLight
                ? "border border-line bg-white text-cream hover:border-rust hover:text-rust shadow-2xs"
                : "border border-white/15 bg-bg text-cream/80 hover:border-rust hover:text-white",
            )}
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Ulasan berikutnya"
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer",
              isLight
                ? "border border-line bg-white text-cream hover:border-rust hover:text-rust shadow-2xs"
                : "border border-white/15 bg-bg text-cream/80 hover:border-rust hover:text-white",
            )}
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* Grid 4 Kolom: Kolom merah tetap di posisi kiri seperti mask, kolom lainnya berukuran sama */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-4 sm:gap-5"
      >
        {/* Kolom 1: Kartu Merah Tetap (Sedikit Lebih Besar) */}
        <TestimonialCard
          isRed={true}
          theme={theme}
          currentReview={extendedItems[currentIndex]}
          incomingReview={extendedItems[incomingIndex0]}
          isAnimating={isAnimating}
          direction={direction}
        />

        {/* Kolom 2: Kartu Biasa */}
        <TestimonialCard
          isRed={false}
          theme={theme}
          currentReview={extendedItems[(currentIndex + 1) % len]}
          incomingReview={extendedItems[incomingIndex1]}
          isAnimating={isAnimating}
          direction={direction}
        />

        {/* Kolom 3: Kartu Biasa */}
        <TestimonialCard
          isRed={false}
          theme={theme}
          currentReview={extendedItems[(currentIndex + 2) % len]}
          incomingReview={extendedItems[incomingIndex2]}
          isAnimating={isAnimating}
          direction={direction}
        />

        {/* Kolom 4: Kartu Biasa */}
        <TestimonialCard
          isRed={false}
          theme={theme}
          currentReview={extendedItems[(currentIndex + 3) % len]}
          incomingReview={extendedItems[incomingIndex3]}
          isAnimating={isAnimating}
          direction={direction}
        />
      </div>
    </section>
  );
}
