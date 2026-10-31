import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();

// Public settings routes
router.get('/site-offline', settingsController.getSiteOffline);
router.get('/home', settingsController.getHomeSettings);
router.get('/site-info', settingsController.getSiteInfo);

export default router;

