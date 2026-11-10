import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("r2/*", "routes/r2-media.tsx"),
  // Rute langsung tanpa awalan /admin khusus ketika diakses dari subdomain admin.<domain>
  layout("routes/admin.layout.tsx", { id: "subdomain-admin-layout" }, [
    route("profil", "routes/admin.profil.tsx", { id: "subdomain-admin-profil" }),
    route("proyek", "routes/admin.proyek.tsx", { id: "subdomain-admin-proyek" }),
    route("paket", "routes/admin.paket.tsx", { id: "subdomain-admin-paket" }),
    route("testimoni", "routes/admin.testimoni.tsx", { id: "subdomain-admin-testimoni" }),
    route("tanya-jawab", "routes/admin.tanya-jawab.tsx", { id: "subdomain-admin-tanya-jawab" }),
    route("media", "routes/admin.media.tsx", { id: "subdomain-admin-media" }),
  ]),
  // Rute /admin untuk kemudahan pengembangan lokal di localhost:5173/admin
  route("admin", "routes/admin.layout.tsx", [
    index("routes/admin.index.tsx"),
    route("profil", "routes/admin.profil.tsx"),
    route("proyek", "routes/admin.proyek.tsx"),
    route("paket", "routes/admin.paket.tsx"),
    route("testimoni", "routes/admin.testimoni.tsx"),
    route("tanya-jawab", "routes/admin.tanya-jawab.tsx"),
    route("media", "routes/admin.media.tsx"),
  ]),
] satisfies RouteConfig;
