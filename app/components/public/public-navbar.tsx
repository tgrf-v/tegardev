import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface PublicNavbarProps {
  onStartProject: () => void;
  theme?: "light" | "dark";
}

const LEFT_NAV_ITEMS = [
  { label: "Tentang", href: "#tentang" },
  { label: "Proyek", href: "#proyek" },
  { label: "Daftar Harga", href: "#daftar-harga" },
];

const RIGHT_NAV_ITEMS = [
  { label: "Testimoni", href: "#testimoni" },
  { label: "Tanya Jawab", href: "#tanya-jawab" },
];

export function PublicNavbar({ onStartProject, theme = "light" }: PublicNavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isLight = theme === "light";

  return (
    <header className="sticky-nav-shell relative w-full bg-page-bg pt-2 pb-2">
      <div className="sticky-nav-card flex h-14 items-center justify-between px-5 sm:h-16 sm:px-8">
        {/* Navigasi Kiri Desktop */}
        <nav
          aria-label="Navigasi kiri"
          className="hidden flex-1 items-center gap-6 lg:flex"
        >
          {LEFT_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white no-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Logo & Wordmark Tengah */}
        <a
          href="#beranda"
          className="flex items-center gap-2.5 font-display-anton text-[24px] uppercase tracking-normal text-white no-underline sm:text-[28px]"
        >
          <svg
            viewBox="0 0 1200 1200"
            className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 text-white fill-current"
            aria-hidden="true"
          >
            <polygon points="107,588 330,526 480,1079 257,1141" />
            <polygon points="306,91 1091,91 1091,877 587,877 587,525 799,525 799,350 306,350" />
          </svg>
          <span>
            <span>tegar</span>
            <span className="text-white/80">dev</span>
          </span>
        </a>

        {/* Navigasi Kanan & Tombol Desktop */}
        <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
          <nav aria-label="Navigasi kanan" className="flex items-center gap-6">
            {RIGHT_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13.5px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white no-underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={onStartProject}
            className={
              isLight
                ? "cursor-pointer rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-rust transition-colors hover:bg-white/90 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white border-0 shadow-xs"
                : "cursor-pointer rounded-full bg-bg px-5 py-2 text-[13px] font-medium text-cream transition-colors hover:bg-bg2 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white border-0"
            }
          >
            Konsultasi
          </button>
        </div>

        {/* Tombol Menu Mobile */}
        <div className="flex items-center lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Buka navigasi utama"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:text-white/80 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer border-0"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="flex items-center gap-2 font-display-anton text-[22px] tracking-tight">
                <svg
                  viewBox="0 0 1200 1200"
                  className="h-5 w-5 shrink-0 text-rust fill-current"
                  aria-hidden="true"
                >
                  <polygon points="107,588 330,526 480,1079 257,1141" />
                  <polygon points="306,91 1091,91 1091,877 587,877 587,525 799,525 799,350 306,350" />
                </svg>
                <span>
                  <span className="text-cream">TEGAR</span>
                  <span className="text-rust">DEV</span>
                </span>
              </SheetTitle>
              <nav
                aria-label="Navigasi seluler"
                className="mt-8 flex flex-col gap-1 border-t border-line pt-6"
              >
                {[...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS].map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="rounded-full px-4 py-2.5 text-[15px] font-medium text-cream-dim transition-colors hover:bg-bg hover:text-cream no-underline"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto border-t border-line pt-6">
                <Button
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    onStartProject();
                  }}
                >
                  Konsultasi
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sudut Lengkung Cekung Kiri (Inverted Corner Cutout) pembatas konten saat scroll */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px top-full -mt-px z-50 h-[25px] w-[25px] text-page-bg select-none"
      >
        <svg
          viewBox="0 0 25 25"
          fill="none"
          shapeRendering="geometricPrecision"
          className="h-full w-full"
        >
          <path
            d="M25 1C11.7452 1 1 11.7452 1 25H0V0H25V1Z"
            fill="currentColor"
          />
        </svg>
      </span>

      {/* Sudut Lengkung Cekung Kanan (Inverted Corner Cutout) pembatas konten saat scroll */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px top-full -mt-px z-50 h-[25px] w-[25px] text-page-bg select-none"
      >
        <svg
          viewBox="0 0 25 25"
          fill="none"
          shapeRendering="geometricPrecision"
          className="h-full w-full"
        >
          <path
            d="M0 1C13.2548 1 24 11.7452 24 25H25V0H0V1Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </header>
  );
}
