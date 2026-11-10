import { asc, count, desc, eq, ne } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { createDatabase } from "~/db";
import {
  faqs,
  mediaAssets,
  packageAddons,
  packageCategories,
  packageFeatures,
  packages,
  projects,
  siteSettings,
  skills,
  testimonials,
} from "~/db/schema";
import { ensureDatabaseSeeded, INITIAL_ABOUT_PARAGRAPHS, INITIAL_PRICING_TEXT } from "~/db/seed";
import { deleteObjectFromR2IfManaged } from "~/lib/r2.server";
import type {
  FaqItem,
  MediaAsset,
  PackageAddon,
  PackageCategory,
  PackageFeature,
  PortfolioContentBundle,
  ProjectItem,
  ServicePackage,
  SiteSettings,
  SkillGroup,
  TestimonialItem,
} from "~/types/content";

function parseJsonStringArray(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);
    }
  } catch {
    // Abaikan jika JSON rusak, kembalikan array kosong
  }
  return [];
}

function mapSettingsRow(
  row: typeof siteSettings.$inferSelect | undefined,
): SiteSettings {
  if (!row) {
    return {
      id: 1,
      heroHeadline:
        "Membangun website & sistem web yang rapi, cepat, dan siap dipakai kerja nyata.",
      aboutTitle: "Tentang Saya",
      aboutBody: INITIAL_ABOUT_PARAGRAPHS,
      whatsappNumber: "6285196802314",
      contactEmail: "halo@tegardev.com",
      githubUrl: "https://github.com/tgrf-v/",
      linkedinUrl: "https://www.linkedin.com/in/tegar-rifa-i-a68757412/",
      ctaHeadline:
        "Siap membangun website atau sistem untuk instansi dan bisnis Anda?",
      ctaSubtext:
        "Ceritakan kebutuhan fitur, target jadwal rilis, atau paket yang diminati untuk mendapatkan rincian ruang lingkup yang jelas.",
      pricingText: INITIAL_PRICING_TEXT,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    heroHeadline: row.heroHeadline,
    aboutTitle: row.aboutTitle,
    aboutBody: row.aboutBody,
    whatsappNumber: row.whatsappNumber,
    contactEmail: row.contactEmail,
    githubUrl: row.githubUrl,
    linkedinUrl: row.linkedinUrl,
    ctaHeadline: row.ctaHeadline,
    ctaSubtext: row.ctaSubtext,
    pricingText: row.pricingText || INITIAL_PRICING_TEXT,
    updatedAt: row.updatedAt,
  };
}

function assemblePackages(
  packageRows: (typeof packages.$inferSelect)[],
  featureRows: (typeof packageFeatures.$inferSelect)[],
  addonRows: (typeof packageAddons.$inferSelect)[],
): ServicePackage[] {
  const featuresByPkg = new Map<number, PackageFeature[]>();
  for (const feat of featureRows) {
    const list = featuresByPkg.get(feat.packageId) ?? [];
    list.push({
      id: feat.id,
      packageId: feat.packageId,
      featureText: feat.featureText,
      tooltip: feat.tooltip ?? null,
      sortOrder: feat.sortOrder,
    });
    featuresByPkg.set(feat.packageId, list);
  }

  const addonsByPkg = new Map<number, PackageAddon[]>();
  for (const addon of addonRows) {
    const list = addonsByPkg.get(addon.packageId) ?? [];
    list.push({
      id: addon.id,
      packageId: addon.packageId,
      name: addon.name,
      addonPrice: addon.addonPrice ?? null,
      priceDisplay: addon.priceDisplay,
      sortOrder: addon.sortOrder,
    });
    addonsByPkg.set(addon.packageId, list);
  }

  return packageRows.map((pkg) => ({
    id: pkg.id,
    categoryId: pkg.categoryId,
    name: pkg.name,
    slug: pkg.slug,
    tagline: pkg.tagline,
    startingPrice: pkg.startingPrice ?? null,
    priceLabelOverride: pkg.priceLabelOverride ?? null,
    estimatedDuration: pkg.estimatedDuration,
    renewalNote: pkg.renewalNote,
    isHighlighted: pkg.isHighlighted,
    isPublished: pkg.isPublished,
    sortOrder: pkg.sortOrder,
    features: featuresByPkg.get(pkg.id) ?? [],
    addons: addonsByPkg.get(pkg.id) ?? [],
    updatedAt: pkg.updatedAt,
  }));
}

export async function getPortfolioBundle(
  d1: D1Database,
): Promise<PortfolioContentBundle> {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const [
    settingsRows,
    skillRows,
    projectRows,
    categoryRows,
    packageRows,
    featureRows,
    addonRows,
    testimonialRows,
    faqRows,
    mediaRows,
  ] = await db.batch([
    db.select().from(siteSettings).where(eq(siteSettings.id, 1)),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
    db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id)),
    db
      .select()
      .from(packageCategories)
      .orderBy(asc(packageCategories.sortOrder), asc(packageCategories.id)),
    db
      .select()
      .from(packages)
      .orderBy(asc(packages.sortOrder), asc(packages.id)),
    db
      .select()
      .from(packageFeatures)
      .orderBy(asc(packageFeatures.sortOrder), asc(packageFeatures.id)),
    db
      .select()
      .from(packageAddons)
      .orderBy(asc(packageAddons.sortOrder), asc(packageAddons.id)),
    db
      .select()
      .from(testimonials)
      .orderBy(
        desc(testimonials.isFeatured),
        asc(testimonials.sortOrder),
        asc(testimonials.id),
      ),
    db.select().from(faqs).orderBy(asc(faqs.sortOrder), asc(faqs.id)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
  ]);

  return {
    settings: mapSettingsRow(settingsRows[0]),
    skills: skillRows.map(
      (row): SkillGroup => ({
        id: row.id,
        groupName: row.groupName,
        items: parseJsonStringArray(row.itemsJson),
        sortOrder: row.sortOrder,
      }),
    ),
    projects: projectRows.map(
      (row): ProjectItem => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        imageUrl: row.imageUrl,
        imageAlt: row.imageAlt,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        updatedAt: row.updatedAt,
      }),
    ),
    categories: categoryRows.map(
      (row): PackageCategory => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        sortOrder: row.sortOrder,
      }),
    ),
    packages: assemblePackages(packageRows, featureRows, addonRows),
    testimonials: testimonialRows.map(
      (row): TestimonialItem => ({
        id: row.id,
        clientName: row.clientName,
        clientRoleOrg: row.clientRoleOrg,
        quote: row.quote,
        isFeatured: row.isFeatured,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
      }),
    ),
    faqs: faqRows.map(
      (row): FaqItem => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
      }),
    ),
    media: mediaRows.map(
      (row): MediaAsset => ({
        key: row.key,
        filename: row.filename,
        url: row.url,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        width: row.width ?? null,
        height: row.height ?? null,
        createdAt: row.createdAt,
      }),
    ),
  };
}

