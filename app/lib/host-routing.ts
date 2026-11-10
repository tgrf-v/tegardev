export type SurfaceRole = "public" | "admin";
export type ThemeMode = "light" | "dark";

function isLoopbackOrLocalHostname(rawHost: string): boolean {
  const hostname = rawHost.trim().toLowerCase().replace(/:\d+$/, "");
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

/**
 * Menentukan apakah request masuk ke permukaan publik utama atau subdomain Dashboard Admin.
 * Mendukung admin.<domain> di produksi maupun admin.localhost di pengembangan lokal.
 */
export function resolveSurfaceFromRequest(
  request: Request,
  adminSubdomain?: string,
): SurfaceRole {
  const url = new URL(request.url);
  const hostHeader = request.headers.get("host") || url.host;
  const hostname = hostHeader.split(":")[0].toLowerCase();

  if (adminSubdomain && hostname === adminSubdomain.toLowerCase()) {
    return "admin";
  }

  if (hostname.startsWith("admin.")) {
    return "admin";
  }

  return "public";
}

/**
 * Menentukan tema antarmuka publik ("light" atau "dark").
 * - Parameter query (?theme=dark atau ?theme=light) dapat digunakan untuk pengujian atau perbandingan.
 * - Secara bawaan (default), domain utama dan seluruh subdomain menggunakan tema terang (light) sesuai keputusan desain final.
 */
export function resolveThemeFromRequest(
  request: Request,
  _previewSubdomain = "preview.tegardev.biz.id",
): ThemeMode {
  const url = new URL(request.url);
  const themeParam = url.searchParams.get("theme");
  if (themeParam === "light" || themeParam === "dark") {
    return themeParam;
  }

  return "light";
}

export function isLocalDevelopmentHost(request: Request): boolean {
  const url = new URL(request.url);
  const hostHeader = request.headers.get("host") || url.host;
  return (
    isLoopbackOrLocalHostname(url.hostname) &&
    isLoopbackOrLocalHostname(hostHeader)
  );
}
