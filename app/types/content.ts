export interface SiteSettings {
  id: number;
  heroHeadline: string;
  aboutTitle: string;
  aboutBody: string;
  whatsappNumber: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  ctaHeadline: string;
  ctaSubtext: string;
  updatedAt: string;
}

export interface SkillGroup {
  id: number;
  groupName: string;
  items: string[];
  sortOrder: number;
}

export interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface PackageCategory {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface PackageFeature {
  id: number;
  packageId: number;
  featureText: string;
  tooltip: string | null;
  sortOrder: number;
}

export interface PackageAddon {
  id: number;
  packageId: number;
  name: string;
  addonPrice: number | null;
  priceDisplay: string;
  sortOrder: number;
}

export interface ServicePackage {
  id: number;
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
  features: PackageFeature[];
  addons: PackageAddon[];
  updatedAt: string;
}

export interface TestimonialItem {
  id: number;
  clientName: string;
  clientRoleOrg: string;
  quote: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface MediaAsset {
  key: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface PortfolioContentBundle {
  settings: SiteSettings;
  skills: SkillGroup[];
  projects: ProjectItem[];
  categories: PackageCategory[];
  packages: ServicePackage[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  media: MediaAsset[];
}
