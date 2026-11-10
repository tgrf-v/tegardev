import * as React from "react";

interface HttpErrorPageProps {
  status?: number;
  title?: string;
  message?: string;
}

export function HttpErrorPage({
  status = 404,
  title,
}: HttpErrorPageProps) {
  const is404 = status === 404;

  const displayTitle =
    title ||
    (is404
      ? "Halaman Tidak Ditemukan"
      : status === 403
        ? "Akses Dibatasi"
        : "Terjadi Kendala pada Sistem");

  const statusDigits = String(status).split("");

  return (
    <div className="h-dvh max-h-dvh overflow-hidden bg-page-bg px-2 pb-2 text-cream selection:bg-rust selection:text-white flex flex-col justify-between select-none font-sans">
      {/* Header Navigasi Publik */}
      <header className="sticky-nav-shell relative w-full bg-page-bg pt-2 pb-2 shrink-0">
        <div className="sticky-nav-card flex h-14 items-center justify-between px-5 sm:h-16 sm:px-8">
          <a
            href="/"
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

          <nav
            aria-label="Navigasi cepat"
            className="hidden items-center gap-6 sm:flex"
          >
            <a
              href="/#tentang"
              className="text-[13.5px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white no-underline"
            >
              Tentang
            </a>
            <a
              href="/#proyek"
              className="text-[13.5px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white no-underline"
            >
              Proyek
            </a>
            <a
              href="/#daftar-harga"
              className="text-[13.5px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white no-underline"
            >
              Daftar Harga
            </a>
          </nav>

          <a
            href="/"
            className="cursor-pointer rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-rust transition-colors hover:bg-white/90 outline-none border-0 shadow-xs no-underline"
          >
            Beranda
          </a>
        </div>
      </header>

      {/* Main Full Frame Card Sesuai Gaya Halaman Publik */}
      <main className="flex flex-1 min-h-0 flex-col">
        <section className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px] p-6 sm:p-8 lg:rounded-[24px] lg:p-10 outline-none bg-white border border-card-border shadow-xs text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Angka Status Tipografi Anton */}
            <div
              className="flex items-center justify-center gap-1 font-display-anton text-[clamp(7rem,18vw,14rem)] leading-none select-none tracking-tight"
              aria-hidden="true"
            >
              {statusDigits.map((digit, idx) => (
                <span
                  key={`digit-${digit}-${idx}`}
                  className={idx === 1 ? "text-rust" : "text-cream"}
                >
                  {digit}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-sans text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-cream">
              {displayTitle}
            </h1>

            {/* Tombol Aksi Baku: Kembali */}
            <div className="mt-8 flex justify-center">
              <a
                href="/"
                onClick={(e) => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    e.preventDefault();
                    window.history.back();
                  }
                }}
                className="inline-flex items-center justify-center rounded-full bg-rust px-8 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-rust-dark no-underline shadow-xs cursor-pointer"
              >
                Kembali
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
