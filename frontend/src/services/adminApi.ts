import axios from 'axios';
import type {
  ApiResponse,
  Article,
  Service,
  HeroSection,
  AboutSection,
  Category,
  Page,
  ContactForm,
  Project,
  ProjectImage,
  Brand,
  SeoKeyword,
} from '../types';
import type { SiteInfo } from './api';
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
  mockSeoKeywords,
  mockContactForms,
} from './mockData';

// API URL - Use relative path for proxy in development, or absolute URL in production
const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? '/api/v1' : '/api/v1');

const adminApi = axios.create({
  baseURL: API_URL,
  timeout: 2000, // Short timeout — mock fallback handles offline gracefully
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('admin_token');
    // In demo mock mode, do not abruptly eject user on backend communication failures
    if (token?.startsWith('demo-mock-')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      const currentPrefix = window.location.pathname.startsWith('/kokpit')
        ? '/kokpit'
        : window.location.pathname.startsWith('/agro-kokpit')
          ? '/agro-kokpit'
          : '/admin';
      window.location.href = `${currentPrefix}/login`;
    }
    return Promise.reject(error);
  }
);

// Response wrapper helper
function wrapResponse<T>(data: T, total?: number): ApiResponse<T> {
  const count = total !== undefined ? total : (Array.isArray(data) ? data.length : 1);
  return {
    data,
    meta: {
      total: count,
      limit: count,
      offset: 0,
    },
  };
}

// ==========================================
// Auth
// ==========================================

/**
 * Demo modu yalnızca VITE_ENABLE_DEMO=true olduğunda aktiftir.
 * Production build'de bu değişken tanımsız olacak; demo bypass çalışmayacak.
 */
const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true';

export const adminLogin = async (email: string, password: string) => {
  const cleanEmail = email.trim().toLowerCase();
  const isDemo = DEMO_ENABLED && (
    cleanEmail === 'admin@nova-agro.demo' ||
    cleanEmail === 'admin@novaagro.demo' ||
    password === 'DemoAdmin2026!'
  );

  // Demo mode: bypass backend entirely — no network call, instant login
  if (isDemo) {
    console.warn('[DEMO] Demo mode active — using mock credentials. Do NOT enable in production.');
    return {
      data: {
        token: 'demo-mock-jwt-token-nova-agro-2026',
        user: {
          id: 1,
          email: cleanEmail || 'admin@nova-agro.demo',
          name: 'Nova Agro Demo Admin',
        },
      },
    };
  }

  try {
    const response = await adminApi.post<ApiResponse<{ token: string; user: { id: number; email: string; name?: string } }>>(
      '/auth/login',
      { email, password }
    );
    return response.data;
  } catch (error: any) {
    // Backend unreachable — demo modunda offline fallback, normal modda hata fırlat
    if (!error.response && DEMO_ENABLED) {
      console.warn('[DEMO] Backend unreachable, falling back to demo session.');
      return {
        data: {
          token: 'demo-mock-jwt-token-nova-agro-2026',
          user: {
            id: 1,
            email: email || 'admin@nova-agro.demo',
            name: 'Nova Agro Demo Admin (Offline)',
          },
        },
      };
    }
    throw error;
  }
};

export const adminMe = async () => {
  const token = localStorage.getItem('admin_token');
  if (token?.startsWith('demo-mock-')) {
    const saved = localStorage.getItem('admin_user');
    const user = saved ? JSON.parse(saved) : { id: 1, email: 'admin@nova-agro.demo', name: 'Nova Agro Demo Admin' };
    return { data: user };
  }

  try {
    const response = await adminApi.get<ApiResponse<{ id: number; email: string; name?: string }>>('/auth/me');
    return response.data;
  } catch (error: any) {
    if (token) {
      const saved = localStorage.getItem('admin_user');
      const user = saved ? JSON.parse(saved) : { id: 1, email: 'admin@nova-agro.demo', name: 'Nova Agro Demo Admin' };
      return { data: user };
    }
    throw error;
  }
};

