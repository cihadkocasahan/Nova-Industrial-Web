import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';

const router = Router();

// Spesifik route'lar önce gelmeli (Express route matching için)
router.get('/category/:categorySlug', projectController.getProjectsByCategorySlug);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

export default router;

