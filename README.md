# NOVA INDUSTRIAL — Engineering & Automation Platform

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Modern Endüstriyel Otomasyon, SCADA, Robotik Sistemler ve Akıllı Güç Dağıtım Platformu.**  
> Kurumsal mühendislik firmaları ve endüstriyel tesisler için tasarlanmış yüksek performanslı, tam donanımlı full-stack web ve yönetim mimarisi.

---

## ⚡ Hızlı Başlangıç / Quick Start (Tek Komutla Çalıştırma)

Projede sıfır yapılandırma ile tüm servisleri (MySQL 8, Backend API, Nginx & Frontend SPA) ayağa kaldırmak için tek yapmanız gereken:

```bash
docker compose up --build
```

Arka planda (detached) çalıştırmak için:
```bash
docker compose up --build -d
```

### 🌐 Erişim Noktaları
| Servis | URL | Açıklama |
|---|---|---|
| **Frontend Web Sitesi** | [http://localhost:8080](http://localhost:8080) | Nginx SPA + API Reverse Proxy |
| **Yönetim (Admin) Paneli** | [http://localhost:8080/admin](http://localhost:8080/admin) | İçerik, Proje, Hizmet ve SEO Yönetimi |
| **Backend REST API** | [http://localhost:3000](http://localhost:3000) (veya `/api/v1/*`) | Express 5 TypeScript API |
| **MySQL Veritabanı** | `localhost:3306` | UTF-8mb4 Turkish Destekli MySQL 8 |

### 🔑 Demo Giriş Bilgileri (Varsayılan Admin)
- **E-posta:** `admin@nova-industrial.demo`
- **Şifre:** `DemoAdmin2026!`

*(Sistem ilk kez çalıştırıldığında veritabanı tablolarını otomatik oluşturur (`db:migrate`) ve örnek endüstriyel projeler, kategoriler ve servislerle otomatik besler (`db:seed`).)*

---

## 🏗️ Mimari ve Teknoloji Yığını (Tech Stack)

### 🎨 Frontend (SPA)
- **Framework:** React 18 + TypeScript + Vite
- **Tasarım Sistemi:** Modern High-Tech Electric Cyan (`#0ea5e9`) & Deep Slate (`#0f172a`) paleti. Tamamen responsive CSS değişkenleri mimarisi.
- **Yönlendirme (Routing):** React Router v6
- **Çoklu Dil Desteği:** `react-i18next` (Türkçe & İngilizce hazır)
- **Sunucu & Proxy:** Nginx Alpine (SPA fallback + `/api/` reverse proxy)

### ⚙️ Backend (API)
- **Çalışma Zamanı:** Node.js 22 LTS + Express 5 + TypeScript
- **Veritabanı & ORM:** MySQL 8 + Drizzle ORM (Type-safe schema & migrations)
- **Kimlik Doğrulama:** JWT (JSON Web Tokens) & Bcrypt şifreleme
- **Güvenlik & Performans:** `express-rate-limit`, `helmet`, CORS, trust proxy desteği
- **Medya Yönetimi:** Multer ile güvenli dosya/resim yükleme altyapısı

### 🐳 Konteynerizasyon & DevOps
- Çok aşamalı (multi-stage) Dockerfile yapıları ile minimum imaj boyutu
- Docker Compose orkestrasyonu (healthcheck kontrollü sıralı başlangıç: MySQL ➜ Backend ➜ Frontend)
- Kalıcı Docker volume'leri (`mysql_data`, `uploads_data`)

---

## 📦 Proje Dizin Yapısı

```
Nova-Industrial-Web/
├── backend/
│   ├── src/
│   │   ├── controllers/      # REST API kontrolcüleri (Projeler, Hizmetler, Kategoriler, Ayarlar)
│   │   ├── db/               # Drizzle ORM şeması ve migration yöneticisi
│   │   ├── middleware/       # Auth guard, rate-limiter, error handling
│   │   ├── routes/           # Express API rotaları
│   │   ├── scripts/          # Otomatik tohumlama (seed-unified, seed-projects)
│   │   └── server.ts         # Express sunucu giriş noktası
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Header, HeroSection, ContactForm, Cards vb.
│   │   ├── contexts/         # Auth ve SiteInfo context sağlayıcıları
│   │   ├── pages/            # Home, Contact, CategoryDetail, ProjectDetail, Admin sayfaları
│   │   ├── styles/           # Design System & CSS değişkenleri
│   │   └── services/         # Axios API istemcisi
│   ├── nginx.conf            # Üretim Nginx yapılandırması
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Tek komutla ayağa kaldıran compose dosyası
└── README.md
```

---

## 🛠️ Yerel Geliştirme (Local Development)

Docker kullanmadan çalıştırmak isterseniz:

### 1. Gereksinimler
- Node.js >= 20
- MySQL >= 8.0

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env   # Veritabanı bilgilerinizi girin
npm run db:migrate     # Tabloları oluşturur
npm run db:seed        # Örnek verileri yükler
npm run dev            # http://localhost:3000 üzerinde başlar
```

### 3. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 üzerinde başlar
```

---

## 🔒 Güvenlik ve Gizlilik (Anonymized & Clean)
Bu proje, halka açık portföy ve açık kaynak paylaşımı için tasarlanmıştır. İçerisinde hiçbir gerçek şahıs, ticari müşteri veya telifli materyal barındırmaz; tamamen jenerik endüstriyel otomasyon senaryoları ve lisanssız görseller içerir.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında sunulmaktadır.
