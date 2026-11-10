import { RouterContextProvider, createRequestHandler } from "react-router";
import { verifyAdminRequest } from "~/lib/access-jwt.server";
import { cloudflareContext } from "~/lib/cloudflare-context";
import {
  isLocalDevelopmentHost,
  resolveSurfaceFromRequest,
} from "~/lib/host-routing";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const SUBDOMAIN_ONLY_ADMIN_PREFIXES = [
  "/profil",
  "/proyek",
  "/paket",
  "/testimoni",
  "/tanya-jawab",
  "/media",
];

function isSubdomainOnlyAdminPath(pathname: string): boolean {
  return SUBDOMAIN_ONLY_ADMIN_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname === `${prefix}.data` ||
      pathname.startsWith(`${prefix}/`),
  );
}

function isLocalAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname === "/admin.data" ||
    pathname.startsWith("/admin/")
  );
}

function buildPublicRobotsTxt(publicDomain: string): Response {
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: https://${publicDomain}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function buildPublicSitemapXml(publicDomain: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${publicDomain}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const routerContext = new RouterContextProvider();
    routerContext.set(cloudflareContext, { env, ctx });

    const url = new URL(request.url);
    const surface = resolveSurfaceFromRequest(request, env.ADMIN_SUBDOMAIN);

    if (surface === "public") {
      if (url.pathname === "/robots.txt") {
        return buildPublicRobotsTxt(env.PUBLIC_DOMAIN);
      }

      if (url.pathname === "/sitemap.xml") {
        return buildPublicSitemapXml(env.PUBLIC_DOMAIN);
      }

      // Rute root milik admin.<domain> (/profil, /paket, dst.) tidak terbuka di domain publik
      if (isSubdomainOnlyAdminPath(url.pathname)) {
        return new Response("Halaman tidak ditemukan", { status: 404 });
      }

      // Di lingkungan produksi, path /admin pada domain publik utama ditutup dengan 404
      if (!isLocalDevelopmentHost(request) && isLocalAdminPath(url.pathname)) {
        return new Response("Halaman tidak ditemukan", { status: 404 });
      }

      // Saat mengakses /admin di localhost, tetap jalankan pemeriksaan guard akses
      if (isLocalAdminPath(url.pathname)) {
        const authResult = await verifyAdminRequest(request, env);
        if (!authResult.ok) {
          return authResult.response;
        }
      }

      return requestHandler(request, routerContext);
    }

    // Permukaan admin.<domain>: robots.txt menolak seluruh crawler
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    // Pengiriman aset gambar publik /r2/* tetap diizinkan, selebihnya wajib lolos verifikasi JWT Cloudflare Access
    if (!url.pathname.startsWith("/r2/")) {
      const authResult = await verifyAdminRequest(request, env);
      if (!authResult.ok) {
        return authResult.response;
      }
    }

    const response = await requestHandler(request, routerContext);
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
