import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import type { FaqItem } from "~/types/content";

interface FaqSectionProps {
  faqs: FaqItem[];
  theme?: "light" | "dark";
}

export function FaqSection({ faqs, theme = "light" }: FaqSectionProps) {
  const isLight = theme === "light";
  const published = faqs.filter((f) => f.isPublished);
  if (published.length === 0) return null;

  return (
    <section
      id="tanya-jawab"
      className={cn(
        "deferred-section w-full rounded-[24px] p-6 sm:p-10 lg:p-14 outline-none scroll-mt-20",
        isLight
          ? "bg-white border border-card-border shadow-xs"
          : "bg-bg2 border-0",
      )}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="text-[12.5px] font-bold uppercase tracking-wider text-rust">
            Informasi Transparan
          </p>
          <h2 className="font-display-anton mt-1 text-[clamp(2rem,3.8vw,3.25rem)] uppercase leading-none text-cream">
            Tanya Jawab
          </h2>
        </div>

        <div
          className={cn(
            "divide-y rounded-[16px] outline-none lg:col-span-8",
            isLight
              ? "bg-white border border-line divide-line"
              : "bg-bg border-0 divide-line/40",
          )}
        >
          {published.map((item, idx) => (
            <details
              key={item.id}
              name="faq-tegardev"
              open={idx === 0}
              className="faq-disclosure group"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[15.5px] font-semibold text-cream transition-colors hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rust">
                <span>{item.question}</span>
                <ChevronDown
                  className="h-4.5 w-4.5 shrink-0 text-cream-dim transition-transform duration-200 group-open:rotate-180 group-open:text-rust"
                  aria-hidden="true"
                />
              </summary>
              <div className="faq-answer px-6 pb-5 text-[14.5px] leading-[1.7] text-cream-dim">
                <p className="max-w-[68ch]">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
