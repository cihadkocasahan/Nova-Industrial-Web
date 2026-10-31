// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

// Article Types
export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  categoryId?: number | null;
  authorId?: number | null;
  publishedAt?: string | null;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
  iconText?: string | null;
  order: number;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hero Section Types
export interface HeroSection {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  backgroundImage?: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Contact Form Types
export interface ContactForm {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Page Types
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Project Types (Projeler/Çalışmalar)
export interface Project {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  image?: string | null;
  location?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  order: number;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  images?: ProjectImage[] | null;
}

// Project Image Types
export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

// Brand/Partner Types
export interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  order: number;
  active: boolean;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
}

// SEO Keyword Types
export interface SeoKeyword {
  id: number;
  keyword: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// About Section Types
export interface AboutSection {
  id: number;
  title: string;
  content: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quote Request Types (Nova Agro)
export interface QuoteRequest {
  id: number;
  fullName: string;
  email?: string | null;
  phone: string;
  serviceType: string;
  farmLocation?: string | null;
  landArea?: string | number | null;
  landUnit?: 'Dekar' | 'Dönüm' | 'Hektar' | 'm²' | string | null;
  cropType?: string | null;
  notes?: string | null;
  referenceCode?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequestPayload {
  fullName: string;
  email?: string;
  phone: string;
  serviceType: string;
  farmLocation?: string;
  landArea?: string | number;
  landUnit?: 'Dekar' | 'Dönüm' | 'Hektar' | 'm²' | string;
  cropType?: string;
  notes?: string;
}