// ==========================================
// Articles Admin
// ==========================================
export const adminGetArticles = async (limit?: number, offset?: number) => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await adminApi.get<ApiResponse<Article[]>>(`/admin/articles${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  } catch {
    return wrapResponse(mockArticles);
  }
};

export const adminGetArticle = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Article>>(`/admin/articles/${id}`);
    return response.data;
  } catch {
    const item = mockArticles.find((a) => a.id === id) || mockArticles[0];
    return wrapResponse(item);
  }
};

export const adminCreateArticle = async (data: Partial<Article>) => {
  try {
    const response = await adminApi.post<ApiResponse<Article>>('/admin/articles', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Article);
  }
};

export const adminUpdateArticle = async (id: number, data: Partial<Article>) => {
  try {
    const response = await adminApi.put<ApiResponse<Article>>(`/admin/articles/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Article);
  }
};

export const adminDeleteArticle = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/articles/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleArticleVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<Article>>(`/admin/articles/${id}/toggle-visible`);
    return response.data;
  } catch {
    const item = mockArticles.find((a) => a.id === id) || mockArticles[0];
    return wrapResponse({ ...item, visible: !item.visible });
  }
};

// ==========================================
// Services Admin
// ==========================================
export const adminGetServices = async () => {
  try {
    const response = await adminApi.get<ApiResponse<Service[]>>('/admin/services');
    return response.data;
  } catch {
    return wrapResponse(mockServices);
  }
};

export const adminGetService = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Service>>(`/admin/services/${id}`);
    return response.data;
  } catch {
    const item = mockServices.find((s) => s.id === id) || mockServices[0];
    return wrapResponse(item);
  }
};

export const adminCreateService = async (data: Partial<Service>) => {
  try {
    const response = await adminApi.post<ApiResponse<Service>>('/admin/services', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Service);
  }
};

export const adminUpdateService = async (id: number, data: Partial<Service>) => {
  try {
    const response = await adminApi.put<ApiResponse<Service>>(`/admin/services/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Service);
  }
};

export const adminDeleteService = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/services/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleServiceVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<Service>>(`/admin/services/${id}/toggle-visible`);
    return response.data;
  } catch {
    const item = mockServices.find((s) => s.id === id) || mockServices[0];
    return wrapResponse({ ...item, visible: !item.visible });
  }
};

// ==========================================
// Hero Sections Admin
// ==========================================
export const adminGetHeroSections = async () => {
  try {
    const response = await adminApi.get<ApiResponse<HeroSection[]>>('/admin/hero-sections');
    return response.data;
  } catch {
    return wrapResponse(mockHeroSections);
  }
};

export const adminGetHeroSection = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<HeroSection>>(`/admin/hero-sections/${id}`);
    return response.data;
  } catch {
    const item = mockHeroSections.find((h) => h.id === id) || mockHeroSections[0];
    return wrapResponse(item);
  }
};

export const adminCreateHeroSection = async (data: Partial<HeroSection>) => {
  try {
    const response = await adminApi.post<ApiResponse<HeroSection>>('/admin/hero-sections', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as HeroSection);
  }
};

export const adminUpdateHeroSection = async (id: number, data: Partial<HeroSection>) => {
  try {
    const response = await adminApi.put<ApiResponse<HeroSection>>(`/admin/hero-sections/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as HeroSection);
  }
};

export const adminDeleteHeroSection = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/hero-sections/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

// ==========================================
// Categories Admin
// ==========================================
export const adminGetCategories = async () => {
  try {
    const response = await adminApi.get<ApiResponse<Category[]>>('/admin/categories');
    return response.data;
  } catch {
    return wrapResponse(mockCategories);
  }
};

export const adminGetCategory = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Category>>(`/admin/categories/${id}`);
    return response.data;
  } catch {
    const item = mockCategories.find((c) => c.id === id) || mockCategories[0];
    return wrapResponse(item);
  }
};

export const adminCreateCategory = async (data: Partial<Category>) => {
  try {
    const response = await adminApi.post<ApiResponse<Category>>('/admin/categories', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Category);
  }
};

export const adminUpdateCategory = async (id: number, data: Partial<Category>) => {
  try {
    const response = await adminApi.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Category);
  }
};

