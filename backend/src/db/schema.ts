import { mysqlTable, int, varchar, text, timestamp, boolean, index } from 'drizzle-orm/mysql-core';

// Categories Table
export const categories = mysqlTable(
  'categories',
  {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    visible: boolean('visible').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    visibleIdx: index('visible_idx').on(table.visible),
  })
);

// Articles Table
export const articles = mysqlTable(
  'articles',
  {
    id: int('id').primaryKey().autoincrement(),
    title: varchar('title', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    featuredImage: varchar('featured_image', { length: 500 }),
    categoryId: int('category_id').references(() => categories.id),
    authorId: int('author_id'),
    publishedAt: timestamp('published_at'),
    visible: boolean('visible').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    categoryIdx: index('category_idx').on(table.categoryId),
    publishedIdx: index('published_idx').on(table.publishedAt),
    visibleIdx: index('visible_idx').on(table.visible),
  })
);

// Services Table
export const services = mysqlTable('services', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).unique(),
  description: text('description').notNull(),
  features: text('features'),
  badge: varchar('badge', { length: 100 }),
  icon: varchar('icon', { length: 255 }),
  iconText: varchar('icon_text', { length: 100 }),
  order: int('order').default(0),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  visibleIdx: index('visible_idx').on(table.visible),
  slugIdx: index('slug_idx').on(table.slug),
}));

// Hero Sections Table
export const heroSections = mysqlTable('hero_sections', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 255 }),
  backgroundImage: varchar('background_image', { length: 500 }),
  active: boolean('active').default(false),
  order: int('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Contact Forms Table
export const contactForms = mysqlTable('contact_forms', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Quote Requests Table (Teklif Talepleri)
export const quoteRequests = mysqlTable(
  'quote_requests',
  {
    id: int('id').primaryKey().autoincrement(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    serviceType: varchar('service_type', { length: 100 }).notNull(),
    farmLocation: varchar('farm_location', { length: 255 }),
    landArea: varchar('land_area', { length: 100 }),
    cropType: varchar('crop_type', { length: 100 }),
    notes: text('notes'),
    status: varchar('status', { length: 50 }).default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index('status_idx').on(table.status),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);

// Pages Table
export const pages = mysqlTable(
  'pages',
  {
    id: int('id').primaryKey().autoincrement(),
    title: varchar('title', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text('content').notNull(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
  })
);

// Projects Table (Projeler/Çalışmalar)
export const projects = mysqlTable(
  'projects',
  {
    id: int('id').primaryKey().autoincrement(),
    categoryId: int('category_id').notNull().references(() => categories.id),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }),
    description: text('description'),
    content: text('content').notNull(),
    image: varchar('image', { length: 500 }), // Ana resim (kartta gösterilecek)
    location: varchar('location', { length: 255 }),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    seoKeywords: text('seo_keywords'),
    order: int('order').default(0),
    visible: boolean('visible').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    categoryIdx: index('category_idx').on(table.categoryId),
    slugIdx: index('slug_idx').on(table.slug),
    visibleIdx: index('visible_idx').on(table.visible),
  })
);

// Project Images Table (Proje Resimleri)
export const projectImages = mysqlTable(
  'project_images',
  {
    id: int('id').primaryKey().autoincrement(),
    projectId: int('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    order: int('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    projectIdx: index('project_idx').on(table.projectId),
  })
);

// Brands/Partners Table (Markalar/Partnerler)
export const brands = mysqlTable(
  'brands',
  {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    logoUrl: varchar('logo_url', { length: 500 }).notNull(),
    websiteUrl: varchar('website_url', { length: 500 }),
    order: int('order').default(0),
    active: boolean('active').default(true),
    visible: boolean('visible').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    activeIdx: index('active_idx').on(table.active),
    visibleIdx: index('visible_idx').on(table.visible),
    orderIdx: index('order_idx').on(table.order),
  })
);

// About Section Table (Hakkımızda Bölümü)
export const aboutSections = mysqlTable('about_sections', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(), // Rich text içerik (en az 3 paragraf)
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Export types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type HeroSection = typeof heroSections.$inferSelect;
export type NewHeroSection = typeof heroSections.$inferInsert;

export type ContactForm = typeof contactForms.$inferSelect;
export type NewContactForm = typeof contactForms.$inferInsert;

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectImage = typeof projectImages.$inferSelect;
export type NewProjectImage = typeof projectImages.$inferInsert;

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

export type AboutSection = typeof aboutSections.$inferSelect;
export type NewAboutSection = typeof aboutSections.$inferInsert;

// Admin Users Table
export const adminUsers = mysqlTable(
  'admin_users',
  {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    activeIdx: index('active_idx').on(table.active),
  })
);

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

// Settings Table (Site Settings)
export const settings = mysqlTable(
  'settings',
  {
    id: int('id').primaryKey().autoincrement(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    value: text('value'),
    description: text('description'),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    keyIdx: index('key_idx').on(table.key),
  })
);

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// SEO Keywords Table (Etiket Bulutu)
export const seoKeywords = mysqlTable(
  'seo_keywords',
  {
    id: int('id').primaryKey().autoincrement(),
    keyword: varchar('keyword', { length: 255 }).notNull().unique(),
    order: int('order').default(0),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    keywordIdx: index('keyword_idx').on(table.keyword),
    activeIdx: index('active_idx').on(table.active),
    orderIdx: index('order_idx').on(table.order),
  })
);

