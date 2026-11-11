import * as React from "react";
import type { Route } from "./+types/home";
import { AdminOverview } from "~/components/admin/admin-overview";
import { AdminShell } from "~/components/admin/admin-shell";
import { PublicNavbar } from "~/components/public/public-navbar";
import { HeroSection } from "~/components/public/hero-section";
import { ServiceMarquee } from "~/components/public/service-marquee";
import { AboutSkillsSection } from "~/components/public/about-skills-section";
import { FeaturedProjectsSection } from "~/components/public/featured-projects-section";
import { PricingSection } from "~/components/public/pricing-section";
import { BriefModal } from "~/components/public/brief-modal";
import { TestimonialsSection } from "~/components/public/testimonials-section";
import { FaqSection } from "~/components/public/faq-section";
import { CtaBandSection } from "~/components/public/cta-band-section";
import { PublicFooter } from "~/components/public/public-footer";
import { getPortfolioBundle } from "~/db/repository.server";
import { requireAdminAccess } from "~/lib/access-jwt.server";
import { cloudflareContext } from "~/lib/cloudflare-context";
import {
  resolveSurfaceFromRequest,
  resolveThemeFromRequest,
} from "~/lib/host-routing";
import { formatPackagePrice } from "~/lib/whatsapp";
import type { ServicePackage } from "~/types/content";

export function meta({ loaderData }: Route.MetaArgs) {
  if (loaderData?.surface === "admin") {
    return [
      { title: "Dashboard Admin — tegardev" },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  const headline =
    loaderData?.bundle.settings.heroHeadline ??
    "Full-Stack Developer — Jasa Pembuatan Website & Sistem Web";
  return [
    { title: "tegardev — Full-Stack Developer & Paket Pembuatan Website" },
    {
      name: "description",
      content: `${headline} Tersedia paket Website Profil Sekolah, Sistem PPDB Online, Company Profile, Toko Online, hingga Aplikasi Web Custom.`,
    },
    {
      property: "og:title",
      content: "tegardev — Full-Stack Developer & Paket Pembuatan Website",
    },
    {
      property: "og:description",
      content:
        "Portofolio Full-Stack Developer beserta daftar paket pembuatan Website Sekolah, Sistem PPDB Online, Company Profile, dan Aplikasi Web Custom.",
    },
    { property: "og:type", content: "website" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  const surface = resolveSurfaceFromRequest(request, env.ADMIN_SUBDOMAIN);

  if (surface === "admin") {
    await requireAdminAccess(request, context);
  }

  const url = new URL(request.url);
  const publicUrl =
    surface === "admin"
      ? `${url.protocol}//${url.host.replace(/^admin\./i, "")}`
      : `${url.protocol}//${url.host}/`;

  const theme = resolveThemeFromRequest(request);
  const bundle = await getPortfolioBundle(env.DB);
  return { bundle, surface, publicUrl, theme };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { bundle, surface, publicUrl, theme } = loaderData;
  const [briefOpen, setBriefOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] =
    React.useState<ServicePackage | null>(null);

  if (surface === "admin") {
    return (
      <AdminShell basePath="" publicUrl={publicUrl}>
        <AdminOverview bundle={bundle} basePath="" />
      </AdminShell>
    );
  }

  const handleOpenBriefWithPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setBriefOpen(true);
  };

  const handleOpenGeneralBrief = () => {
    setSelectedPackage(null);
    setBriefOpen(true);
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Tegar",
        alternateName: "tegardev",
        jobTitle: "Full-Stack Developer",
        email: bundle.settings.contactEmail,
        sameAs: [bundle.settings.githubUrl, bundle.settings.linkedinUrl].filter(
          Boolean,
        ),
      },
      {
        "@type": "OfferCatalog",
        name: "Daftar Paket Pembuatan Website tegardev",
        itemListElement: bundle.packages
          .filter((p) => p.isPublished)
          .map((pkg) => ({
            "@type": "Offer",
            name: pkg.name,
            description: `${pkg.tagline} (${formatPackagePrice(pkg)})`,
          })),
      },
    ],
  };

  return (
    <div
      data-theme={theme}
      className={
        theme === "light"
          ? "min-h-dvh bg-page-bg px-2 pb-2 text-cream selection:bg-rust selection:text-white"
          : "min-h-dvh bg-black px-2 pb-2 text-cream selection:bg-rust selection:text-white"
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="flex w-full flex-col public-header-scope">
        <PublicNavbar
          theme={theme}
          onStartProject={handleOpenGeneralBrief}
        />

        <main className="flex w-full flex-col gap-2">
          <div className="flex h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-5.5rem)] min-h-[480px] flex-col justify-between gap-2">
            <HeroSection
              theme={theme}
              settings={bundle.settings}
              onStartProject={handleOpenGeneralBrief}
            />
            <ServiceMarquee
              theme={theme}
              services={bundle.services
                .filter((s) => s.isPublished)
                .map((s) => s.title)}
            />
          </div>

          <AboutSkillsSection
            theme={theme}
            settings={bundle.settings}
            onStartProject={handleOpenGeneralBrief}
          />

          <FeaturedProjectsSection theme={theme} projects={bundle.projects} />

          <PricingSection
            theme={theme}
            pricingText={bundle.settings.pricingText}
            categories={bundle.categories}
            packages={bundle.packages}
            onSelectPackage={handleOpenBriefWithPackage}
          />

          <TestimonialsSection
            theme={theme}
            testimonials={bundle.testimonials}
          />

          <FaqSection theme={theme} faqs={bundle.faqs} />

          <CtaBandSection
            theme={theme}
            settings={bundle.settings}
            onStartProject={handleOpenGeneralBrief}
          />
        </main>

        <div className="mt-2 w-full">
          <PublicFooter theme={theme} settings={bundle.settings} />
        </div>
      </div>

      <BriefModal
        open={briefOpen}
        onOpenChange={setBriefOpen}
        packages={bundle.packages}
        initialPackage={selectedPackage}
        whatsappNumber={bundle.settings.whatsappNumber}
      />
    </div>
  );
}
