import { cn } from "~/lib/utils";
import type { SiteSettings } from "~/types/content";

interface PublicFooterProps {
  settings: SiteSettings;
  theme?: "light" | "dark";
}

export function PublicFooter({ settings, theme = "light" }: PublicFooterProps) {
  const isLight = theme === "light";
  const cleanWa = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <footer
      className={cn(
        "deferred-section w-full rounded-[20px] p-8 sm:p-12 lg:rounded-[24px] outline-none",
        isLight
          ? "bg-white border border-card-border text-cream shadow-xs"
          : "bg-rust border-0 text-white",
      )}
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p
            className={cn(
              "flex items-center gap-2 font-display-anton text-[24px] uppercase tracking-normal",
              isLight ? "text-cream" : "text-white",
            )}
          >
            <svg
              viewBox="0 0 1200 1200"
              className={cn(
                "h-5 w-5 shrink-0 fill-current",
                isLight ? "text-rust" : "text-white",
              )}
              aria-hidden="true"
            >
              <polygon points="107,588 330,526 480,1079 257,1141" />
              <polygon points="306,91 1091,91 1091,877 587,877 587,525 799,525 799,350 306,350" />
            </svg>
            <span>
              <span>tegar</span>
              <span className={isLight ? "text-rust" : "text-white/80"}>dev</span>
            </span>
          </p>
          <p
            className={cn(
              "mt-2.5 max-w-[34ch] text-[13.5px] leading-relaxed",
              isLight ? "text-cream-dim" : "text-white/85",
            )}
          >
            Pengembangan website dan aplikasi web full-stack untuk sekolah, madrasah, instansi, dan bisnis.
          </p>
        </div>

        <div>
          <p
            className={cn(
              "text-[13px] font-bold uppercase tracking-wider",
              isLight ? "text-cream" : "text-white",
            )}
          >
            Navigasi Halaman
          </p>
          <ul
            className={cn(
              "mt-3 flex flex-col gap-2 text-[13.5px]",
              isLight ? "text-cream-dim" : "text-white/85",
            )}
          >
            <li>
              <a
                href="#tentang"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Tentang Saya
              </a>
            </li>
            <li>
              <a
                href="#proyek"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Proyek Unggulan
              </a>
            </li>
            <li>
              <a
                href="#daftar-harga"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Daftar Harga
              </a>
            </li>
            <li>
              <a
                href="#testimoni"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Testimoni Klien
              </a>
            </li>
            <li>
              <a
                href="#tanya-jawab"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Tanya Jawab
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p
            className={cn(
              "text-[13px] font-bold uppercase tracking-wider",
              isLight ? "text-cream" : "text-white",
            )}
          >
            Paket Solusi
          </p>
          <ul
            className={cn(
              "mt-3 flex flex-col gap-2 text-[13.5px]",
              isLight ? "text-cream-dim" : "text-white/85",
            )}
          >
            <li>
              <a
                href="#daftar-harga"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Sistem PPDB Online
              </a>
            </li>
            <li>
              <a
                href="#daftar-harga"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Website Profil Sekolah
              </a>
            </li>
            <li>
              <a
                href="#daftar-harga"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Website Company Profile
              </a>
            </li>
            <li>
              <a
                href="#daftar-harga"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                Aplikasi Web Custom
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p
            className={cn(
              "text-[13px] font-bold uppercase tracking-wider",
              isLight ? "text-cream" : "text-white",
            )}
          >
            Kontak Langsung
          </p>
          <ul
            className={cn(
              "mt-3 flex flex-col gap-2 text-[13.5px]",
              isLight ? "text-cream-dim" : "text-white/85",
            )}
          >
            <li>
              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
              >
                WhatsApp
              </a>
            </li>
            {settings.githubUrl ? (
              <li>
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
                >
                  GitHub
                </a>
              </li>
            ) : null}
            {settings.linkedinUrl ? (
              <li>
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isLight ? "hover:text-rust no-underline" : "hover:text-white no-underline"}
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "mt-8 pt-6 text-center text-[12.5px]",
          isLight
            ? "border-t border-line text-cream-dim"
            : "border-t border-white/20 text-white/80",
        )}
      >
        <p>&copy; {new Date().getFullYear()} tegardev. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
