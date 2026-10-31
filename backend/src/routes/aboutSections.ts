import { Router } from 'express';
import * as aboutController from '../controllers/aboutController.js';

const router = Router();

router.get('/', aboutController.getAboutSection);

export default router;

