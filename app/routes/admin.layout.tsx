import { Outlet } from "react-router";
import type { Route } from "./+types/admin.layout";
import { AdminShell } from "~/components/admin/admin-shell";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { resolveSurfaceFromRequest } from "~/lib/host-routing";

export function meta() {
  return [
    { title: "Dashboard Admin — tegardev" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  const surface = resolveSurfaceFromRequest(request, env.ADMIN_SUBDOMAIN);
  const url = new URL(request.url);

  const basePath = surface === "admin" ? "" : "/admin";
  const publicUrl =
    surface === "admin"
      ? `${url.protocol}//${url.host.replace(/^admin\./i, "")}`
      : `${url.protocol}//${url.host}/`;

  return { basePath, publicUrl };
}

export default function AdminLayoutRoute({ loaderData }: Route.ComponentProps) {
  return (
    <AdminShell
      basePath={loaderData.basePath}
      publicUrl={loaderData.publicUrl}
    >
      <Outlet context={{ basePath: loaderData.basePath }} />
    </AdminShell>
  );
}
