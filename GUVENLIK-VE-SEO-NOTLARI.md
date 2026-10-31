# Güvenlik ve SEO Notları

> Bu dosya, root klasördeki git loglarından çıkarılan güvenlik ve SEO iyileştirmeleri hakkında bilgiler içerir.

## 📋 Git Commit'leri

### 1. Commit: ed267d1
**Başlık:** SEO optimizasyonları, güvenlik iyileştirmeleri ve Docker yapılandırmaları eklendi

**Değişiklikler:**
- `SECURITY.md` - Güvenlik dokümantasyonu eklendi (112 satır)
- `DOCKER.md` - Docker dokümantasyonu eklendi (250 satır)
- `frontend/SEO.md` - SEO dokümantasyonu eklendi (193 satır)
- `backend/src/middleware/rateLimiter.ts` - Rate limiting iyileştirmeleri
- `backend/src/middleware/auth.ts` - Authentication iyileştirmeleri
- `backend/src/middleware/validator.ts` - Validator middleware eklendi (67 satır)
- `backend/src/controllers/sitemapController.ts` - Sitemap controller iyileştirmeleri (140 satır)
- `backend/src/routes/auth.ts` - Auth routes iyileştirmeleri
- `backend/src/server.ts` - Server yapılandırması iyileştirmeleri
- `frontend/src/pages/Home.tsx` - SEO meta tags iyileştirmeleri
- `frontend/src/components/Footer.tsx` - Footer SEO iyileştirmeleri (190 satır)
- `frontend/public/robots.txt` - Robots.txt güncellendi
- Docker yapılandırmaları (production Dockerfile'ları, docker-compose dosyaları)
- Nginx yapılandırmaları

**Toplam:** 21 dosya değiştirildi, 1390 satır eklendi, 74 satır silindi

### 2. Commit: 3dd9764
**Başlık:** feat: SEO, güvenlik ve hata sayfaları iyileştirmeleri

**Değişiklikler:**
- `backend/src/server.ts` - Server güvenlik iyileştirmeleri (17 satır)
- `frontend/src/App.tsx` - Error handling iyileştirmeleri
- `frontend/src/pages/Error.tsx` - Hata sayfası eklendi (139 satır)
- `frontend/src/pages/NotFound.tsx` - 404 sayfası eklendi (184 satır)
- `frontend/src/pages/Home.tsx` - SEO iyileştirmeleri (51 satır)
- `backend/package.json` - Bağımlılık güncellemeleri

**Toplam:** 6 dosya değiştirildi, 404 satır eklendi, 1 satır silindi

---

## 🔒 Mevcut Güvenlik Özellikleri

### Rate Limiting
**Dosya:** `backend/src/middleware/rateLimiter.ts`

1. **General Rate Limiter**
   - Limit: 100 istek / 15 dakika
   - Standart headers: Aktif
   - Legacy headers: Kapalı

2. **Auth Rate Limiter**
   - Limit: 10 login denemesi / 15 dakika
   - Başarılı istekler sayılmaz
   - Standart headers: Aktif

3. **Admin Rate Limiter**
   - Limit: 10000 istek / 1 dakika
   - Başarılı istekler sayılmaz
   - Başarısız istekler sayılır
   - Standart headers: Aktif

4. **Public API Rate Limiter**
   - Limit: 500 istek / 15 dakika
   - Başarılı istekler sayılmaz
   - Standart headers: Aktif

### CORS (Cross-Origin Resource Sharing)
**Dosya:** `backend/src/server.ts`

- Origin: `process.env.CORS_ORIGIN` (environment variable'dan)
- Default: `['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001']`
- Credentials: Aktif

### Security Headers (.htaccess)
**Dosya:** `public_html-htaccess-fix.txt`

```apache
# Security Headers
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

### Authentication
- **JWT (JSON Web Token)** kullanılıyor
- Token süresi: `JWT_EXPIRES_IN` environment variable (default: 7d)
- Secret: `JWT_SECRET` environment variable
- Dosya: `backend/src/routes/auth.ts`

### Error Handler
- Merkezi hata yönetimi
- Dosya: `backend/src/middleware/errorHandler.ts`

---

## 📈 Mevcut SEO Özellikleri

### Sitemap.xml
**Dosya:** `backend/src/controllers/sitemapController.ts`

- Dinamik sitemap oluşturma
- Kategoriler, projeler ve sayfalar dahil
- Güncellenme tarihleri (lastmod)
- Change frequency ve priority ayarları

### SEO Keywords Yönetimi
- Admin panelde SEO anahtar kelimeleri yönetimi
- Her sayfa/kategori/proje için özel keywords
- Default SEO keywords: `backend/src/utils/defaultSeoKeywords.ts`

### Meta Tags
**Dosya:** `frontend/src/pages/Home.tsx`

- Title tag
- Description meta tag
- Keywords meta tag
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags (twitter:card, twitter:title, twitter:description)

### Robots.txt
**Dosya:** `frontend/public/robots.txt`

- Arama motoru tarayıcıları için kurallar
- Sitemap referansı

### Structured Data
- Footer'da schema.org markup
- Semantic HTML5 elementleri

---

## 📚 Dokümantasyon Dosyaları

Root klasörde şu dokümantasyon dosyaları bulunuyor:

1. **SECURITY.md** (112 satır)
   - Güvenlik best practices
   - Güvenlik açıkları ve önlemler
   - Rate limiting detayları
   - Authentication detayları

2. **frontend/SEO.md** (193 satır)
   - SEO best practices
   - Meta tags kullanımı
   - Sitemap yapılandırması
   - Structured data

3. **DOCKER.md** (250 satır)
   - Docker yapılandırması
   - Production deployment
   - Security considerations

---

## ⚠️ Önemli Notlar

1. **Environment Variables:**
   - `JWT_SECRET` - Güvenlik için güçlü bir secret kullanılmalı
   - `JWT_EXPIRES_IN` - Token süresi ayarı
   - `CORS_ORIGIN` - İzin verilen origin'ler

2. **Rate Limiting:**
   - Production'da rate limiting aktif olmalı
   - Admin panel için yüksek limitler ayarlanmış (10000 req/min)
   - Public API için daha yüksek limit (500 req/15min)

3. **Security Headers:**
   - `.htaccess` dosyasında security headers ayarlanmalı
   - Apache mod_headers modülü gerekli

4. **SEO:**
   - Sitemap.xml düzenli güncellenmeli
   - Meta tags her sayfa için özelleştirilmeli
   - robots.txt doğru yapılandırılmalı

---

## 🔗 İlgili Dosyalar

### Backend
- `backend/src/middleware/rateLimiter.ts` - Rate limiting
- `backend/src/middleware/auth.ts` - Authentication
- `backend/src/middleware/errorHandler.ts` - Error handling
- `backend/src/controllers/sitemapController.ts` - Sitemap
- `backend/src/routes/auth.ts` - Auth routes
- `backend/src/server.ts` - Server yapılandırması

### Frontend
- `frontend/src/pages/Home.tsx` - SEO meta tags
- `frontend/src/components/Footer.tsx` - Footer SEO
- `frontend/public/robots.txt` - Robots.txt

### Configuration
- `public_html-htaccess-fix.txt` - Security headers
- `.env` - Environment variables

---

---

## 🎠 Hero Section / Slider Özellikleri

### Git Commit: ab238d7
**Başlık:** feat: Hero sections slider yönetimi ve DB entegrasyonu

**Açıklama:** Ana sayfada gösterilen hero section slider'ı için tam bir yönetim sistemi ve veritabanı entegrasyonu eklendi.

---

## 📋 Slider Özellikleri

### Veritabanı Şeması
**Dosya:** `backend/src/db/schema.ts`

**Hero Sections Tablosu:**
```typescript
heroSections = mysqlTable('hero_sections', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 255 }),
  backgroundImage: varchar('background_image', { length: 500 }),
  active: boolean('active').default(false),
  order: int('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})
```

**Özellikler:**
- **Title**: Zorunlu, slider başlığı
- **Subtitle**: Opsiyonel, alt başlık/açıklama
- **CTA (Call to Action)**: Button metni ve link
- **Background Image**: Slider arka plan resmi
- **Active**: Aktif/pasif durumu
- **Order**: Sıralama (order field'a göre sıralama)

### Backend API

**Dosya:** `backend/src/routes/heroSections.ts`

**Public Endpoints:**
- `GET /api/v1/hero-sections` - Tüm hero section'ları getir (order'a göre sıralı)
- `GET /api/v1/hero-sections/active/all` - Aktif hero section'ları getir (slider için)
- `GET /api/v1/hero-sections/active` - Tek aktif hero section getir

**Admin Endpoints:**
- `GET /api/v1/admin/hero-sections` - Tüm hero section'ları getir (admin)
- `GET /api/v1/admin/hero-sections/:id` - ID'ye göre hero section getir
- `POST /api/v1/admin/hero-sections` - Yeni hero section oluştur
- `PUT /api/v1/admin/hero-sections/:id` - Hero section güncelle
- `DELETE /api/v1/admin/hero-sections/:id` - Hero section sil

**Controllers:**
- `backend/src/controllers/heroController.ts` - Public controller
- `backend/src/controllers/adminHeroController.ts` - Admin controller

**Özellikler:**
- Aktif hero section seçildiğinde, diğer hero section'lar otomatik pasif yapılır
- Order field'a göre otomatik sıralama
- Rate limiting: Public API rate limiter (500 req/15min)

### Frontend Component

**Dosya:** `frontend/src/components/HeroSection.tsx`

**Özellikler:**
- **Auto-slide**: 5 saniyede bir otomatik slide değişimi
- **Manual Navigation**: Önceki/Sonraki butonları
- **Slide Indicators**: Aktif slide göstergesi (dot'lar)
- **Responsive**: Mobil uyumlu
- **Default Fallback**: API'den veri gelmezse varsayılan içerik gösterilir

**Slider Davranışı:**
- Tek slide varsa: Auto-slide kapalı
- Birden fazla slide varsa: Auto-slide aktif (5 saniye)
- Kullanıcı manuel navigasyon yaparsa: Auto-slide devam eder
- Smooth transition animasyonu (0.6s ease-in-out)

**Styling:**
- CSS: `frontend/src/styles/design-system.css` (HERO SECTION bölümü)
- Responsive breakpoint: 768px altında farklı boyutlar
- Material Icons kullanılıyor (chevron_left, chevron_right)

### Admin Panel

**Dosya:** `frontend/src/pages/admin/HeroSections.tsx`

**Özellikler:**
- **Liste Görünümü**: Tüm hero section'ları listeleme
- **Oluşturma**: Yeni hero section ekleme (modal form)
- **Düzenleme**: Mevcut hero section'ı düzenleme
- **Silme**: Hero section silme (onay modal'ı ile)
- **Aktif/Pasif Toggle**: Aktif durumu değiştirme
- **Sıralama**: Order field ile sıralama yönetimi
- **Önizleme**: Background image önizleme

**Form Alanları:**
- Title (Zorunlu)
- Subtitle (Opsiyonel)
- CTA Text (Opsiyonel)
- CTA Link (Opsiyonel)
- Background Image URL (Opsiyonel)
- Active (Checkbox)
- Order (Number, otomatik artar)

**Validasyon:**
- Title zorunlu alan
- Background Image URL formatı kontrol edilir
- Order sayısal değer olmalı

### Kullanım Senaryoları

1. **Tek Slider:**
   - Bir hero section oluşturulur ve active=true yapılır
   - Frontend'de tek slide gösterilir, auto-slide kapalı

2. **Çoklu Slider:**
   - Birden fazla hero section oluşturulur ve active=true yapılır
   - Frontend'de slider olarak gösterilir, auto-slide aktif
   - Order field'a göre sıralama yapılır

3. **Hiç Slider Yok:**
   - Frontend'de varsayılan içerik gösterilir
   - Default hero card kullanılır

### İlgili Dosyalar

**Backend:**
- `backend/src/db/schema.ts` - Hero sections tablo şeması
- `backend/src/controllers/heroController.ts` - Public controller
- `backend/src/controllers/adminHeroController.ts` - Admin controller
- `backend/src/routes/heroSections.ts` - Public routes
- `backend/src/routes/admin.ts` - Admin routes (hero sections dahil)
- `backend/src/server.ts` - Route registration

**Frontend:**
- `frontend/src/components/HeroSection.tsx` - Hero slider component
- `frontend/src/pages/admin/HeroSections.tsx` - Admin panel sayfası
- `frontend/src/services/api.ts` - Public API fonksiyonları
- `frontend/src/services/adminApi.ts` - Admin API fonksiyonları
- `frontend/src/types/index.ts` - TypeScript type tanımları
- `frontend/src/pages/Home.tsx` - Ana sayfa (HeroSection kullanımı)
- `frontend/src/styles/design-system.css` - CSS stilleri

**Seed Data:**
- `backend/src/scripts/seed-unified.ts` - Hero sections seed data

---

## 📝 Son Güncelleme

Bu notlar, git loglarından çıkarılan bilgilere dayanarak oluşturulmuştur.

**Son commit'ler:**
- ed267d1 - SEO optimizasyonları, güvenlik iyileştirmeleri ve Docker yapılandırmaları
- 3dd9764 - feat: SEO, güvenlik ve hata sayfaları iyileştirmeleri
- ab238d7 - feat: Hero sections slider yönetimi ve DB entegrasyonu

**Oluşturulma Tarihi:** 2025-01-XX

