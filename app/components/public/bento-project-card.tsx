import * as React from "react";
import type { ProjectItem } from "~/types/content";

interface BentoProjectCardProps {
  project: ProjectItem;
  index: number;
  isPrimary?: boolean;
  theme?: "light" | "dark";
}

export function BentoProjectCard({
  project,
  index,
  isPrimary = false,
  theme = "light",
}: BentoProjectCardProps) {
  const isLight = theme === "light";
  const [isFlipped, setIsFlipped] = React.useState(false);
  const isPriorityImage = index === 0;

  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleFlip();
    }
  };

  return (
    <article
      className={`group relative flex flex-col rounded-[16px] border border-line bg-bg transition-colors duration-200 ${
        isPrimary
          ? "lg:col-span-2 lg:row-span-2"
          : "lg:col-span-1 lg:row-span-1"
      }`}
    >
      {/* Tampilan Mobile: Kartu Flip 3D (1 Kolom Vertikal) */}
      <div
        className="flip-perspective relative h-[260px] sm:h-[300px] w-full cursor-pointer select-none lg:hidden"
        onClick={handleToggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`${project.title} - ${
          isFlipped ? "Tutup ringkasan proyek" : "Lihat ringkasan proyek"
        }`}
      >
        <div className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
          {/* Muka Depan: Visual Mockup Proyek (Penuh tanpa baris bawah) */}
          <div className="flip-card-front overflow-hidden rounded-[16px] border border-line bg-bg">
            <img
              src={project.imageUrl}
              alt={project.imageAlt}
              width={800}
              height={500}
              loading={isPriorityImage ? undefined : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Muka Belakang: Nama dan Deskripsi Singkat */}
          <div className="flip-card-back flex flex-col justify-between rounded-[16px] border border-line bg-bg p-6">
            <div>
              <h3 className="text-[20px] font-semibold leading-snug text-cream">
                {project.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-cream-dim">
                {project.summary}
              </p>
            </div>
            <div className="pt-4 border-t border-line/50">
              <span className="text-[12px] font-medium text-rust">
                Ketuk untuk kembali
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Desktop: Bento Grid Asimetris (2 Kolom / 1 Kolom) */}
      <div
        className={`hidden h-full flex-col justify-between overflow-hidden rounded-[16px] lg:flex ${
          isPrimary ? "p-6" : "p-5"
        }`}
      >
        <div
          className={`overflow-hidden rounded-[10px] ${
            isLight
              ? "bg-slate-50 border border-line"
              : "bg-black/40 border border-line/30"
          } ${isPrimary ? "flex-1 min-h-[280px]" : "h-[160px]"}`}
        >
          <img
            src={project.imageUrl}
            alt={project.imageAlt}
            width={isPrimary ? 960 : 640}
            height={isPrimary ? 600 : 400}
            fetchPriority={isPriorityImage ? "high" : undefined}
            loading={isPriorityImage ? undefined : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        <div className={isPrimary ? "mt-5" : "mt-4 flex-1 flex flex-col justify-start"}>
          <h3
            className={`font-semibold text-cream leading-snug ${
              isPrimary ? "text-[22px]" : "text-[17px]"
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`text-cream-dim leading-relaxed ${
              isPrimary
                ? "mt-2.5 text-[14.5px] max-w-[65ch]"
                : "mt-1.5 text-[13px] line-clamp-3"
            }`}
          >
            {project.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