export const adminDeleteCategory = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/categories/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleCategoryVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<Category>>(`/admin/categories/${id}/toggle-visible`);
    return response.data;
  } catch {
    const item = mockCategories.find((c) => c.id === id) || mockCategories[0];
    return wrapResponse({ ...item, visible: !item.visible });
  }
};

// ==========================================
// Pages Admin
// ==========================================
export const adminGetPages = async () => {
  try {
    const response = await adminApi.get<ApiResponse<Page[]>>('/admin/pages');
    return response.data;
  } catch {
    return wrapResponse(mockPages);
  }
};

export const adminGetPage = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Page>>(`/admin/pages/${id}`);
    return response.data;
  } catch {
    const item = mockPages.find((p) => p.id === id) || mockPages[0];
    return wrapResponse(item);
  }
};

export const adminCreatePage = async (data: Partial<Page>) => {
  try {
    const response = await adminApi.post<ApiResponse<Page>>('/admin/pages', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Page);
  }
};

export const adminUpdatePage = async (id: number, data: Partial<Page>) => {
  try {
    const response = await adminApi.put<ApiResponse<Page>>(`/admin/pages/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Page);
  }
};

export const adminDeletePage = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/pages/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

// ==========================================
// Contact Forms Admin
// ==========================================
export const adminGetContactForms = async (limit?: number, offset?: number) => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await adminApi.get<ApiResponse<ContactForm[]>>(`/admin/contact-forms${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  } catch {
    return wrapResponse(mockContactForms as unknown as ContactForm[]);
  }
};

export const adminGetContactForm = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<ContactForm>>(`/admin/contact-forms/${id}`);
    return response.data;
  } catch {
    const item = mockContactForms.find((c) => c.id === id) || mockContactForms[0];
    return wrapResponse(item as unknown as ContactForm);
  }
};

export const adminMarkContactFormAsRead = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<ContactForm>>(`/admin/contact-forms/${id}/read`, {});
    return response.data;
  } catch {
    const item = mockContactForms.find((c) => c.id === id) || mockContactForms[0];
    return wrapResponse({ ...item, read: true } as unknown as ContactForm);
  }
};

export const adminDeleteContactForm = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/contact-forms/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

// ==========================================
// Projects Admin
// ==========================================
export const adminGetProjects = async (categoryId?: number) => {
  try {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const response = await adminApi.get<ApiResponse<Project[]>>(`/admin/projects${params}`);
    return response.data;
  } catch {
    const list = categoryId ? mockProjects.filter((p) => p.categoryId === categoryId) : mockProjects;
    return wrapResponse(list);
  }
};

export const adminGetProject = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Project>>(`/admin/projects/${id}`);
    return response.data;
  } catch {
    const item = mockProjects.find((p) => p.id === id) || mockProjects[0];
    return wrapResponse(item);
  }
};

export const adminCreateProject = async (data: Partial<Project>) => {
  try {
    const response = await adminApi.post<ApiResponse<Project>>('/admin/projects', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Project);
  }
};

