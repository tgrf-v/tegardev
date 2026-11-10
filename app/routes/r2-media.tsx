import type { Route } from "./+types/r2-media";
import { cloudflareContext } from "~/lib/cloudflare-context";
import { serveR2ObjectResponse } from "~/lib/r2.server";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  const objectKey = params["*"] ?? "";
  return serveR2ObjectResponse(request, env.MEDIA_BUCKET, objectKey);
}
