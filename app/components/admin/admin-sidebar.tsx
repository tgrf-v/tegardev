import { NavLink } from "react-router";
import {
  ExternalLink,
  FolderKanban,
  HelpCircle,
  Images,
  LayoutDashboard,
  MessageSquareQuote,
  Tags,
  UserCog,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface AdminSidebarProps {
  basePath: string;
  publicUrl: string;
  onNavigate?: () => void;
}

export function AdminSidebar({
  basePath,
  publicUrl,
  onNavigate,
}: AdminSidebarProps) {
  const navItems = [
    { label: "Ringkasan", to: basePath || "/", end: true, icon: LayoutDashboard },
    { label: "Profil & Keahlian", to: `${basePath}/profil`, end: false, icon: UserCog },
    { label: "Proyek Unggulan", to: `${basePath}/proyek`, end: false, icon: FolderKanban },
    { label: "Paket & Harga", to: `${basePath}/paket`, end: false, icon: Tags },
    { label: "Testimoni", to: `${basePath}/testimoni`, end: false, icon: MessageSquareQuote },
    { label: "Tanya Jawab", to: `${basePath}/tanya-jawab`, end: false, icon: HelpCircle },
    { label: "Media R2", to: `${basePath}/media`, end: false, icon: Images },
  ];

  return (
    <div className="flex h-full flex-col justify-between bg-bg2 text-cream">
      <div>
        <div className="border-b border-line px-5 py-5">
          <p className="font-display-anton text-[22px] tracking-tight">
            <span className="text-cream">TEGAR</span>
            <span className="text-rust">DEV</span>
          </p>
          <p className="mt-1 text-[12px] text-cream-dim">Dashboard Pengelola Konten</p>
        </div>

        <nav aria-label="Menu Dashboard Admin" className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[3px] px-3 py-2.5 text-[14px] font-medium transition-colors no-underline",
                    isActive
                      ? "bg-rust text-white"
                      : "text-cream-dim hover:bg-bg hover:text-cream",
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-line p-4">
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-[3px] border border-line bg-bg px-3.5 py-2.5 text-[13px] font-medium text-cream transition-colors hover:border-cream-dim no-underline"
        >
          <span>Buka Halaman Publik</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-cream-dim" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
