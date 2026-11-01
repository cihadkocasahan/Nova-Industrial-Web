# Nova Industrial Web — Kurumsal Web Sitesi & İçerik Yönetim Platformu

**Nova Industrial Web**, bir şirketin tüm dijital varlığını — web sitesi, içerik yönetimi, lead toplama ve yönetim paneli — tek çatı altında toplayan **full-stack CMS platformudur**.

Demo domain olarak **AgTech / Ziraat Mühendisliği** sektörü seçilmiştir; ancak mimari her sektöre uyarlanabilir kurumsal web + içerik yönetimi altyapısıdır. Backend kapalıyken bile çalışan **mock fallback katmanı**, Quill tabanlı zengin metin editörü, JWT korumalı admin paneli ve Docker orkestrasyonu bir arada sunulmaktadır.

> [!IMPORTANT]
> **Portfolyo & Demo Amaçlı Proje:** Bu yazılım ve kaynak kodları; modern full-stack web mimarisini (React + Express + Drizzle ORM + MySQL), CMS tasarım pratiklerini ve Docker ile üretim ortamı orkestrasyonunu göstermek amacıyla **portfolyo ve referans projesi** olarak hazırlanmıştır.
>
> **Sorumluluk Reddi (Disclaimer):** Yazılım herhangi bir açık veya zımni garanti verilmeksizin **"olduğu gibi" (AS-IS)** sunulmaktadır. Geliştirici; sistemin kullanımından doğabilecek doğrudan veya dolaylı hiçbir zarardan sorumlu tutulamaz.

