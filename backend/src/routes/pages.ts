import { Router } from 'express';
import * as pageController from '../controllers/pageController.js';

const router = Router();

router.get('/', pageController.getAllPages);
router.get('/:id', pageController.getPageById);
router.get('/slug/:slug', pageController.getPageBySlug);

export default router;

