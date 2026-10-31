# NOVA INDUSTRIAL Frontend

React + TypeScript + Vite frontend with NOVA INDUSTRIAL Design System.

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

`.env` dosyasını düzenleyin:
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api/v1)

### 3. Development Server

```bash
npm run dev
```

Frontend: http://localhost:5174

### 4. Production Build

```bash
npm run build
npm run preview
```

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ServiceCards.tsx
│   │   ├── ArticleList.tsx
│   │   └── ContactForm.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── services/
│   │   └── api.ts           # API client
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── styles/
│   │   ├── design-system.css  # NOVA INDUSTRIAL Design System
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── logo.png
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Teknoloji Stack

- **React**: 18.3.1
- **TypeScript**: 5.5.2
- **Vite**: 5.2.11
- **React Router**: 6.23.0
- **Axios**: 1.7.1

## 🎨 Design System

NOVA INDUSTRIAL Design System entegre edilmiştir:
- Renk paleti (CSS variables)
- Typography
- Layout sistemi
- Bileşenler (Header, Footer, Cards, Forms, Buttons)
- Responsive tasarım

## 📦 Scripts

- `npm run dev` - Development server (hot reload)
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint check

## 🔗 Backend Bağlantısı

Frontend, backend API'yi şu adresten kullanır:
- Development: `http://localhost:3000/api/v1`
- Production: Environment variable'dan alınır

---

**Frontend hazır! 🚀**

