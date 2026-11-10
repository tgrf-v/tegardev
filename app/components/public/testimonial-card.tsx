import * as React from "react";
import { cn } from "~/lib/utils";
import type { TestimonialItem } from "~/types/content";

export interface TestimonialCardProps {
  isRed: boolean;
  currentReview: TestimonialItem;
  incomingReview: TestimonialItem;
  isAnimating: boolean;
  direction: "next" | "prev";
  theme?: "light" | "dark";
}

export function TestimonialCard({
  isRed,
  currentReview,
  incomingReview,
  isAnimating,
  direction,
  theme = "light",
}: TestimonialCardProps) {
  const isLight = theme === "light";

  return (
    <figure
      className={cn(
        "relative flex flex-col justify-between rounded-[20px] p-6 sm:p-7 select-none overflow-hidden min-h-[340px] sm:min-h-[360px]",
        isRed
          ? "bg-rust text-white shadow-md border-0"
          : isLight
          ? "bg-white text-cream border border-card-border shadow-xs"
          : "bg-bg text-cream border border-white/5 shadow-xs",
      )}
    >
      {/* Jika kolom merah, tampilkan header tetap yang bertindak sebagai mask permanen */}
      {isRed && (
        <div className="relative z-10 mb-4 shrink-0">
          <p className="font-display-anton text-[22px] sm:text-[24px] uppercase tracking-normal text-white leading-none">
            Kepuasan Nyata
          </p>
        </div>
      )}

      {/* Layer ulasan di bawahnya yang bergerak dan bertransisi */}
      <div className="relative z-0 flex-1 overflow-hidden w-full flex flex-col justify-between">
        {/* Ulasan saat ini (keluar ke kiri saat aksi selanjutnya) */}
        <div
          className={cn(
            "flex flex-col justify-between h-full w-full",
            isAnimating && direction === "next" && "animate-review-slide-out-left",
            isAnimating && direction === "prev" && "animate-review-slide-out-right",
          )}
        >
          <blockquote
            className={cn(
              "leading-[1.65]",
              isRed
                ? "text-[14.5px] sm:text-[15px] font-medium text-white"
                : "text-[13.5px] sm:text-[14px] text-cream/90",
            )}
          >
            &ldquo;{currentReview.quote}&rdquo;
          </blockquote>

          <figcaption
            className={cn(
              "mt-5 border-t pt-3.5",
              isRed ? "border-white/20" : "border-line",
            )}
          >
            <p
              className={cn(
                "font-bold leading-tight",
                isRed ? "text-[14.5px] text-white" : "text-[14px] text-cream",
              )}
            >
              {currentReview.clientName}
            </p>
            <p
              className={cn(
                "mt-1 text-[12px] leading-snug",
                isRed ? "text-white/80" : "text-cream-dim",
              )}
            >
              {currentReview.clientRoleOrg}
            </p>
          </figcaption>
        </div>

        {/* Ulasan berikutnya yang masuk */}
        {isAnimating && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-between h-full w-full",
              direction === "next" && "animate-review-slide-in-right",
              direction === "prev" && "animate-review-slide-in-left",
            )}
          >
            <blockquote
              className={cn(
                "leading-[1.65]",
                isRed
                  ? "text-[14.5px] sm:text-[15px] font-medium text-white"
                  : "text-[13.5px] sm:text-[14px] text-cream/90",
              )}
            >
              &ldquo;{incomingReview.quote}&rdquo;
            </blockquote>

            <figcaption
              className={cn(
                "mt-5 border-t pt-3.5",
                isRed ? "border-white/20" : "border-line",
              )}
            >
              <p
                className={cn(
                  "font-bold leading-tight",
                  isRed ? "text-[14.5px] text-white" : "text-[14px] text-cream",
                )}
              >
                {incomingReview.clientName}
              </p>
              <p
                className={cn(
                  "mt-1 text-[12px] leading-snug",
                  isRed ? "text-white/80" : "text-cream-dim",
                )}
              >
                {incomingReview.clientRoleOrg}
              </p>
            </figcaption>
          </div>
        )}
      </div>
    </figure>
  );
}
