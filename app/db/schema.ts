import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  heroHeadline: text("hero_headline").notNull(),
  aboutTitle: text("about_title").notNull(),
  aboutBody: text("about_body").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  contactEmail: text("contact_email").notNull(),
  githubUrl: text("github_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  ctaHeadline: text("cta_headline").notNull(),
  ctaSubtext: text("cta_subtext").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupName: text("group_name").notNull(),
  itemsJson: text("items_json").notNull(),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(1),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const packageCategories = sqliteTable("package_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const packages = sqliteTable("packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => packageCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  startingPrice: integer("starting_price"),
  priceLabelOverride: text("price_label_override"),
  estimatedDuration: text("estimated_duration").notNull(),
  renewalNote: text("renewal_note").notNull().default(""),
  isHighlighted: integer("is_highlighted", { mode: "boolean" })
    .notNull()
    .default(false),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});

export const packageFeatures = sqliteTable("package_features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  packageId: integer("package_id")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  featureText: text("feature_text").notNull(),
  tooltip: text("tooltip"),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const packageAddons = sqliteTable("package_addons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  packageId: integer("package_id")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  addonPrice: integer("addon_price"),
  priceDisplay: text("price_display").notNull(),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientName: text("client_name").notNull(),
  clientRoleOrg: text("client_role_org").notNull(),
  quote: text("quote").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const mediaAssets = sqliteTable("media_assets", {
  key: text("key").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: text("created_at").notNull(),
});
