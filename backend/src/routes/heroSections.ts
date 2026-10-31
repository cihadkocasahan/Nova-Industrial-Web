import { Router } from 'express';
import * as heroController from '../controllers/heroController.js';

const router = Router();

router.get('/', heroController.getAllHeroSections);
router.get('/active', heroController.getActiveHeroSection);
router.get('/active/all', heroController.getActiveHeroSections);

export default router;

