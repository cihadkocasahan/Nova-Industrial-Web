import { Router } from 'express';
import * as brandController from '../controllers/brandController.js';

const router = Router();

router.get('/', brandController.getAllBrands);
router.get('/active', brandController.getActiveBrands);
router.get('/:id', brandController.getBrandById);

export default router;