export async function getAdminProfileData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const [settingsRows, skillRows] = await db.batch([
    db.select().from(siteSettings).where(eq(siteSettings.id, 1)),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
  ]);

  return {
    settings: mapSettingsRow(settingsRows[0]),
    skills: skillRows.map(
      (row): SkillGroup => ({
        id: row.id,
        groupName: row.groupName,
        items: parseJsonStringArray(row.itemsJson),
        sortOrder: row.sortOrder,
      }),
    ),
  };
}

export async function saveSiteSettings(
  d1: D1Database,
  input: Omit<SiteSettings, "id" | "updatedAt" | "pricingText"> & {
    pricingText?: string;
  },
): Promise<void> {
  const db = createDatabase(d1);
  const now = new Date().toISOString();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      heroHeadline: input.heroHeadline,
      aboutTitle: input.aboutTitle,
      aboutBody: input.aboutBody,
      whatsappNumber: input.whatsappNumber,
      contactEmail: input.contactEmail,
      githubUrl: input.githubUrl,
      linkedinUrl: input.linkedinUrl,
      ctaHeadline: input.ctaHeadline,
      ctaSubtext: input.ctaSubtext,
      pricingText: input.pricingText ?? INITIAL_PRICING_TEXT,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        heroHeadline: input.heroHeadline,
        aboutTitle: input.aboutTitle,
        aboutBody: input.aboutBody,
        whatsappNumber: input.whatsappNumber,
        contactEmail: input.contactEmail,
        githubUrl: input.githubUrl,
        linkedinUrl: input.linkedinUrl,
        ctaHeadline: input.ctaHeadline,
        ctaSubtext: input.ctaSubtext,
        ...(input.pricingText !== undefined
          ? { pricingText: input.pricingText }
          : {}),
        updatedAt: now,
      },
    });
}

