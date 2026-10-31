---
name: nova-security-ux
description: >
  Nova Industrial Web projesine özel güvenlik (Security) ve UX denetim kuralları.
  Stack: React 18 + TypeScript + Vite (frontend) | Express 5 + Drizzle ORM + MySQL + JWT (backend).
  Bu skill aktif olduğunda güvenlik açıklarını, UX sorunlarını ve best-practice ihlallerini
  proaktif olarak tespit et ve çöz. Genel öneriler değil, bu projenin gerçek koduna dayalı
  somut düzeltmeler üret.
---

# Nova Industrial Web — Security & UX Skill

> Bu skill yalnızca `D:\projects\Nova-Industrial-Web` workspace'inde aktiftir.
> Her kod değişikliğinde, incelemede veya "security/güvenlik" ve "ux/arayüz" ile ilgili
> isteklerde bu kuralları ZORUNLU olarak uygula.

---

## 1. STACK CONTEXT

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite 5, react-router-dom v6 |
| HTTP İstemcisi | Axios (adminApi + publicApi) |
| Auth (FE) | JWT — **localStorage** (`admin_token`, `admin_user`) |
| i18n | i18next + react-i18next (TR/EN) |
| Rich Text | Quill / react-quill |
| Backend | Express 5, TypeScript, tsx watch |
| ORM | Drizzle ORM + mysql2 |
| Doğrulama | Zod |
| Auth (BE) | jsonwebtoken (bcryptjs ile hash) |
| Upload | multer |
| E-posta | nodemailer |
| Rate Limiting | express-rate-limit |
| Dokümantasyon | swagger-jsdoc + swagger-ui-express |

---

## 2. KRİTİK GÜVENLİK KURALLARI (Backend)

### 2.1 JWT & Secret Yönetimi
- `JWT_SECRET` **asla** fallback değer içermemeli. `process.env.JWT_SECRET || 'your-secret-key-...'` paterni YASAK.
  - Düzeltme: `if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is required')` şeklinde başlangıçta fail-fast yap.
- Token süresi `7d` üst limit. `1h` veya `2h` + refresh-token akışı tercih et.
- JWT payload'ına hassas veri (şifre, role dışı veri) koyma.

### 2.2 Token Depolama (Frontend) — localStorage → httpOnly Cookie
- `localStorage.getItem('admin_token')` **XSS saldırısına tamamen açık**. 
- Hedef mimari: Backend `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict` header döndürmeli.
- Frontend `adminApi` interceptor'daki `Authorization: Bearer` header'ını kaldır; cookie otomatik gönderilecek.
- Bu geçiş yapılana kadar kod üretirken `localStorage` token kullanımını yeni endpoint'lere ekleme.

### 2.3 Demo Bypass Mekanizması — ÜRETİMDE YASAK
- `adminApi.ts` içindeki `demo-mock-jwt-token-nova-agro-2026` ve `isDemo` bloğu production build'e girmemeli.
- Yöntem: `import.meta.env.VITE_ENABLE_DEMO === 'true'` flag ile guard et; production `.env`'de bu değişken OLMAMALI.

### 2.4 CORS
- Backend'de `cors({ origin: '*' })` veya origin kontrolsüz CORS YASAK.
- İzin verilen originler whitelist olarak `ALLOWED_ORIGINS` env'den okunmalı.
- Düzeltme şablonu:
  ```ts
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'],
    credentials: true,
  })
  ```

### 2.5 HTTP Security Headers (Helmet eksik!)
- Projede `helmet` paketi YOK. Her backend endpoint'inde CSP, X-Frame-Options, HSTS eksik.
- Acil: `npm install helmet` → `app.use(helmet())` + özelleştirilmiş CSP (Quill editor için `unsafe-inline` gerekebilir; `nonce` tabanlı tercih et).

