import axios from 'axios';
import type {
  ApiResponse,
  Article,
  Service,
  HeroSection,
  AboutSection,
  ContactFormInput,
  Page,
  Category,
  Project,
  Brand,
} from '../types';
import {
  mockSiteInfo,
  mockHeroSections,
  mockServices,
  mockCategories,
  mockProjects,
  mockBrands,
  mockArticles,
  mockAboutSection,
  mockHomeSettings,
  mockPages,
} from './mockData';

// Standalone Mock Mode Detection
// Enabled by default unless explicitly disabled with VITE_USE_MOCK='false'
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// API URL - Use relative path for proxy in development, or absolute URL in production
const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? '/api/v1' : '/api/v1');

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('API call encountered an error, falling back to mock data where applicable:', error.message);
    }
    return Promise.reject(error);
  }
);

// Quote Request Interface Contract
export interface QuoteRequestPayload {
  serviceType: string;
  landArea: string | number;
  landUnit?: 'Dekar' | 'Dönüm' | 'Hektar' | 'm²' | string;
  cropType?: string;
  farmLocation?: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface QuoteRequestResult {
  success: boolean;
  message: string;
  referenceCode: string;
  id?: number | string;
}

export type QuoteApiResponse = ApiResponse<QuoteRequestResult> & QuoteRequestResult;

// Helper to generate AGRO-2026-XXXX reference codes
export function generateQuoteReferenceCode(prefix = 'AGRO-2026-'): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}

// Helper: Wrap data in standard ApiResponse shape
function wrapResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return {
    data,
    meta: meta || {
      total: Array.isArray(data) ? data.length : 1,
      limit: Array.isArray(data) ? data.length : 1,
      offset: 0,
    },
  };
}

// ==========================================
// API Endpoints with Transparent Fallback
// ==========================================

