import * as React from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface AdminShellProps {
  basePath: string;
  publicUrl: string;
  children: React.ReactNode;
}

export function AdminShell({ basePath, publicUrl, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-bg text-cream lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden border-r border-line lg:block lg:sticky lg:top-0 lg:h-dvh">
        <AdminSidebar basePath={basePath} publicUrl={publicUrl} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-line bg-bg2 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Buka navigasi admin"
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetTitle className="sr-only">Navigasi Admin</SheetTitle>
                  <AdminSidebar
                    basePath={basePath}
                    publicUrl={publicUrl}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
            <p className="text-[13.5px] font-medium text-cream-dim">
              Terhubung Aman — Cloudflare Zero Trust &amp; D1 Database
            </p>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
