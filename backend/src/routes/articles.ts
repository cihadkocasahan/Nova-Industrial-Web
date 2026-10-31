import { Router } from 'express';
import * as articleController from '../controllers/articleController.js';

const router = Router();

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/slug/:slug', articleController.getArticleBySlug);

export default router;

