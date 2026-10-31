import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';

const router = Router();

router.post('/', contactController.createContactForm);

export default router;