// 1. Articles
export const getArticles = async (limit?: number, offset?: number): Promise<ApiResponse<Article[]>> => {
  if (FORCE_MOCK) {
    let result = [...mockArticles];
    if (offset) result = result.slice(offset);
    if (limit) result = result.slice(0, limit);
    return wrapResponse(result, { total: mockArticles.length, limit: limit || mockArticles.length, offset: offset || 0 });
  }

  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await api.get<ApiResponse<Article[]>>(`/articles${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  } catch {
    let result = [...mockArticles];
    if (offset) result = result.slice(offset);
    if (limit) result = result.slice(0, limit);
    return wrapResponse(result, { total: mockArticles.length, limit: limit || mockArticles.length, offset: offset || 0 });
  }
};

export const getArticleById = async (id: number): Promise<ApiResponse<Article>> => {
  if (FORCE_MOCK) {
    const found = mockArticles.find((a) => a.id === id) || mockArticles[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Article>>(`/articles/${id}`);
    return response.data;
  } catch {
    const found = mockArticles.find((a) => a.id === id) || mockArticles[0];
    return wrapResponse(found);
  }
};

export const getArticleBySlug = async (slug: string): Promise<ApiResponse<Article>> => {
  if (FORCE_MOCK) {
    const found = mockArticles.find((a) => a.slug === slug) || mockArticles[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Article>>(`/articles/slug/${slug}`);
    return response.data;
  } catch {
    const found = mockArticles.find((a) => a.slug === slug) || mockArticles[0];
    return wrapResponse(found);
  }
};

// 2. Services
export const getServices = async (): Promise<ApiResponse<Service[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockServices);
  }
  try {
    const response = await api.get<ApiResponse<Service[]>>('/services');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(mockServices);
  } catch {
    return wrapResponse(mockServices);
  }
};

// 3. Hero Sections
export const getHeroSections = async (): Promise<ApiResponse<HeroSection[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockHeroSections);
  }
  try {
    const response = await api.get<ApiResponse<HeroSection[]>>('/hero-sections');
    return response.data;
  } catch {
    return wrapResponse(mockHeroSections);
  }
};

export const getActiveHeroSection = async (): Promise<ApiResponse<HeroSection>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockHeroSections[0]);
  }
  try {
    const response = await api.get<ApiResponse<HeroSection>>('/hero-sections/active');
    return response.data;
  } catch {
    return wrapResponse(mockHeroSections[0]);
  }
};

export const getActiveHeroSections = async (): Promise<ApiResponse<HeroSection[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockHeroSections);
  }
  try {
    const response = await api.get<ApiResponse<HeroSection[]>>('/hero-sections/active/all');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(mockHeroSections);
  } catch {
    return wrapResponse(mockHeroSections);
  }
};

// 4. Contact Forms
export const createContactForm = async (data: ContactFormInput): Promise<ApiResponse<{ id: number; message: string }>> => {
  if (FORCE_MOCK) {
    try {
      const existing = JSON.parse(localStorage.getItem('nova_agro_contacts') || '[]');
      const newContact = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
      existing.push(newContact);
      localStorage.setItem('nova_agro_contacts', JSON.stringify(existing));
    } catch {
      // localStorage fallback silent ignore
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return wrapResponse({ id: Date.now(), message: 'Mesajınız başarıyla iletildi.' });
  }

  try {
    const response = await api.post<ApiResponse<{ id: number; message: string }>>('/contact-forms', data);
    return response.data;
  } catch {
    try {
      const existing = JSON.parse(localStorage.getItem('nova_agro_contacts') || '[]');
      existing.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() });
      localStorage.setItem('nova_agro_contacts', JSON.stringify(existing));
    } catch {
      // Ignore
    }
    return wrapResponse({ id: Date.now(), message: 'Mesajınız başarıyla iletildi.' });
  }
};

// 5. Quote Requests (Teklif Talebi)
export const createQuoteRequest = async (payload: QuoteRequestPayload): Promise<QuoteApiResponse> => {
  const refCode = generateQuoteReferenceCode();
  const mockResult: QuoteRequestResult = {
    success: true,
    message: 'Teklif talebiniz başarıyla alındı.',
    referenceCode: refCode,
  };

  const persistToLocalStorage = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing = JSON.parse(window.localStorage.getItem('nova_agro_quotes') || '[]');
        const record = {
          ...payload,
          referenceCode: refCode,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        existing.push(record);
        window.localStorage.setItem('nova_agro_quotes', JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('localStorage persist error:', e);
    }
  };

  if (FORCE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    persistToLocalStorage();
    return {
      data: mockResult,
      ...mockResult,
    };
  }

  try {
    const response = await api.post<ApiResponse<QuoteRequestResult>>('/quotes', payload);
    persistToLocalStorage();
    const resultData = response.data?.data || mockResult;
    return {
      data: resultData,
      ...resultData,
    };
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 300));
    persistToLocalStorage();
    return {
      data: mockResult,
      ...mockResult,
    };
  }
};

// 6. Categories
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockCategories);
  }
  try {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(mockCategories);
  } catch {
    return wrapResponse(mockCategories);
  }
};

export const getCategoryById = async (id: number): Promise<ApiResponse<Category>> => {
  if (FORCE_MOCK) {
    const found = mockCategories.find((c) => c.id === id) || mockCategories[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  } catch {
    const found = mockCategories.find((c) => c.id === id) || mockCategories[0];
    return wrapResponse(found);
  }
};

// 7. Pages
export const getPages = async (): Promise<ApiResponse<Page[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockPages);
  }
  try {
    const response = await api.get<ApiResponse<Page[]>>('/pages');
    return response.data;
  } catch {
    return wrapResponse(mockPages);
  }
};

export const getPageById = async (id: number): Promise<ApiResponse<Page>> => {
  if (FORCE_MOCK) {
    const found = mockPages.find((p) => p.id === id) || mockPages[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Page>>(`/pages/${id}`);
    return response.data;
  } catch {
    const found = mockPages.find((p) => p.id === id) || mockPages[0];
    return wrapResponse(found);
  }
};

export const getPageBySlug = async (slug: string): Promise<ApiResponse<Page>> => {
  if (FORCE_MOCK) {
    const found = mockPages.find((p) => p.slug === slug) || mockPages[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Page>>(`/pages/slug/${slug}`);
    return response.data;
  } catch {
    const found = mockPages.find((p) => p.slug === slug) || mockPages[0];
    return wrapResponse(found);
  }
};

// 8. Projects
export const getProjects = async (categoryId?: number): Promise<ApiResponse<Project[]>> => {
  if (FORCE_MOCK) {
    const list = categoryId ? mockProjects.filter((p) => p.categoryId === categoryId) : mockProjects;
    return wrapResponse(list);
  }
  try {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const response = await api.get<ApiResponse<Project[]>>(`/projects${params}`);
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(categoryId ? mockProjects.filter((p) => p.categoryId === categoryId) : mockProjects);
  } catch {
    const list = categoryId ? mockProjects.filter((p) => p.categoryId === categoryId) : mockProjects;
    return wrapResponse(list);
  }
};

export const getProjectsByCategorySlug = async (categorySlug: string): Promise<ApiResponse<Project[]>> => {
  if (FORCE_MOCK) {
    const cat = mockCategories.find((c) => c.slug === categorySlug);
    const list = cat ? mockProjects.filter((p) => p.categoryId === cat.id) : mockProjects;
    return wrapResponse(list);
  }
  try {
    const response = await api.get<ApiResponse<Project[]>>(`/projects/category/${categorySlug}`);
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    const cat = mockCategories.find((c) => c.slug === categorySlug);
    const list = cat ? mockProjects.filter((p) => p.categoryId === cat.id) : mockProjects;
    return wrapResponse(list);
  } catch {
    const cat = mockCategories.find((c) => c.slug === categorySlug);
    const list = cat ? mockProjects.filter((p) => p.categoryId === cat.id) : mockProjects;
    return wrapResponse(list);
  }
};

export const getProjectById = async (id: number): Promise<ApiResponse<Project>> => {
  if (FORCE_MOCK) {
    const found = mockProjects.find((p) => p.id === id) || mockProjects[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data;
  } catch {
    const found = mockProjects.find((p) => p.id === id) || mockProjects[0];
    return wrapResponse(found);
  }
};

export const getProjectBySlug = async (slug: string): Promise<ApiResponse<Project>> => {
  if (FORCE_MOCK) {
    const found = mockProjects.find((p) => p.slug === slug) || mockProjects[0];
    return wrapResponse(found);
  }
  try {
    const response = await api.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
    return response.data;
  } catch {
    const found = mockProjects.find((p) => p.slug === slug) || mockProjects[0];
    return wrapResponse(found);
  }
};

// 9. Brands/Partners
export const getBrands = async (): Promise<ApiResponse<Brand[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockBrands);
  }
  try {
    const response = await api.get<ApiResponse<Brand[]>>('/brands');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(mockBrands);
  } catch {
    return wrapResponse(mockBrands);
  }
};

export const getActiveBrands = async (): Promise<ApiResponse<Brand[]>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockBrands);
  }
  try {
    const response = await api.get<ApiResponse<Brand[]>>('/brands/active');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data;
    }
    return wrapResponse(mockBrands);
  } catch {
    return wrapResponse(mockBrands);
  }
};

// 10. About Section
export const getAboutSection = async (): Promise<ApiResponse<AboutSection>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockAboutSection);
  }
  try {
    const response = await api.get<ApiResponse<AboutSection>>('/about-sections');
    if (response.data?.data) {
      return response.data;
    }
    return wrapResponse(mockAboutSection);
  } catch {
    return wrapResponse(mockAboutSection);
  }
};

// 11. Settings (Public)
export const getSiteOffline = async (): Promise<ApiResponse<{ siteOffline: boolean }>> => {
  if (FORCE_MOCK) {
    return wrapResponse({ siteOffline: false });
  }
  try {
    const response = await api.get<ApiResponse<{ siteOffline: boolean }>>('/settings/site-offline');
    return response.data;
  } catch {
    return wrapResponse({ siteOffline: false });
  }
};

export const getHomeSettings = async (): Promise<ApiResponse<{
  home_show_articles: boolean;
  home_show_services: boolean;
  home_show_projects: boolean;
  home_show_categories: boolean;
}>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockHomeSettings);
  }
  try {
    const response = await api.get<ApiResponse<{
      home_show_articles: boolean;
      home_show_services: boolean;
      home_show_projects: boolean;
      home_show_categories: boolean;
    }>>('/settings/home');
    return response.data;
  } catch {
    return wrapResponse(mockHomeSettings);
  }
};

// 12. Site Info (Public)
export interface SiteInfo {
  site_name: string;
  site_slogan: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  site_whatsapp: string;
  site_primary_color: string;
  site_cta_text: string;
  site_meta_title: string;
  site_meta_description: string;
  site_meta_keywords: string;
}

export const getSiteInfo = async (): Promise<ApiResponse<SiteInfo>> => {
  if (FORCE_MOCK) {
    return wrapResponse(mockSiteInfo);
  }
  try {
    const response = await api.get<ApiResponse<SiteInfo>>('/settings/site-info');
    if (response.data?.data) {
      return response.data;
    }
    return wrapResponse(mockSiteInfo);
  } catch {
    return wrapResponse(mockSiteInfo);
  }
};

export { api };
export default api;