export async function savePricingTextRecord(
  d1: D1Database,
  pricingText: string,
): Promise<void> {
  const db = createDatabase(d1);
  const now = new Date().toISOString();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      heroHeadline:
        "Membangun website & sistem web yang rapi, cepat, dan siap dipakai kerja nyata.",
      aboutTitle: "Tentang Saya",
      aboutBody: INITIAL_ABOUT_PARAGRAPHS,
      whatsappNumber: "6285196802314",
      contactEmail: "halo@tegardev.com",
      githubUrl: "https://github.com/tgrf-v/",
      linkedinUrl: "https://www.linkedin.com/in/tegar-rifa-i-a68757412/",
      ctaHeadline:
        "Siap membangun website atau sistem untuk instansi dan bisnis Anda?",
      ctaSubtext:
        "Ceritakan kebutuhan fitur, target jadwal rilis, atau paket yang diminati untuk mendapatkan rincian ruang lingkup yang jelas.",
      pricingText,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        pricingText,
        updatedAt: now,
      },
    });
}

export async function upsertSkillGroupRecord(
  d1: D1Database,
  input: {
    id?: number;
    groupName: string;
    items: string[];
    sortOrder: number;
  },
): Promise<void> {
  const db = createDatabase(d1);
  const itemsJson = JSON.stringify(input.items);

  if (input.id) {
    await db
      .update(skills)
      .set({
        groupName: input.groupName,
        itemsJson,
        sortOrder: input.sortOrder,
      })
      .where(eq(skills.id, input.id));
    return;
  }

  await db.insert(skills).values({
    groupName: input.groupName,
    itemsJson,
    sortOrder: input.sortOrder,
  });
}

export async function deleteSkillGroupRecord(
  d1: D1Database,
  id: number,
): Promise<void> {
  const db = createDatabase(d1);
  await db.delete(skills).where(eq(skills.id, id));
}

export async function getAdminProjectsData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const [projectRows, mediaRows] = await db.batch([
    db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
  ]);

  return {
    projects: projectRows.map(
      (row): ProjectItem => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        imageUrl: row.imageUrl,
        imageAlt: row.imageAlt,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        updatedAt: row.updatedAt,
      }),
    ),
    media: mediaRows.map(
      (row): MediaAsset => ({
        key: row.key,
        filename: row.filename,
        url: row.url,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        width: row.width ?? null,
        height: row.height ?? null,
        createdAt: row.createdAt,
      }),
    ),
  };
}

export async function upsertProjectRecord(
  d1: D1Database,
  input: {
    id?: number;
    title: string;
    slug: string;
    summary: string;
    imageUrl: string;
    imageAlt: string;
    isPublished: boolean;
    sortOrder: number;
  },
): Promise<void> {
  const db = createDatabase(d1);
  const now = new Date().toISOString();

  const conflicting = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, input.slug));

  const finalSlug =
    conflicting.length > 0 && conflicting[0].id !== input.id
      ? `${input.slug}-${Date.now().toString(36)}`
      : input.slug;

  if (input.id) {
    await db
      .update(projects)
      .set({
        title: input.title,
        slug: finalSlug,
        summary: input.summary,
        imageUrl: input.imageUrl,
        imageAlt: input.imageAlt,
        isPublished: input.isPublished,
        sortOrder: input.sortOrder,
        updatedAt: now,
      })
      .where(eq(projects.id, input.id));
    return;
  }

  await db.insert(projects).values({
    title: input.title,
    slug: finalSlug,
    summary: input.summary,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  });
}