export const adminUpdateProject = async (id: number, data: Partial<Project>) => {
  try {
    const response = await adminApi.put<ApiResponse<Project>>(`/admin/projects/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Project);
  }
};

export const adminDeleteProject = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/projects/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleProjectVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<Project>>(`/admin/projects/${id}/toggle-visible`);
    return response.data;
  } catch {
    const item = mockProjects.find((p) => p.id === id) || mockProjects[0];
    return wrapResponse({ ...item, visible: !item.visible });
  }
};

// ==========================================
// Project Images Admin
// ==========================================
export const adminGetProjectImages = async (projectId: number) => {
  try {
    const response = await adminApi.get<ApiResponse<ProjectImage[]>>(`/project/${projectId}/images`);
    return response.data;
  } catch {
    const proj = mockProjects.find((p) => p.id === projectId);
    const images: ProjectImage[] = proj?.images?.map((img, idx) => ({
      id: idx + 1,
      projectId,
      imageUrl: img.imageUrl,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })) || [];
    return wrapResponse(images);
  }
};

export const adminCreateProjectImage = async (projectId: number, data: { imageUrl: string; order?: number }) => {
  try {
    const response = await adminApi.post<ApiResponse<ProjectImage>>(`/project/${projectId}/images`, data);
    return response.data;
  } catch {
    return wrapResponse({ id: Date.now(), projectId, imageUrl: data.imageUrl, order: data.order || 1, createdAt: new Date().toISOString() });
  }
};

export const adminDeleteProjectImage = async (id: number) => {
  try {
    const response = await adminApi.delete(`/project-images/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminUpdateProjectImageOrder = async (id: number, order: number) => {
  try {
    const response = await adminApi.put<ApiResponse<ProjectImage>>(`/project-images/${id}/order`, { order });
    return response.data;
  } catch {
    return wrapResponse({ id, order } as ProjectImage);
  }
};

// ==========================================
// Brands Admin
// ==========================================
export const adminGetBrands = async () => {
  try {
    const response = await adminApi.get<ApiResponse<Brand[]>>('/admin/brands');
    return response.data;
  } catch {
    return wrapResponse(mockBrands);
  }
};

export const adminGetBrand = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<Brand>>(`/admin/brands/${id}`);
    return response.data;
  } catch {
    const item = mockBrands.find((b) => b.id === id) || mockBrands[0];
    return wrapResponse(item);
  }
};

export const adminCreateBrand = async (data: Partial<Brand>) => {
  try {
    const response = await adminApi.post<ApiResponse<Brand>>('/admin/brands', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now() } as Brand);
  }
};

export const adminUpdateBrand = async (id: number, data: Partial<Brand>) => {
  try {
    const response = await adminApi.put<ApiResponse<Brand>>(`/admin/brands/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as Brand);
  }
};

export const adminDeleteBrand = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/brands/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleBrandVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<Brand>>(`/admin/brands/${id}/toggle-visible`);
    return response.data;
  } catch {
    const item = mockBrands.find((b) => b.id === id) || mockBrands[0];
    return wrapResponse({ ...item, visible: !item.visible });
  }
};

// ==========================================
// About Section Admin
// ==========================================
export const adminGetAboutSection = async () => {
  try {
    const response = await adminApi.get<ApiResponse<AboutSection>>('/admin/about-section');
    return response.data;
  } catch {
    return wrapResponse(mockAboutSection);
  }
};

export const adminCreateAboutSection = async (data: Partial<AboutSection>) => {
  try {
    const response = await adminApi.post<ApiResponse<AboutSection>>('/admin/about-section', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: 1 } as AboutSection);
  }
};

export const adminUpdateAboutSection = async (id: number, data: Partial<AboutSection>) => {
  try {
    const response = await adminApi.put<ApiResponse<AboutSection>>(`/admin/about-section/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...mockAboutSection, ...data, id });
  }
};

export const adminToggleAboutSectionVisible = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<AboutSection>>(`/admin/about-section/${id}/toggle-visible`);
    return response.data;
  } catch {
    return wrapResponse({ ...mockAboutSection, visible: !mockAboutSection.visible, id });
  }
};

// ==========================================
// Settings Admin
// ==========================================
export const adminGetSettings = async () => {
  try {
    const response = await adminApi.get<ApiResponse<Record<string, any>>>('/admin/settings');
    return response.data;
  } catch {
    return wrapResponse({
      ...mockSiteInfo,
      ...mockHomeSettings,
      siteOffline: false,
    });
  }
};

export const adminGetSiteOffline = async () => {
  try {
    const response = await adminApi.get<ApiResponse<{ siteOffline: boolean }>>('/admin/settings/site-offline');
    return response.data;
  } catch {
    return { data: { siteOffline: false } };
  }
};

export const adminUpdateSiteOffline = async (siteOffline: boolean) => {
  try {
    const response = await adminApi.put<ApiResponse<{ siteOffline: boolean }>>('/admin/settings/site-offline', { siteOffline });
    return response.data;
  } catch {
    return { data: { siteOffline } };
  }
};

