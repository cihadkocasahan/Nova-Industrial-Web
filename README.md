# 🌱 NOVA AGRO — İleri AgTech & Ziraat Mühendisliği Web Portalı

> **Portfolyo Projesi** — [Cihad Kocasahan](https://github.com/cihadkocasahan) tarafından geliştirilmiştir.  
> Gerçek dünya endüstriyel/AgTech web platformu: Full-stack mimari, mock fallback katmanı, kapsamlı E2E test paketi ve Docker orkestrasyonu bir arada.

[![Build Status](https://img.shields.io/badge/E2E%20Tests-23%2F23%20PASS%20(100%25)-15803d?style=for-the-badge&logo=checkmarx&logoColor=white)](#-kapsamlı-e2e-test-ve-kalite-güvencesi)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22%20LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.30-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)

> Kurumsal bir web sitesinin ihtiyaç duyduğu her şeyi tek çatı altında toplayan **full-stack CMS platformu**.  
> Demo domain olarak AgTech / ziraat mühendisliği sektörü seçilmiştir; ancak mimari her sektöre uyarlanabilir kurumsal web + içerik yönetimi altyapısıdır.  
> React 18 + TypeScript frontend, Express 5 + Drizzle ORM + MySQL 8 backend, tam yönetim paneli (kokpit), mock fallback katmanı ve Docker orkestrasyonu.

---

## 📸 Ekran Görüntüleri & Görsel Vitrin (Visual Showcase)

### 🌾 1. Masaüstü Ana Sayfa & Hero Slider
*Admin panelinden yönetilebilen hero section slider, hizmet kartları ve CTA butonları.*
![Nova Agro Hero Showcase](docs/screenshots/desktop-fold.jpg)

---

### 🗂️ 2. İçerik Sayfaları — Hizmetler, Kategoriler & Projeler
*CMS'ten beslenen dinamik hizmet kartları, kategori detay sayfaları ve proje portföyü.*
![Nova Agro Hizmetler ve Projeler](docs/screenshots/desktop-page-01.jpg)

---

### 🎛️ 3. Yönetim Paneli (Kokpit Dashboard)
*Canlı içerik istatistikleri; makale, hizmet, proje, teklif ve hero section'ları kod yazmadan yönet.*
![Nova Agro Kokpit Dashboard](docs/screenshots/dashboard.jpg)

---

### 🧪 4. Demo Giriş & Mock Fallback
*Backend kapalıyken bile çalışan mock katmanı; tek tıkla otomatik form doldurma ile sıfır sürtünmeli demo deneyimi.*
![Nova Agro Kokpit Giriş](docs/screenshots/admin-login.jpg)

---

### 📱 5. Kusursuz Mobil & Tablet Uyumluluğu (Responsive Design)
*Mobil çekmece menü, dokunmatik uyumlu modal kontrolleri ve taşma yapmayan esnek ızgara düzeni.*

<div align="center">
  <img src="docs/screenshots/mobile-fold.jpg" width="340" alt="Mobil Görünüm" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/tablet-fold.jpg" width="460" alt="Tablet Görünüm" />
</div>

---

## ⚡ Hızlı Başlangıç (Quick Start)

Platformu **3 farklı modda** saniyeler içinde çalıştırabilirsiniz:

### Seçenek A: 🐳 Docker Compose ile Tek Komutta Başlatma (Full Stack)
Sisteminizde Docker yüklüyse veritabanı, backend ve frontend servislerini tek bir komutla başlatabilirsiniz:

```bash
docker compose up --build -d
```

#### 🌐 Erişim Noktaları
| Servis | URL | Açıklama |
|---|---|---|
| **Frontend Web Sitesi** | [http://localhost:8080](http://localhost:8080) | Nginx SPA + API Reverse Proxy |
| **Marka Kokpiti (Admin)** | [http://localhost:8080/kokpit](http://localhost:8080/kokpit) | `/kokpit`, `/agro-kokpit` ve `/admin` rotaları |
| **Backend REST API** | [http://localhost:3000](http://localhost:3000) (veya `/api/v1/*`) | Express 5 TypeScript API |
| **MySQL Veritabanı** | `localhost:3306` | UTF-8mb4 destekli MySQL 8 |

---

### Seçenek B: 🧪 Bağımsız Önizleme Modu (Standalone Mock — Sıfır Bağımlılık)
Veritabanı veya Docker gerektirmeden, platformun tüm frontend yeteneklerini (teklif alma modalı, filtreleme, mock kokpit girişi) test etmek için:

```bash
cd frontend
npm install
npm run build
npm run preview
# Tarayıcınızda açın: http://localhost:8080
```

### 🔑 Demo Giriş Bilgileri (Kokpit & Admin)
* **E-posta:** `admin@nova-agro.demo`
* **Şifre:** `DemoAdmin2026!`
* *(Giriş sayfasındaki **"Formu Demo Bilgileriyle Doldur"** butonu tek tıkla oturum açmanızı sağlar.)*

---

## 🏗️ Mimari & Teknoloji Yığını (Tech Stack)

```
                            ┌───────────────────────────────────────┐
                            │      NOVA AGRO CLIENT (REACT 18)      │
                            │   Vite · TypeScript · i18n · React    │
                            └───────────────────┬───────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     │                                                     │
         [Offline / Mock Modu]                                   [Canlı API Modu]
                     │                                                     │
        ┌────────────▼────────────┐                            ┌───────────▼───────────┐
        │ Standalone Mock Engine  │                            │  Express 5 REST API   │
        │ mockData.ts (AgTech DB) │                            │  (Node.js 22 LTS)     │
        └─────────────────────────┘                            └───────────┬───────────┘
                                                                           │
                                                               ┌───────────▼───────────┐
                                                               │  Drizzle ORM Migrator │
                                                               └───────────┬───────────┘
                                                                           │
                                                               ┌───────────▼───────────┐
                                                               │    MySQL 8 Database   │
                                                               └───────────────────────┘
```

### 🎨 Frontend Yetenekleri
- **Framework & Araçlar:** React 18, TypeScript 5, Vite 5, React Router v6, i18next (TR/EN).
- **Tasarım Sistemi:** `design-system.css` içinde merkezi CSS token'ları — renk paleti, tipografi ve boşluklar tek noktadan yönetilir. Sektör veya marka değiştiğinde sadece token dosyasını güncellemek yeterlidir.
- **Özelleştirilebilir İçerik Alanları:** Hero slider metni ve görseli, hizmet kartları, proje portföyü, partner/marka logoları ve footer bilgileri tamamen admin panelinden veya seed verisiyle değiştirilebilir — kodda değişiklik gerekmez.
- **Güvenlik:** `DOMPurify` ile zengin metin (Quill) çıktılarında XSS koruması; tüm form inputları Zod şemalarıyla doğrulanır.
- **Statik Varlıklar:** `public/brands/` altında partner logoları, `public/articles/` altında içerik görselleri — admin panelinden veya doğrudan dosya olarak değiştirilebilir.

### ⚙️ Backend & Veri Katmanı
- **API Mimarisi:** Express 5 + TypeScript + ESM.
- **ORM & Veritabanı:** Drizzle ORM + MySQL 8 (Type-safe schema, otomatik migration ve seed mekanizması).
- **Kimlik Doğrulama:** JWT (JSON Web Tokens) + Bcrypt parola şifreleme.
- **Güvenlik Standartları:** Helmet HTTP başlıkları, Express Rate Limiter, CORS yapılandırması.

---

## 🌟 Platform Özellikleri (CMS & Web Yönetim)

### 1. 🎛️ Tam Donanımlı Yönetim Paneli (Kokpit)
Şirketin tüm web içeriğini kod yazmadan yönetebileceği admin arayüzü:
- **Hero Section Yönetimi:** Slider içerikleri, görseller ve CTA butonlarını admin panelinden ekle/düzenle/sırala. Çoklu aktif slide desteği, otomatik sıralama.
- **Hizmet & Kategori Yönetimi:** Hizmet kartlarını, açıklamalarını ve görsellerini CRUD ile yönet.
- **Proje Portföyü:** Proje detay sayfaları, görseller ve etiketler; ziyaretçiler için filtrelenebilir galeri.
- **Blog / Makale Editörü:** Quill tabanlı zengin metin editörü ile makale oluşturma, düzenleme ve yayınlama. DOMPurify ile XSS koruması.
- **Marka & Partner Logoları:** Ortak / partner logolarını yükle, sırala, aktif/pasif yap.
- **İletişim Formu Yönetimi:** Ziyaretçi form gönderimlerini admin panelinde görüntüle.
- **SEO Anahtar Kelimeleri:** Her sayfa / kategori / proje için özel meta keywords yönetimi.
- **Özel Rota Desteği:** Standart `/admin` yanında marka kimliğine özel `/kokpit` ve `/agro-kokpit` rotaları; sidebar prefix'ini koruyan akıllı yönlendirme.

### 2. 🔌 Akıllı Mock Fallback Katmanı (Offline-First Demo)
- Backend veya MySQL kapalıyken frontend tamamen çalışmaya devam eder.
- `api.ts` içindeki şeffaf fallback: API çağrısı başarısız olursa `mockData.ts`'e düşer, kullanıcıya kesintisiz deneyim sunar.
- Demo ortamlarında veya portfolyo sunumlarında sıfır bağımlılıkla çalışan canlı önizleme.
- Tek tıkla demo girişi: giriş sayfasındaki "Formu Doldur" butonu otomatik credential doldurur.

### 3. 📋 Teklif / Lead Toplama Motoru (`QuoteModal`)
- Her hizmet kartından bağımsız olarak açılan, hizmeti otomatik önseçen modal form.
- İletişim sayfasından decouple edilmiş tasarım — `#contact` anchor'a bağımlı değil.
- Benzersiz referans kodu üretimi (`AGRO-2026-XXXX` formatı), yüksek hacimde idempotent çalışma.
- Zod tabanlı frontend + backend çift katman validasyon.

### 4. 🌐 TR/EN Çoklu Dil Desteği (i18next)
- Sistem mesajları, buton etiketleri ve UI metinleri `i18next` + `react-i18next` ile yönetilir.
- Tarayıcı dil algılama; `/tr` ve `/en` rota desteğine hazır altyapı.

### 5. 🗺️ Dinamik Sitemap & SEO Altyapısı
- Backend'de `sitemapController` ile veritabanından beslenen dinamik `sitemap.xml` üretimi.
- Her kategoriye, projeye ve sayfaya özel `lastmod`, `changefreq` ve `priority`.
- `react-helmet-async` ile her sayfada özelleştirilebilir `title`, `description`, Open Graph ve Twitter Card meta tagları.
- Schema.org structured data footer entegrasyonu.

---

## 🧪 Kapsamlı E2E Test ve Kalite Güvencesi

Proje, 4 kademeli (Tiers 1-4) **23 adet otomatik uçtan uca (E2E) test** ile korunmaktadır:

```bash
node tests/e2e/runner.js
```

### Test Özeti Raporu
| Kademe / Test Paketi | Toplam | Başarılı | Başarısız | Başarı Oranı |
|---|:---:|:---:|:---:|:---:|
| **Tier 1: Özellik Kapsamı & Smoke Testleri** | 7 | 7 | 0 | **%100** |
| **Tier 2: Sınır Durumları & Köşe Senaryoları** | 7 | 7 | 0 | **%100** |
| **Tier 3: Çapraz Etkileşim & Entegrasyon** | 5 | 5 | 0 | **%100** |
| **Tier 4: Gerçek Dünya Senaryoları & Regresyon** | 4 | 4 | 0 | **%100** |
| **GENEL TOPLAM** | **23** | **23** | **0** | **%100 PASS** |

*Önemli Test Kriterleri:*
- `[TC-1.1]` Temiz Vite + TypeScript prodüksiyon derleme doğrulaması.
- `[TC-2.6]` WCAG AA (≥ 3.0:1 UI / ≥ 4.5:1 Text) kontrast ve logo şeffaflık denetimi.
- `[TC-4.2]` Tüm CSS ve bileşenlerde sıfır istenmeyen miras renk denetimi.
- `[TC-4.3]` Yüksek hacimli mock teklif gönderim idempotency ve persistence doğrulaması.

---

## 📂 Dizin Yapısı

```
Nova-Agro-Platform/
├── backend/
│   ├── src/
│   │   ├── controllers/      # REST API kontrolcüleri (Makaleler, Hizmetler, Projeler, Teklifler)
│   │   ├── db/               # Drizzle ORM şeması (schema.ts) ve migration bağlantıları
│   │   ├── middleware/       # Auth guard, rate-limiter, sanitization
│   │   ├── routes/           # Express rota tanımları (/auth, /admin, /quotes)
│   │   └── scripts/          # seed-unified.ts (Demo veritabanı tohumlama)
│   ├── Dockerfile            # Multi-stage Node.js container yapılandırması
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── articles/         # Tarımsal SVG rehber çizimleri (drone, toprak, sera)
│   │   ├── brands/           # Vektörel partner logoları (DJI, Deere, Trimble vb.)
│   │   └── logo.svg          # Nova Agro vektörel marka amblemi
│   ├── src/
│   │   ├── components/       # Header, HeroSection, ServiceCards, QuoteModal, ArticleList vb.
│   │   ├── pages/            # Home, CategoryDetail, ProjectDetail, Kokpit sayfaları
│   │   ├── services/         # api.ts & adminApi.ts (Mock fallback destekli HTTP katmanı)
│   │   ├── styles/           # design-system.css & index.css (Anti-slop tasarım sistemi)
│   │   └── types/            # TypeScript model ve arayüz tanımları
│   ├── nginx.conf            # SPA yönlendirmeli Nginx Alpine yapılandırması
│   └── Dockerfile
│
├── docs/
│   └── screenshots/          # README ve portföy ekran görüntüleri
├── tests/
│   └── e2e/                  # 4 kademeli 23-test E2E runner ve senaryoları
├── docker-compose.yml        # Tek komutla ayağa kaldıran compose orkestrasyonu
└── README.md
```

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Kurumsal portföy ve demo amaçlı hazırlanmıştır.