export async function deleteProjectRecord(
  d1: D1Database,
  id: number,
): Promise<void> {
  const db = createDatabase(d1);
  await db.delete(projects).where(eq(projects.id, id));
}

export async function getAdminPackagesData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const [categoryRows, packageRows, featureRows, addonRows, settingsRows] =
    await db.batch([
      db
        .select()
        .from(packageCategories)
        .orderBy(asc(packageCategories.sortOrder), asc(packageCategories.id)),
      db
        .select()
        .from(packages)
        .orderBy(asc(packages.sortOrder), asc(packages.id)),
      db
        .select()
        .from(packageFeatures)
        .orderBy(asc(packageFeatures.sortOrder), asc(packageFeatures.id)),
      db
        .select()
        .from(packageAddons)
        .orderBy(asc(packageAddons.sortOrder), asc(packageAddons.id)),
      db.select().from(siteSettings).where(eq(siteSettings.id, 1)),
    ]);

  const settings = mapSettingsRow(settingsRows[0]);

  return {
    categories: categoryRows.map(
      (row): PackageCategory => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        sortOrder: row.sortOrder,
      }),
    ),
    packages: assemblePackages(packageRows, featureRows, addonRows),
    pricingText: settings.pricingText,
  };
}

export async function upsertPackageCategoryRecord(
  d1: D1Database,
  input: {
    id?: number;
    name: string;
    slug: string;
    sortOrder: number;
  },
): Promise<void> {
  const db = createDatabase(d1);

  const conflicting = await db
    .select({ id: packageCategories.id })
    .from(packageCategories)
    .where(eq(packageCategories.slug, input.slug));

  const finalSlug =
    conflicting.length > 0 && conflicting[0].id !== input.id
      ? `${input.slug}-${Date.now().toString(36)}`
      : input.slug;

  if (input.id) {
    await db
      .update(packageCategories)
      .set({
        name: input.name,
        slug: finalSlug,
        sortOrder: input.sortOrder,
      })
      .where(eq(packageCategories.id, input.id));
    return;
  }

  await db.insert(packageCategories).values({
    name: input.name,
    slug: finalSlug,
    sortOrder: input.sortOrder,
  });
}

export async function deletePackageCategoryRecord(
  d1: D1Database,
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = createDatabase(d1);
  const linked = await db
    .select({ total: count() })
    .from(packages)
    .where(eq(packages.categoryId, id));

  if ((linked[0]?.total ?? 0) > 0) {
    return {
      ok: false,
      error:
        "Kategori tidak dapat dihapus karena masih memiliki paket layanan. Pindahkan atau hapus paket terlebih dahulu.",
    };
  }

  await db.delete(packageCategories).where(eq(packageCategories.id, id));
  return { ok: true };
}

