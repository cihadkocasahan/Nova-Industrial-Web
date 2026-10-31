import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as adminArticleController from '../controllers/adminArticleController.js';
import * as adminServiceController from '../controllers/adminServiceController.js';
import * as adminHeroController from '../controllers/adminHeroController.js';
import * as adminAboutController from '../controllers/adminAboutController.js';
import * as adminCategoryController from '../controllers/adminCategoryController.js';
import * as adminPageController from '../controllers/adminPageController.js';
import * as adminContactController from '../controllers/adminContactController.js';
import * as adminProjectController from '../controllers/adminProjectController.js';
import * as adminBrandController from '../controllers/adminBrandController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as adminKeywordController from '../controllers/adminKeywordController.js';

const router = Router();

// Tüm admin route'ları authentication ile korunuyor
router.use(authenticate);

// Articles admin routes
router.get('/articles', adminArticleController.getAllArticles);
router.get('/articles/:id', adminArticleController.getArticleById);
router.post('/articles', adminArticleController.createArticle);
router.put('/articles/:id', adminArticleController.updateArticle);
router.delete('/articles/:id', adminArticleController.deleteArticle);
router.put('/articles/:id/toggle-visible', adminArticleController.toggleArticleVisible);

// Services admin routes
router.get('/services', adminServiceController.getAllServices);
router.get('/services/:id', adminServiceController.getServiceById);
router.post('/services', adminServiceController.createService);
router.put('/services/:id', adminServiceController.updateService);
router.delete('/services/:id', adminServiceController.deleteService);
router.put('/services/:id/toggle-visible', adminServiceController.toggleServiceVisible);

// Hero Sections admin routes
router.get('/hero-sections', adminHeroController.getAllHeroSections);
router.get('/hero-sections/:id', adminHeroController.getHeroSectionById);
router.post('/hero-sections', adminHeroController.createHeroSection);
router.put('/hero-sections/:id', adminHeroController.updateHeroSection);
router.delete('/hero-sections/:id', adminHeroController.deleteHeroSection);

// About Section admin routes
router.get('/about-section', adminAboutController.getAboutSection);
router.post('/about-section', adminAboutController.createAboutSection);
router.put('/about-section/:id', adminAboutController.updateAboutSection);
router.put('/about-section/:id/toggle-visible', adminAboutController.toggleAboutSectionVisible);

// Categories admin routes
router.get('/categories', adminCategoryController.getAllCategories);
router.get('/categories/:id', adminCategoryController.getCategoryById);
router.post('/categories', adminCategoryController.createCategory);
router.put('/categories/:id', adminCategoryController.updateCategory);
router.put('/categories/:id/toggle-visible', adminCategoryController.toggleCategoryVisible);
router.delete('/categories/:id', adminCategoryController.deleteCategory);

// Pages admin routes
router.get('/pages', adminPageController.getAllPages);
router.get('/pages/:id', adminPageController.getPageById);
router.post('/pages', adminPageController.createPage);
router.put('/pages/:id', adminPageController.updatePage);
router.delete('/pages/:id', adminPageController.deletePage);

// Contact Forms admin routes
router.get('/contact-forms', adminContactController.getAllContactForms);
router.get('/contact-forms/:id', adminContactController.getContactFormById);
router.put('/contact-forms/:id/read', adminContactController.markAsRead);
router.delete('/contact-forms/:id', adminContactController.deleteContactForm);

// Projects admin routes
router.get('/projects', adminProjectController.getAllProjects);
router.get('/projects/:id', adminProjectController.getProjectById);
router.post('/projects', adminProjectController.createProject);
router.put('/projects/:id/toggle-visible', adminProjectController.toggleProjectVisible);
router.put('/projects/:id', adminProjectController.updateProject);
router.delete('/projects/:id', adminProjectController.deleteProject);

// Brands admin routes
router.get('/brands', adminBrandController.getAllBrands);
router.get('/brands/:id', adminBrandController.getBrandById);
router.post('/brands', adminBrandController.createBrand);
router.put('/brands/:id', adminBrandController.updateBrand);
router.put('/brands/:id/toggle-visible', adminBrandController.toggleBrandVisible);
router.delete('/brands/:id', adminBrandController.deleteBrand);

// Settings admin routes
router.get('/settings', settingsController.getAllSettings);
router.get('/settings/site-offline', settingsController.getSiteOffline);
router.put('/settings/site-offline', settingsController.updateSiteOffline);
router.get('/settings/home', settingsController.getHomeSettings);
router.put('/settings/home', settingsController.updateHomeSettings);
router.get('/settings/site-info', settingsController.getSiteInfo);
router.put('/settings/site-info', settingsController.updateSiteInfo);

// SEO Keywords admin routes
router.get('/keywords', adminKeywordController.getAllKeywords);
router.get('/keywords/:id', adminKeywordController.getKeywordById);
router.post('/keywords', adminKeywordController.createKeyword);
router.put('/keywords/:id', adminKeywordController.updateKeyword);
router.put('/keywords/:id/toggle-active', adminKeywordController.toggleKeywordActive);
router.put('/keywords/order', adminKeywordController.updateKeywordsOrder);
router.delete('/keywords/:id', adminKeywordController.deleteKeyword);

export default router;