export type SeoKeyword = typeof seoKeywords.$inferSelect;
export type NewSeoKeyword = typeof seoKeywords.$inferInsert;

// ========== TRANSLATION TABLES (Best Practice: Separate Translation Tables) ==========

// Article Translations Table
export const articleTranslations = mysqlTable(
  'article_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    articleId: int('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(), // 'tr', 'en'
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    seoKeywords: text('seo_keywords'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    articleIdIdx: index('article_id_idx').on(table.articleId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    slugIdx: index('slug_idx').on(table.slug),
    uniqueArticleLanguage: index('unique_article_language').on(table.articleId, table.languageCode),
  })
);

// Service Translations Table
export const serviceTranslations = mysqlTable(
  'service_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    serviceId: int('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    serviceIdIdx: index('service_id_idx').on(table.serviceId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    uniqueServiceLanguage: index('unique_service_language').on(table.serviceId, table.languageCode),
  })
);

// Project Translations Table
export const projectTranslations = mysqlTable(
  'project_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    projectId: int('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }),
    description: text('description'),
    content: text('content').notNull(),
    location: varchar('location', { length: 255 }),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    seoKeywords: text('seo_keywords'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    projectIdIdx: index('project_id_idx').on(table.projectId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    slugIdx: index('slug_idx').on(table.slug),
    uniqueProjectLanguage: index('unique_project_language').on(table.projectId, table.languageCode),
  })
);

// Category Translations Table
export const categoryTranslations = mysqlTable(
  'category_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    categoryId: int('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    categoryIdIdx: index('category_id_idx').on(table.categoryId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    slugIdx: index('slug_idx').on(table.slug),
    uniqueCategoryLanguage: index('unique_category_language').on(table.categoryId, table.languageCode),
  })
);

// Page Translations Table
export const pageTranslations = mysqlTable(
  'page_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    pageId: int('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: text('content').notNull(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    pageIdIdx: index('page_id_idx').on(table.pageId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    slugIdx: index('slug_idx').on(table.slug),
    uniquePageLanguage: index('unique_page_language').on(table.pageId, table.languageCode),
  })
);

// Hero Section Translations Table
export const heroSectionTranslations = mysqlTable(
  'hero_section_translations',
  {
    id: int('id').primaryKey().autoincrement(),
    heroSectionId: int('hero_section_id').notNull().references(() => heroSections.id, { onDelete: 'cascade' }),
    languageCode: varchar('language_code', { length: 5 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    subtitle: text('subtitle'),
    ctaText: varchar('cta_text', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    heroSectionIdIdx: index('hero_section_id_idx').on(table.heroSectionId),
    languageCodeIdx: index('language_code_idx').on(table.languageCode),
    uniqueHeroSectionLanguage: index('unique_hero_section_language').on(table.heroSectionId, table.languageCode),
  })
);

// Export translation types
export type ArticleTranslation = typeof articleTranslations.$inferSelect;
export type NewArticleTranslation = typeof articleTranslations.$inferInsert;

export type ServiceTranslation = typeof serviceTranslations.$inferSelect;
export type NewServiceTranslation = typeof serviceTranslations.$inferInsert;

export type ProjectTranslation = typeof projectTranslations.$inferSelect;
export type NewProjectTranslation = typeof projectTranslations.$inferInsert;

export type CategoryTranslation = typeof categoryTranslations.$inferSelect;
export type NewCategoryTranslation = typeof categoryTranslations.$inferInsert;

export type PageTranslation = typeof pageTranslations.$inferSelect;
export type NewPageTranslation = typeof pageTranslations.$inferInsert;

export type HeroSectionTranslation = typeof heroSectionTranslations.$inferSelect;
export type NewHeroSectionTranslation = typeof heroSectionTranslations.$inferInsert;