export async function upsertServicePackageRecord(
  d1: D1Database,
  input: {
    id?: number;
    categoryId: number;
    name: string;
    slug: string;
    tagline: string;
    startingPrice: number | null;
    priceLabelOverride: string | null;
    estimatedDuration: string;
    renewalNote: string;
    isHighlighted: boolean;
    isPublished: boolean;
    sortOrder: number;
    features: { featureText: string; tooltip: string | null }[];
    addons: { name: string; addonPrice: number | null; priceDisplay: string }[];
  },
): Promise<void> {
  const db = createDatabase(d1);
  const now = new Date().toISOString();

  const conflicting = await db
    .select({ id: packages.id })
    .from(packages)
    .where(eq(packages.slug, input.slug));

  const finalSlug =
    conflicting.length > 0 && conflicting[0].id !== input.id
      ? `${input.slug}-${Date.now().toString(36)}`
      : input.slug;

  let packageId = input.id;

  if (packageId) {
    const statements: [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]] = [
      db
        .update(packages)
        .set({
          categoryId: input.categoryId,
          name: input.name,
          slug: finalSlug,
          tagline: input.tagline,
          startingPrice: input.startingPrice,
          priceLabelOverride: input.priceLabelOverride,
          estimatedDuration: input.estimatedDuration,
          renewalNote: input.renewalNote,
          isHighlighted: input.isHighlighted,
          isPublished: input.isPublished,
          sortOrder: input.sortOrder,
          updatedAt: now,
        })
        .where(eq(packages.id, packageId)),
      db.delete(packageFeatures).where(eq(packageFeatures.packageId, packageId)),
      db.delete(packageAddons).where(eq(packageAddons.packageId, packageId)),
    ];

    if (input.features.length > 0) {
      statements.push(
        db.insert(packageFeatures).values(
          input.features.map((feat, idx) => ({
            packageId: packageId!,
            featureText: feat.featureText,
            tooltip: feat.tooltip,
            sortOrder: idx + 1,
          })),
        ),
      );
    }

    if (input.addons.length > 0) {
      statements.push(
        db.insert(packageAddons).values(
          input.addons.map((addon, idx) => ({
            packageId: packageId!,
            name: addon.name,
            addonPrice: addon.addonPrice,
            priceDisplay: addon.priceDisplay,
            sortOrder: idx + 1,
          })),
        ),
      );
    }

    await db.batch(statements);
    return;
  }

  const inserted = await db
    .insert(packages)
    .values({
      categoryId: input.categoryId,
      name: input.name,
      slug: finalSlug,
      tagline: input.tagline,
      startingPrice: input.startingPrice,
      priceLabelOverride: input.priceLabelOverride,
      estimatedDuration: input.estimatedDuration,
      renewalNote: input.renewalNote,
      isHighlighted: input.isHighlighted,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      updatedAt: now,
    })
    .returning({ id: packages.id });

  const newPackageId = inserted[0]?.id;
  if (!newPackageId) return;

  const childInserts: BatchItem<"sqlite">[] = [];

  if (input.features.length > 0) {
    childInserts.push(
      db.insert(packageFeatures).values(
        input.features.map((feat, idx) => ({
          packageId: newPackageId,
          featureText: feat.featureText,
          tooltip: feat.tooltip,
          sortOrder: idx + 1,
        })),
      ),
    );
  }

  if (input.addons.length > 0) {
    childInserts.push(
      db.insert(packageAddons).values(
        input.addons.map((addon, idx) => ({
          packageId: newPackageId,
          name: addon.name,
          addonPrice: addon.addonPrice,
          priceDisplay: addon.priceDisplay,
          sortOrder: idx + 1,
        })),
      ),
    );
  }

  if (childInserts.length > 0) {
    await db.batch([childInserts[0], ...childInserts.slice(1)]);
  }
}

export async function deleteServicePackageRecord(
  d1: D1Database,
  id: number,
): Promise<void> {
  const db = createDatabase(d1);
  await db.batch([
    db.delete(packageFeatures).where(eq(packageFeatures.packageId, id)),
    db.delete(packageAddons).where(eq(packageAddons.packageId, id)),
    db.delete(packages).where(eq(packages.id, id)),
  ]);
}

export async function getAdminTestimonialsData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(
      desc(testimonials.isFeatured),
      asc(testimonials.sortOrder),
      asc(testimonials.id),
    );

  return {
    testimonials: rows.map(
      (row): TestimonialItem => ({
        id: row.id,
        clientName: row.clientName,
        clientRoleOrg: row.clientRoleOrg,
        quote: row.quote,
        isFeatured: row.isFeatured,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
      }),
    ),
  };
}

export async function upsertTestimonialRecord(
  d1: D1Database,
  input: {
    id?: number;
    clientName: string;
    clientRoleOrg: string;
    quote: string;
    isFeatured: boolean;
    isPublished: boolean;
    sortOrder: number;
  },
): Promise<void> {
  const db = createDatabase(d1);

  if (input.id) {
    if (input.isFeatured) {
      await db.batch([
        db
          .update(testimonials)
          .set({ isFeatured: false })
          .where(ne(testimonials.id, input.id)),
        db
          .update(testimonials)
          .set({
            clientName: input.clientName,
            clientRoleOrg: input.clientRoleOrg,
            quote: input.quote,
            isFeatured: true,
            isPublished: input.isPublished,
            sortOrder: input.sortOrder,
          })
          .where(eq(testimonials.id, input.id)),
      ]);
      return;
    }

    await db
      .update(testimonials)
      .set({
        clientName: input.clientName,
        clientRoleOrg: input.clientRoleOrg,
        quote: input.quote,
        isFeatured: false,
        isPublished: input.isPublished,
        sortOrder: input.sortOrder,
      })
      .where(eq(testimonials.id, input.id));
    return;
  }

  if (input.isFeatured) {
    await db.batch([
      db.update(testimonials).set({ isFeatured: false }),
      db.insert(testimonials).values({
        clientName: input.clientName,
        clientRoleOrg: input.clientRoleOrg,
        quote: input.quote,
        isFeatured: true,
        isPublished: input.isPublished,
        sortOrder: input.sortOrder,
      }),
    ]);
    return;
  }

  await db.insert(testimonials).values({
    clientName: input.clientName,
    clientRoleOrg: input.clientRoleOrg,
    quote: input.quote,
    isFeatured: false,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
  });
}

