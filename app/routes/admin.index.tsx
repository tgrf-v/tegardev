import { useOutletContext } from "react-router";
import type { Route } from "./+types/admin.index";
import { AdminOverview } from "~/components/admin/admin-overview";
import { getPortfolioBundle } from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = await requireAdminAccess(request, context);
  const bundle = await getPortfolioBundle(env.DB);
  return { bundle };
}

export default function AdminOverviewRoute({
  loaderData,
}: Route.ComponentProps) {
  const { basePath } = useOutletContext<{ basePath: string }>();
  return <AdminOverview bundle={loaderData.bundle} basePath={basePath} />;
}
