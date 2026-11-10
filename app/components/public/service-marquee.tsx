import * as React from "react";

interface ServiceMarqueeProps {
  services?: string[];
  theme?: "light" | "dark";
}

export const DEFAULT_SERVICES = [
  "PPDB Online",
  "Company Profile",
  "Booking App",
  "Aplikasi POS",
  "Sistem Absensi",
  "Toko Online",
  "Portal Akademik",
  "Dashboard Admin",
  "Landing Page",
  "Sistem Inventaris",
  "Website Sekolah",
  "Sistem Reservasi",
  "Portal Berita",
  "Aplikasi Web Kustom",
];

export function ServiceMarquee({ services }: ServiceMarqueeProps) {
  const items = React.useMemo(() => {
    if (services && services.length > 0) {
      return services;
    }
    return DEFAULT_SERVICES;
  }, [services]);

  return (
    <aside
      aria-label="Layanan pembuatan website & sistem web"
      className="marquee-container w-full shrink-0 overflow-hidden rounded-[14px] bg-cream py-[7px] text-bg select-none lg:rounded-[18px] border-0 outline-none"
    >
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
        {/* Track pertama */}
        <div className="flex items-center gap-6">
          {items.map((service, idx) => (
            <React.Fragment key={`service-1-${service}-${idx}`}>
              <span className="text-[12px] font-bold uppercase tracking-wider leading-none text-bg sm:text-[12.5px]">
                {service}
              </span>
              <span className="text-bg/30 text-[10px] leading-none" aria-hidden="true">
                •
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Track kedua untuk looping mulus tanpa jeda */}
        <div className="flex items-center gap-6" aria-hidden="true">
          {items.map((service, idx) => (
            <React.Fragment key={`service-2-${service}-${idx}`}>
              <span className="text-[12px] font-bold uppercase tracking-wider leading-none text-bg sm:text-[12.5px]">
                {service}
              </span>
              <span className="text-bg/30 text-[10px] leading-none" aria-hidden="true">
                •
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
}