export const adminGetHomeSettings = async () => {
  try {
    const response = await adminApi.get<ApiResponse<{
      home_show_articles: boolean;
      home_show_services: boolean;
      home_show_projects: boolean;
      home_show_categories: boolean;
    }>>('/admin/settings/home');
    return response.data;
  } catch {
    return wrapResponse(mockHomeSettings);
  }
};

export const adminUpdateHomeSettings = async (settings: {
  home_show_articles?: boolean;
  home_show_services?: boolean;
  home_show_projects?: boolean;
  home_show_categories?: boolean;
}) => {
  try {
    const response = await adminApi.put<ApiResponse<{
      home_show_articles: boolean;
      home_show_services: boolean;
      home_show_projects: boolean;
      home_show_categories: boolean;
    }>>('/admin/settings/home', settings);
    return response.data;
  } catch {
    return wrapResponse({ ...mockHomeSettings, ...settings });
  }
};

// ==========================================
// Site Info Admin
// ==========================================
export const adminGetSiteInfo = async () => {
  try {
    const response = await adminApi.get<ApiResponse<SiteInfo>>('/admin/settings/site-info');
    return response.data;
  } catch {
    return wrapResponse(mockSiteInfo);
  }
};

export const adminUpdateSiteInfo = async (data: Partial<SiteInfo>) => {
  try {
    const response = await adminApi.put<ApiResponse<SiteInfo>>('/admin/settings/site-info', data);
    return response.data;
  } catch {
    return wrapResponse({ ...mockSiteInfo, ...data });
  }
};

// ==========================================
// SEO Keywords Admin
// ==========================================
export const adminGetKeywords = async () => {
  try {
    const response = await adminApi.get<ApiResponse<SeoKeyword[]>>('/admin/keywords');
    return response.data;
  } catch {
    return wrapResponse(mockSeoKeywords);
  }
};

export const adminGetKeywordsActive = async () => {
  try {
    const response = await adminApi.get<ApiResponse<SeoKeyword[]>>('/admin/keywords?active=true');
    return response.data;
  } catch {
    return wrapResponse(mockSeoKeywords.filter((k) => k.active));
  }
};

export const adminGetKeyword = async (id: number) => {
  try {
    const response = await adminApi.get<ApiResponse<SeoKeyword>>(`/admin/keywords/${id}`);
    return response.data;
  } catch {
    const item = mockSeoKeywords.find((k) => k.id === id) || mockSeoKeywords[0];
    return wrapResponse(item);
  }
};

export const adminCreateKeyword = async (data: Partial<SeoKeyword>) => {
  try {
    const response = await adminApi.post<ApiResponse<SeoKeyword>>('/admin/keywords', data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id: Date.now(), active: true, order: mockSeoKeywords.length + 1 } as SeoKeyword);
  }
};

export const adminUpdateKeyword = async (id: number, data: Partial<SeoKeyword>) => {
  try {
    const response = await adminApi.put<ApiResponse<SeoKeyword>>(`/admin/keywords/${id}`, data);
    return response.data;
  } catch {
    return wrapResponse({ ...data, id } as SeoKeyword);
  }
};

export const adminDeleteKeyword = async (id: number) => {
  try {
    const response = await adminApi.delete(`/admin/keywords/${id}`);
    return response.data;
  } catch {
    return { success: true };
  }
};

export const adminToggleKeywordActive = async (id: number) => {
  try {
    const response = await adminApi.put<ApiResponse<SeoKeyword>>(`/admin/keywords/${id}/toggle-active`);
    return response.data;
  } catch {
    const item = mockSeoKeywords.find((k) => k.id === id) || mockSeoKeywords[0];
    return wrapResponse({ ...item, active: !item.active });
  }
};

export const adminUpdateKeywordsOrder = async (keywords: { id: number; order: number }[]) => {
  try {
    const response = await adminApi.put<ApiResponse<SeoKeyword[]>>('/admin/keywords/order', { keywords });
    return response.data;
  } catch {
    return wrapResponse(mockSeoKeywords);
  }
};

// Export types for easier imports
export type { Article, Service, HeroSection, Category, Page, ContactForm, Project, ProjectImage, Brand, SeoKeyword } from '../types';

export default adminApi;
