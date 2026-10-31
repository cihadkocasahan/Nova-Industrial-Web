# NOVA INDUSTRIAL Backend

Express + TypeScript + MySQL + Drizzle ORM backend API.

## 🚀 Kurulum

### 1. Dependencies Yükle

```bash
npm install
```

### 2. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

**.env** dosyasını düzenleyin ve aşağıdaki ayarları yapın:

#### Zorunlu Ayarlar:
- **Database bilgileri**: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- **JWT Secret**: `JWT_SECRET` - Production'da mutlaka güçlü bir secret key kullanın (min 32 karakter)
- **CORS Origin**: `CORS_ORIGIN` - Frontend domain'lerinizi virgülle ayırarak ekleyin

#### Production Ayarları:
```env
NODE_ENV=production
CORS_ORIGIN=https://nova-industrial.demo,https://www.nova-industrial.demo
FRONTEND_URL=https://nova-industrial.demo
BASE_URL=https://nova-industrial.demo
AUTO_SEED=false
```

Detaylı bilgi için `ENV_SETUP.md` dosyasına bakın.

### 3. Database Kurulumu

MySQL veritabanı oluşturun:

```sql
CREATE DATABASE nova_industrial;
CREATE USER 'nova_industrial'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nova_industrial.* TO 'nova_industrial'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Database Migrations

```bash
npm run db:generate  # Migration dosyalarını oluştur
npm run db:migrate   # Migrations çalıştır
```

## 📦 Scripts

- `npm run dev` - Development server (hot reload)
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:generate` - Drizzle migration generate
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## 🌐 API Endpoints

### Articles
- `GET /api/v1/articles` - Tüm makaleler
- `GET /api/v1/articles/:id` - Tek makale
- `GET /api/v1/articles/slug/:slug` - Slug ile makale

### Services
- `GET /api/v1/services` - Tüm hizmetler

### Hero Sections
- `GET /api/v1/hero-sections` - Tüm hero sections
- `GET /api/v1/hero-sections/active` - Aktif hero section

### Contact Forms
- `POST /api/v1/contact-forms` - İletişim formu gönder

### Categories
- `GET /api/v1/categories` - Tüm kategoriler
- `GET /api/v1/categories/:id` - Tek kategori

### Pages
- `GET /api/v1/pages` - Tüm sayfalar
- `GET /api/v1/pages/:id` - Tek sayfa
- `GET /api/v1/pages/slug/:slug` - Slug ile sayfa

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── db/
│   │   ├── schema.ts          # Database schema
│   │   ├── connection.ts     # Database connection
│   │   └── migrate.ts         # Migration runner
│   ├── routes/
│   │   ├── articles.ts
│   │   ├── services.ts
│   │   ├── heroSections.ts
│   │   ├── contactForms.ts
│   │   ├── categories.ts
│   │   └── pages.ts
│   ├── controllers/
│   │   ├── articleController.ts
│   │   ├── serviceController.ts
│   │   ├── heroController.ts
│   │   ├── contactController.ts
│   │   ├── categoryController.ts
│   │   └── pageController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   └── server.ts              # Express app entry point
├── drizzle/                    # Migration files
├── package.json
├── tsconfig.json
└── drizzle.config.ts
```

## 🔧 Teknoloji Stack

- **Express**: 5.0.1
- **TypeScript**: 5.5.2
- **Drizzle ORM**: 0.35.0
- **MySQL**: 8.0 (mysql2)
- **Zod**: Validation
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

## 📝 Notlar

- TypeScript strict mode aktif
- ES Modules kullanılıyor
- Drizzle ORM ile type-safe queries
- Zod ile input validation
- Rate limiting aktif

---

**Backend hazır! 🚀**

