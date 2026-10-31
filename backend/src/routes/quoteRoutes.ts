import { Router } from 'express';
import * as quoteController from '../controllers/quoteController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/v1/quotes - Yeni teklif talebi oluştur (Rate limited)
router.post('/', rateLimiter, quoteController.createQuoteRequest);

// GET /api/v1/quotes - Teklif taleplerini listele
router.get('/', quoteController.getAllQuoteRequests);

export default router;