[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-Runner%20Ready-15803d?style=for-the-badge&logo=checkmarx&logoColor=white)](#-e2e-test-altyapısı)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22%20LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.30-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)

---

## 🖼️ Ekran Görüntüleri & Görsel Vitrin

### 1. Masaüstü Ana Sayfa & Hero Slider
*Admin panelinden yönetilebilen hero section slider, hizmet kartları ve CTA butonları.*
![Ana Sayfa Hero](docs/screenshots/desktop-fold.jpg)

<br>

### 2. İçerik Sayfaları — Hizmetler, Kategoriler & Projeler
*CMS'ten beslenen dinamik hizmet kartları, kategori detay sayfaları ve proje portföyü.*
![Hizmetler ve Projeler](docs/screenshots/desktop-page-01.jpg)

<br>

### 3. Yönetim Paneli (Kokpit Dashboard)
*Canlı içerik istatistikleri; makale, hizmet, proje, teklif ve hero section'ları kod yazmadan yönet.*
![Kokpit Dashboard](docs/screenshots/dashboard.jpg)

<br>

### 4. Demo Giriş & Mock Fallback
*Backend kapalıyken bile çalışan mock katmanı; tek tıkla otomatik form doldurma ile sıfır sürtünmeli demo deneyimi.*
![Kokpit Giriş](docs/screenshots/admin-login.jpg)

<br>

### 5. Mobil & Tablet Uyumluluğu

<div align="center">
  <img src="docs/screenshots/mobile-fold.jpg" width="340" alt="Mobil Görünüm" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/tablet-fold.jpg" width="460" alt="Tablet Görünüm" />
</div>

---

## 🚀 Hızlı Başlangıç (Quick Start)

### Seçenek A: 🐳 Docker Compose ile Tek Komutta Başlatma (Full Stack)

```bash
docker compose up --build -d
```

| Servis | URL | Açıklama |
|---|---|---|
| **Frontend** | [http://localhost:8080](http://localhost:8080) | Nginx SPA + API Reverse Proxy |
| **Yönetim Paneli** | [http://localhost:8080/kokpit](http://localhost:8080/kokpit) | `/kokpit`, `/agro-kokpit` ve `/admin` rotaları |
| **Backend REST API** | [http://localhost:3000](http://localhost:3000) | Express 5 TypeScript API (`/api/v1/*`) |
| **MySQL** | `localhost:3306` | UTF-8mb4 destekli MySQL 8 |

### Seçenek B: 🧪 Bağımsız Önizleme Modu (Sıfır Bağımlılık)

Veritabanı veya Docker gerektirmeden frontend'i mock verilerle çalıştır:

```bash
cd frontend
npm install
npm run build
npm run preview
# http://localhost:8080
```

### 🔑 Demo Giriş Bilgileri

- **E-posta:** `admin@nova-agro.demo`
- **Şifre:** `DemoAdmin2026!`
- *(Giriş sayfasındaki **"Formu Demo Bilgileriyle Doldur"** butonu tek tıkla oturum açar.)*

---

## 🏗️ Mimari & Teknoloji Yığını

```
                    ┌─────────────────────────────────┐
                    │     REACT 18 CLIENT (Vite)      │
                    │  TypeScript · i18n (TR/EN)      │
                    └──────────────┬──────────────────┘
                                   │
           ┌───────────────────────┴───────────────────────┐
           │                                               │
   [Mock Modu — Offline]                         [Canlı API Modu]
           │                                               │
  ┌────────▼────────┐                        ┌────────────▼────────────┐
  │  mockData.ts    │                        │  Express 5 REST API     │
  │  (Fallback DB)  │                        │  (Node.js 22 LTS)       │
  └─────────────────┘                        └────────────┬────────────┘
                                                          │
                                             ┌────────────▼────────────┐
                                             │  Drizzle ORM + MySQL 8  │
                                             └─────────────────────────┘
```

### 🎨 Frontend
- **Framework & Araçlar:** React 18, TypeScript 5, Vite 5, React Router v6, i18next (TR/EN).
- **Tasarım Sistemi:** 247 ödüllü siteden damıtılmış **Anti-Slop design-taste-frontend** skill'i ile merkezi CSS token'ları. Ortalanmış 3 satır başlık + simetrik ikon kartı klişeleri yerine; editoryal asimetri, 60-30-10 renk kuralı (botanik koyu yeşil `#15803d` / nötr slate / açık krem zemin) ve içerikten gelen konsept. Sektör veya marka değiştiğinde sadece token dosyasını güncellemek yeterlidir.
- **İçerik Özelleştirme:** Hero slider, hizmet kartları, proje portföyü, partner logoları ve footer bilgileri tamamen admin panelinden yönetilir — kod değişikliği gerekmez.
- **Güvenlik:** Backend Helmet CSP ile Quill inline style'larına izin veren yönetilmiş içerik güvenliği politikası; JWT + Bcrypt parola şifreleme.

### ⚙️ Backend & Veri Katmanı
- **API Mimarisi:** Express 5 + TypeScript + ESM modül sistemi.
- **ORM & Veritabanı:** Drizzle ORM + MySQL 8 — type-safe şema, otomatik migration ve seed mekanizması.
- **Güvenlik:** Helmet HTTP başlıkları (yönetilmiş CSP), Express Rate Limiter (3 kademeli), CORS yapılandırması (production'da zorunlu origin).
- **Kimlik Doğrulama:** JWT + Bcrypt parola şifreleme; `JWT_SECRET` olmadan sunucu başlamaz (fail-fast).
- **SEO:** Dinamik `sitemap.xml` controller, `robots.txt`, Helmet CSP.

---

## 🌟 Platform Özellikleri

### 1. 🎛️ Tam Donanımlı Yönetim Paneli (Kokpit)

Şirketin tüm web içeriğini kod yazmadan yönetebileceği admin arayüzü:

- **Hero Section Yönetimi:** Slider içeriklerini, görsellerini ve CTA butonlarını ekle, düzenle, sırala. Çoklu aktif slide ve otomatik sıralama desteği.
- **Hizmet & Kategori Yönetimi:** Hizmet kartlarını, açıklamalarını ve görsellerini CRUD ile yönet.
- **Proje Portföyü:** Proje detay sayfaları, görseller ve etiketler; ziyaretçiler için filtrelenebilir galeri.
- **Blog / Makale Editörü:** Quill tabanlı zengin metin editörü ile makale oluşturma ve yayınlama.
- **Marka & Partner Logoları:** Logolar yükle, sırala, aktif/pasif yap.
- **İletişim Formu Yönetimi:** Ziyaretçi gönderimlerini admin panelinde görüntüle.
- **SEO Anahtar Kelimeleri:** Sayfa, kategori ve proje bazında özel meta keywords yönetimi.
- **Özel Rota Desteği:** `/admin`, `/kokpit` ve `/agro-kokpit` rotalarının tamamı çalışır; sidebar prefix'ini koruyan akıllı yönlendirme.

### 2. 🔌 Mock Fallback Katmanı (Offline-First Demo)

- Backend veya veritabanı kapalıyken frontend tam işlevsellikle çalışmaya devam eder.
- `api.ts` içindeki şeffaf fallback: istek başarısız olursa `mockData.ts`'e düşer, kullanıcı kesinti yaşamaz.
- Portfolyo sunumlarında ve demo ortamlarında sıfır bağımlılıkla canlı önizleme.

### 3. 📋 Teklif / Lead Toplama Motoru (`QuoteModal`)

- Her hizmet kartından bağımsız olarak açılan, hizmeti otomatik önseçen modal form.
- İletişim sayfasından decouple edilmiş mimari — `#contact` anchor'a bağımlı değil.
- Benzersiz referans kodu üretimi, yüksek hacimde idempotent çalışma.

### 4. 🌐 TR/EN Çoklu Dil Desteği

- Sistem mesajları, buton etiketleri ve UI metinleri `i18next` + `react-i18next` ile yönetilir.
- Tarayıcı dil algılama; ek dil eklemeye hazır altyapı.

### 5. 🗺️ Dinamik Sitemap & SEO Altyapısı

- Veritabanından beslenen dinamik `sitemap.xml` üretimi (`sitemapController`).
- `robots.txt` ve arama motoru dostu URL yapısı.
- Hero, hizmet ve proje sayfaları için slug tabanlı temiz URL mimarisi.

---

## 🧪 E2E Test Altyapısı

Proje, 4 kademeli bağımsız E2E test runner altyapısına sahiptir (`tests/e2e/runner.js`). Test runner; sıfır harici bağımlılık, standart Node.js ile çalışır:

```bash
npm test
# veya kademe bazında:
node tests/e2e/runner.js --tier=1
```

| Kademe | Kapsam |
|---|---|
| **Tier 1** | Özellik Kapsamı & Smoke Test |
| **Tier 2** | Sınır Durumları & Köşe Senaryoları |
| **Tier 3** | Çapraz Etkileşim & Entegrasyon |
| **Tier 4** | Gerçek Dünya Senaryoları & Regresyon |

> [!NOTE]
> Test runner altyapısı (`runner.js` + `helpers/test-utils.js`) mevcuttur; tier bazlı test senaryoları portfolyo geliştirme sürecinde yazılmıştır.

---

## 📂 Dizin Yapısı

```
Nova-Industrial-Web/
├── backend/
│   ├── src/
│   │   ├── controllers/      # REST API kontrolcüleri
│   │   ├── db/               # Drizzle ORM şeması ve migration
│   │   ├── middleware/       # Auth, rate-limiter, sanitization, validator
│   │   ├── routes/           # Express rota tanımları
│   │   └── scripts/          # seed-unified.ts (demo veri tohumlama)
│   ├── Dockerfile            # Multi-stage Node.js container
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── brands/           # Partner / marka logoları (SVG)
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/       # Header, HeroSection, ServiceCards, QuoteModal vb.
│   │   ├── pages/            # Home, CategoryDetail, ProjectDetail, Admin sayfaları
│   │   ├── services/         # api.ts & adminApi.ts (mock fallback destekli)
│   │   ├── styles/           # design-system.css (CSS token sistemi)
│   │   └── types/            # TypeScript model tanımları
│   ├── nginx.conf            # SPA yönlendirmeli Nginx Alpine yapılandırması
│   └── Dockerfile
│
├── docs/screenshots/         # README ekran görüntüleri
├── tests/e2e/                # 4 kademeli E2E test runner
├── docker-compose.yml        # Full-stack Docker orkestrasyonu
└── README.md
```

---

## 🎯 Proje Hakkında & Geliştirme Notu

Bu proje; modern full-stack web mimarisini (React 18, Express 5, Drizzle ORM, MySQL 8, Docker), CMS tasarım pratiklerini ve yapay zeka destekli geliştirme yetkinliklerini somut bir örnek üzerinde sergilemek amacıyla **portfolyo ve referans projesi** olarak geliştirilmiştir.

Geliştirme sürecinde temiz mimari, mock-first demo deneyimi ve üretim ortamına hazır güvenlik standartları ön planda tutulmuştur.

Diğer çalışmalar ve detaylı teknik profil için: [cihadkocasahan](https://github.com/cihadkocasahan)

---

## 📄 Lisans

Bu proje kişisel, eğitim ve portfolyo amaçlı kullanım için ücretsizdir. Yazılım "olduğu gibi" (AS-IS) sunulmakta olup geliştirici hiçbir zarardan sorumlu tutulamaz. Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsiniz.
