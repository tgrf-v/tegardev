import { createRemoteJWKSet, jwtVerify } from "jose";
import type { RouterContextProvider } from "react-router";
import { cloudflareContext } from "~/lib/cloudflare-context";
import { isLocalDevelopmentHost } from "~/lib/host-routing";

type AccessEnv = Env & {
  CLOUDFLARE_ACCESS_TEAM_DOMAIN?: string;
  CLOUDFLARE_ACCESS_AUD?: string;
};

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizeTeamIssuer(rawDomain: string): string {
  const trimmed = rawDomain.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getRemoteJwks(issuer: string) {
  let cached = jwksCache.get(issuer);
  if (!cached) {
    cached = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    jwksCache.set(issuer, cached);
  }
  return cached;
}

function createForbiddenResponse(message: string): Response {
  return new Response(message, {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function verifyAdminRequest(
  request: Request,
  env: Env,
): Promise<{ ok: true; email: string } | { ok: false; response: Response }> {
  const accessEnv = env as AccessEnv;
  const teamDomain = accessEnv.CLOUDFLARE_ACCESS_TEAM_DOMAIN?.trim() ?? "";
  const policyAud = accessEnv.CLOUDFLARE_ACCESS_AUD?.trim() ?? "";

  // Saat pengembangan lokal di localhost, izinkan akses langsung tanpa hambatan Cloudflare Access
  if (isLocalDevelopmentHost(request)) {
    return { ok: true, email: "local@tegardev.test" };
  }

  if (!teamDomain || !policyAud) {
    return {
      ok: false,
      response: createForbiddenResponse(
        "Akses ditolak. Konfigurasi Cloudflare Zero Trust Access belum diaktifkan pada server.",
      ),
    };
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    return {
      ok: false,
      response: createForbiddenResponse(
        "Akses ditolak. Token autentikasi Cloudflare Zero Trust Access tidak ditemukan.",
      ),
    };
  }

  try {
    const issuer = normalizeTeamIssuer(teamDomain);
    const jwks = getRemoteJwks(issuer);
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: policyAud,
    });

    const email =
      typeof payload.email === "string" && payload.email.length > 0
        ? payload.email
        : "admin@tegardev.com";

    return { ok: true, email };
  } catch {
    return {
      ok: false,
      response: createForbiddenResponse(
        "Akses ditolak. Token Cloudflare Zero Trust Access tidak valid atau telah kedaluwarsa.",
      ),
    };
  }
}

export async function requireAdminAccess(
  request: Request,
  context: Readonly<RouterContextProvider>,
): Promise<{ env: Env; email: string }> {
  const { env } = context.get(cloudflareContext);
  const verification = await verifyAdminRequest(request, env);
  if (!verification.ok) {
    throw verification.response;
  }
  return { env, email: verification.email };
}