export async function deleteTestimonialRecord(
  d1: D1Database,
  id: number,
): Promise<void> {
  const db = createDatabase(d1);
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function getAdminFaqsData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const rows = await db
    .select()
    .from(faqs)
    .orderBy(asc(faqs.sortOrder), asc(faqs.id));

  return {
    faqs: rows.map(
      (row): FaqItem => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
      }),
    ),
  };
}

export async function upsertFaqRecord(
  d1: D1Database,
  input: {
    id?: number;
    question: string;
    answer: string;
    isPublished: boolean;
    sortOrder: number;
  },
): Promise<void> {
  const db = createDatabase(d1);

  if (input.id) {
    await db
      .update(faqs)
      .set({
        question: input.question,
        answer: input.answer,
        isPublished: input.isPublished,
        sortOrder: input.sortOrder,
      })
      .where(eq(faqs.id, input.id));
    return;
  }

  await db.insert(faqs).values({
    question: input.question,
    answer: input.answer,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
  });
}

export async function deleteFaqRecord(
  d1: D1Database,
  id: number,
): Promise<void> {
  const db = createDatabase(d1);
  await db.delete(faqs).where(eq(faqs.id, id));
}

export async function getAdminMediaData(d1: D1Database) {
  const db = createDatabase(d1);
  await ensureDatabaseSeeded(db);

  const [mediaRows, projectImageRows] = await db.batch([
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    db.select({ imageUrl: projects.imageUrl }).from(projects),
  ]);

  const usedUrls = Array.from(
    new Set(projectImageRows.map((row) => row.imageUrl)),
  );

  return {
    media: mediaRows.map(
      (row): MediaAsset => ({
        key: row.key,
        filename: row.filename,
        url: row.url,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        width: row.width ?? null,
        height: row.height ?? null,
        createdAt: row.createdAt,
      }),
    ),
    usedUrls,
  };
}

export async function insertMediaAssetRecord(
  d1: D1Database,
  asset: MediaAsset,
): Promise<void> {
  const db = createDatabase(d1);
  await db
    .insert(mediaAssets)
    .values({
      key: asset.key,
      filename: asset.filename,
      url: asset.url,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      width: asset.width,
      height: asset.height,
      createdAt: asset.createdAt,
    })
    .onConflictDoUpdate({
      target: mediaAssets.key,
      set: {
        filename: asset.filename,
        url: asset.url,
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
        width: asset.width,
        height: asset.height,
        createdAt: asset.createdAt,
      },
    });
}

export async function deleteMediaAssetWithGuard(
  d1: D1Database,
  bucket: R2Bucket,
  key: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = createDatabase(d1);
  const existing = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.key, key));

  const asset = existing[0];
  if (!asset) {
    return { ok: false, error: "Berkas media tidak ditemukan." };
  }

  const inUse = await db
    .select({ total: count() })
    .from(projects)
    .where(eq(projects.imageUrl, asset.url));

  if ((inUse[0]?.total ?? 0) > 0) {
    return {
      ok: false,
      error:
        "Berkas tidak dapat dihapus karena masih dipakai pada Proyek Unggulan.",
    };
  }

  await deleteObjectFromR2IfManaged(bucket, asset);
  await db.delete(mediaAssets).where(eq(mediaAssets.key, key));
  return { ok: true };
}
