import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter, authRateLimiter, adminRateLimiter, publicApiRateLimiter } from './middleware/rateLimiter.js';
import articlesRoutes from './routes/articles.js';
import servicesRoutes from './routes/services.js';
import heroSectionsRoutes from './routes/heroSections.js';
import aboutSectionsRoutes from './routes/aboutSections.js';
import contactFormsRoutes from './routes/contactForms.js';
import quoteRoutes from './routes/quoteRoutes.js';
import categoriesRoutes from './routes/categories.js';
import pagesRoutes from './routes/pages.js';
import projectsRoutes from './routes/projects.js';
import projectImagesRoutes from './routes/projectImages.js';
import brandsRoutes from './routes/brands.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import sitemapRoutes from './routes/sitemap.js';
import settingsRoutes from './routes/settings.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını okuma - sadece backend klasöründeki .env
const backendEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: backendEnvPath });

// JWT_SECRET yoksa sunucu başlamasın (fail-fast)
if (!process.env.JWT_SECRET) {
  console.error('[SECURITY] FATAL: JWT_SECRET environment variable is not set!');
  console.error('[SECURITY] Set JWT_SECRET in backend/.env before starting the server.');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.APP_PORT || 3000;

// ── Helmet: HTTP güvenlik başlıkları ────────────────────────────────────────
// Quill editörü inline style ve image kullandığı için CSP gevşetildi.
// Production'da nonce tabanlı CSP'ye geçmeyi düşünün.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Quill için gerekli
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // uploads için gerekli
  })
);

// ── CORS ────────────────────────────────────────────────────────────────────
// Production'da CORS_ORIGIN env değişkeni ZORUNLU.
// Örnek: CORS_ORIGIN=https://nova-industrial.demo,https://www.nova-industrial.demo
const getCorsOrigins = (): string[] | boolean => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  }
  if (process.env.NODE_ENV !== 'production') {
    return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'];
  }
  // Production'da CORS_ORIGIN tanımsızsa → tüm originlere izin VERME, sunucuyu durdur
  console.error('[SECURITY] FATAL: CORS_ORIGIN must be set in production!');
  process.exit(1);
};

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static dosyalar (uploads) ────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health check (rate limit yok) ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Public settings (site offline kontrolü) ──────────────────────────────────
app.use('/api/v1/settings', settingsRoutes);

// ── Root route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(200).json({
      message: 'NOVA AGRO Backend API',
      version: '1.0.0',
      info: 'Bu bir backend API sunucusudur.',
      endpoints: { api: '/api/v1', health: '/health' },
    });
  } else {
    res.status(200).json({ message: 'NOVA AGRO Backend API', version: '1.0.0' });
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// ── Sitemap ──────────────────────────────────────────────────────────────────
app.use('/sitemap.xml', sitemapRoutes);

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRateLimiter, authRoutes);

// ── Admin ─────────────────────────────────────────────────────────────────────
app.use('/api/v1/admin', adminRateLimiter, adminRoutes);

// ── Upload ────────────────────────────────────────────────────────────────────
app.use('/api/v1/upload', uploadRoutes);

// ── Public API ────────────────────────────────────────────────────────────────
app.use('/api/v1/articles', publicApiRateLimiter, articlesRoutes);
app.use('/api/v1/services', publicApiRateLimiter, servicesRoutes);
app.use('/api/v1/hero-sections', publicApiRateLimiter, heroSectionsRoutes);
app.use('/api/v1/about-sections', publicApiRateLimiter, aboutSectionsRoutes);
app.use('/api/v1/categories', publicApiRateLimiter, categoriesRoutes);
app.use('/api/v1/pages', publicApiRateLimiter, pagesRoutes);
app.use('/api/v1/projects', publicApiRateLimiter, projectsRoutes);
app.use('/api/v1/brands', publicApiRateLimiter, brandsRoutes);
app.use('/api/v1', publicApiRateLimiter, projectImagesRoutes);

// ── Contact & Quote ───────────────────────────────────────────────────────────
app.use('/api/v1/contact-forms', rateLimiter, contactFormsRoutes);
app.use('/api/v1/quotes', rateLimiter, quoteRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api/v1`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
