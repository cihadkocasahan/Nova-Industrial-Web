import { Router } from 'express';
import * as sitemapController from '../controllers/sitemapController.js';

const router = Router();

router.get('/', sitemapController.generateSitemap);

export default router;