### 2.6 Input Doğrulama
- Zod zaten mevcut; her Express route handler'da `req.body` için Zod şeması ZORUNLU.
- `req.query` ve `req.params` de Zod ile doğrula; tip dönüşümleri (`z.coerce.number()`) kullan.
- multer ile dosya yükleme: MIME tipi + boyut sınırı her zaman belirt.
  ```ts
  const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      cb(null, allowed.includes(file.mimetype));
    },
  });
  ```

### 2.7 SQL Injection
- Drizzle ORM parametreli sorgu kullanır; ham string `sql` template literal YASAK (güvenli kullanım: `sql`SELECT ...`` sadece Drizzle'ın `sql` tagged template ile).
- `eq()`, `and()`, `like()` gibi Drizzle builder metodlarını kullan.

### 2.8 Rate Limiting
- `express-rate-limit` mevcut; `/auth/login` endpoint'i için özel ve daha sıkı limit uygula:
  ```ts
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
  router.post('/login', loginLimiter, handler);
  ```
- Admin CRUD endpoint'leri için genel limiter ayrıca tanımla.

### 2.9 Error Handling — Bilgi Sızdırma
- `console.error(error)` + `res.status(500).json({ error: 'Login işlemi başarısız' })` production'da stack trace, DB detayı sızdırmamalı.
- Global error middleware ekle; tüm `catch` bloklarından oraya yönlendir.
- Geliştirme ortamında detaylı hata, production'da jenerik mesaj.

---

## 3. FRONTEND GÜVENLİK KURALLARI

### 3.1 XSS — Quill / dangerouslySetInnerHTML
- Quill ile üretilen HTML'yi DOM'a basmadan önce **DOMPurify** ile sanitize et:
  ```tsx
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```
- `react-quill` çıktısını doğrudan `dangerouslySetInnerHTML`'e verme.

### 3.2 Route Guard
- Admin sayfaları `PrivateRoute` veya `<Navigate>` ile korunmalı; token kontrolü sadece localStorage değil, `/auth/me` endpoint'i ile sunucu tarafında da doğrulanmalı.
- Token yoksa `/admin/login`'e redirect et, uygulama state'ini temizle.

### 3.3 CSRF
- Cookie tabanlı auth'a geçilince CSRF koruması da gerekir. Backend: `csurf` (deprecated) yerine Double-Submit Cookie veya `SameSite=Strict` yeterlidir.

### 3.4 Axios Güvenliği
- `timeout: 5000` iyi; üretimde 10s'ye çıkarmayı değerlendir.
- Axios interceptor'da `error.response?.data?.message` gibi backend mesajlarını doğrudan UI'a yansıtma (bilgi sızdırma).

---

## 4. UX KURALLARI (Nova Industrial Web için)

### 4.1 Loading & Skeleton States
- Her async işlem için `Loading.tsx` bileşeni ZORUNLU. Sayfa geçişlerinde `<Suspense>` + skeleton kullan.
- Form submit sırasında butonu `disabled` + loading spinner göster; kullanıcı çift tıklamayı önle.

### 4.2 Hata Mesajları
- Backend'den gelen `error` string'lerini Türkçe/İngilizce (i18n key) olarak dönüştür; ham API mesajı kullanıcıya gösterme.
- `ErrorModal.tsx` ve `Toast.tsx` mevcut — bunları tutarlı biçimde kullan; `alert()` YASAK.

### 4.3 Form UX
- Validation anında (onBlur) + submit öncesi (onSubmit) olmak üzere iki aşamalı.
- Zod şemaları (`zod + react-hook-form` veya manuel) frontend'de de kullan; backend'e güvenme.
- Required field'lar için `aria-required="true"` + `aria-describedby` ile hata mesajı ilişkilendir.

### 4.4 i18n Tutarlılığı
- TR/EN tüm UI metinleri `en.json` ve `tr.json`'da key-value olarak tutulmalı; hardcoded Türkçe/İngilizce string YASAK.
- Dinamik içerik (blog, ürün) için i18n gerekmez; sistem mesajları, buton etiketleri ZORUNLU.

### 4.5 Admin Panel UX
- CRUD işlemlerinde `ConfirmModal.tsx` ile onay iste (özellikle sil işlemlerinde).
- Başarılı işlem → `Toast.tsx` (success), hata → `Toast.tsx` (error) + `ErrorModal.tsx` (kritik).
- Tablo/liste sayfalarında skeleton loader + empty state tasarımı olmalı.

### 4.6 Erişilebilirlik (a11y)
- `<img>` etiketlerinde `alt` zorunlu; dekoratif görseller için `alt=""`.
- Tüm interaktif elementler klavye ile erişilebilir olmalı (`tab`, `enter`, `esc`).
- Renk kontrast oranı WCAG AA: normal metin ≥ 4.5:1.
- Modal açıldığında focus trap + `aria-modal="true"`.

### 4.7 Performans / Core Web Vitals
- Resimler `loading="lazy"` + WebP formatı tercih et.
- `ImageCarousel.tsx` / `ImageSlider.tsx` — lazy load + responsive `srcset`.
- Route-level code splitting:
  ```tsx
  const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
  ```
- Quill editörünü dinamik import et (büyük bundle).

### 4.8 SEO (react-helmet-async mevcut)
- Her sayfa için `<Helmet>` ile `title`, `meta description`, `og:title`, `og:image` doldur.
- `ProjectDetail`, `CategoryDetail` gibi dinamik sayfalar slug-based URL + canonical tag içermeli.

---

## 5. KOD ÜRETİM İLKELERİ (Bu Proje İçin)

1. **Yeni route/endpoint eklerken:** Zod validation + auth middleware + rate limiter üçlüsü ZORUNLU.
2. **Yeni admin sayfası eklerken:** PrivateRoute guard + loading state + hata yönetimi + i18n key'leri birlikte ekle.
3. **Dosya yükleme:** multer config'i her zaman limit + filetype filter ile yaz.
4. **Mock fallback pattern:** `catch` bloğunda mock data dön; ancak `console.warn('[MOCK]', ...)` ile işaretle.
5. **Env değişkenleri:** Backend için `src/config/env.ts` dosyasında merkezi validation (Zod + `process.env`) kullan. Frontend için `import.meta.env.VITE_*` sadece public değerler.
6. **Drizzle şema değişikliği:** Önce migration generate et (`db:generate`), sonra migrate et (`db:migrate`). Ham SQL çalıştırma.
7. **TypeScript:** `any` kullanımı YASAK. Bilinmeyen tip için `unknown` + type guard kullan.

---

## 6. ACİL EYLEM LİSTESİ (Öncelik Sırası)

> Bu listeyi kullanıcı "neyi düzeltelim" dediğinde referans al:

| # | Sorun | Risk | Dosya |
|---|-------|------|-------|
| 1 | JWT_SECRET hardcoded fallback | 🔴 Kritik | `backend/src/middleware/auth.ts`, `routes/auth.ts` |
| 2 | Token localStorage'da (XSS) | 🔴 Kritik | `frontend/src/services/adminApi.ts` |
| 3 | Helmet eksik (HTTP headers yok) | 🔴 Kritik | `backend/src/server.ts` |
| 4 | Demo bypass production'da aktif | 🟠 Yüksek | `frontend/src/services/adminApi.ts` |
| 5 | CORS origin kontrolsüz | 🟠 Yüksek | `backend/src/server.ts` |
| 6 | Quill çıktısı sanitize edilmiyor | 🟠 Yüksek | Quill kullanan tüm componentler |
| 7 | Login endpoint'i güçlü rate-limit yok | 🟡 Orta | `backend/src/routes/auth.ts` |
| 8 | Global error middleware yok | 🟡 Orta | `backend/src/server.ts` |
| 9 | Frontend Zod validation yok | 🟡 Orta | Admin form bileşenleri |
| 10 | Route-level code splitting yok | 🟢 Düşük | `frontend/src/App.tsx` |
