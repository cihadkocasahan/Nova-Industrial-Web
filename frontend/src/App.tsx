import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Maintenance from './pages/Maintenance';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import AdminServices from './pages/admin/Services';
import ServiceForm from './pages/admin/ServiceForm';
import AdminHeroSections from './pages/admin/HeroSections';
import HeroSectionForm from './pages/admin/HeroSectionForm';
import AdminAboutSection from './pages/admin/AboutSection';
import AboutSectionForm from './pages/admin/AboutSectionForm';
import AdminCategories from './pages/admin/Categories';
import CategoryForm from './pages/admin/CategoryForm';
import AdminPages from './pages/admin/Pages';
import AdminContactForms from './pages/admin/ContactForms';
import AdminProjects from './pages/admin/Projects';
import ProjectForm from './pages/admin/ProjectForm';
import AdminBrands from './pages/admin/Brands';
import BrandForm from './pages/admin/BrandForm';
import AdminKeywords from './pages/admin/Keywords';
import ArticleForm from './pages/admin/ArticleForm';
import CategoryDetail from './pages/CategoryDetail';
import ProjectDetail from './pages/ProjectDetail';
import { getSiteOffline } from './services/api';

export const ADMIN_PREFIXES = ['/admin', '/kokpit', '/agro-kokpit'];

function AppContent() {
  return (
    <div className="App">
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Home />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          {/* Contact artık ana sayfada bir bölüm, /contact'e gidildiğinde ana sayfaya yönlendir ve #contact'e scroll yap */}
          <Route path="/contact" element={
            <>
              <Header />
              <main>
                <Home />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/category/:slug" element={
            <>
              <Header />
              <main>
                <CategoryDetail />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/proje/:slug" element={
            <>
              <Header />
              <main>
                <ProjectDetail />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />

          {/* Admin & Brand Cockpit Routes (Supports /admin, /kokpit, /agro-kokpit) */}
          {ADMIN_PREFIXES.flatMap((prefix) => [
            <Route key={`${prefix}-login`} path={`${prefix}/login`} element={<AdminLogin />} />,
            <Route key={`${prefix}-root`} path={`${prefix}`} element={<AdminLayout><AdminDashboard /></AdminLayout>} />,
            <Route key={`${prefix}-dash`} path={`${prefix}/dashboard`} element={<AdminLayout><AdminDashboard /></AdminLayout>} />,
            <Route key={`${prefix}-art`} path={`${prefix}/articles`} element={<AdminLayout><AdminArticles /></AdminLayout>} />,
            <Route key={`${prefix}-art-new`} path={`${prefix}/articles/new`} element={<AdminLayout><ArticleForm /></AdminLayout>} />,
            <Route key={`${prefix}-art-id`} path={`${prefix}/articles/:id`} element={<AdminLayout><ArticleForm /></AdminLayout>} />,
            <Route key={`${prefix}-srv`} path={`${prefix}/services`} element={<AdminLayout><AdminServices /></AdminLayout>} />,
            <Route key={`${prefix}-srv-new`} path={`${prefix}/services/new`} element={<AdminLayout><ServiceForm /></AdminLayout>} />,
            <Route key={`${prefix}-srv-id`} path={`${prefix}/services/:id`} element={<AdminLayout><ServiceForm /></AdminLayout>} />,
            <Route key={`${prefix}-hero`} path={`${prefix}/hero-sections`} element={<AdminLayout><AdminHeroSections /></AdminLayout>} />,
            <Route key={`${prefix}-hero-new`} path={`${prefix}/hero-sections/new`} element={<AdminLayout><HeroSectionForm /></AdminLayout>} />,
            <Route key={`${prefix}-hero-edit`} path={`${prefix}/hero-sections/:id/edit`} element={<AdminLayout><HeroSectionForm /></AdminLayout>} />,
            <Route key={`${prefix}-about`} path={`${prefix}/about-section`} element={<AdminLayout><AdminAboutSection /></AdminLayout>} />,
            <Route key={`${prefix}-about-new`} path={`${prefix}/about-section/new`} element={<AdminLayout><AboutSectionForm /></AdminLayout>} />,
            <Route key={`${prefix}-about-edit`} path={`${prefix}/about-section/edit`} element={<AdminLayout><AboutSectionForm /></AdminLayout>} />,
            <Route key={`${prefix}-cat`} path={`${prefix}/categories`} element={<AdminLayout><AdminCategories /></AdminLayout>} />,
            <Route key={`${prefix}-cat-new`} path={`${prefix}/categories/new`} element={<AdminLayout><CategoryForm /></AdminLayout>} />,
            <Route key={`${prefix}-cat-edit`} path={`${prefix}/categories/:id/edit`} element={<AdminLayout><CategoryForm /></AdminLayout>} />,
            <Route key={`${prefix}-pages`} path={`${prefix}/pages`} element={<AdminLayout><AdminPages /></AdminLayout>} />,
            <Route key={`${prefix}-contacts`} path={`${prefix}/contact-forms`} element={<AdminLayout><AdminContactForms /></AdminLayout>} />,
            <Route key={`${prefix}-proj`} path={`${prefix}/projects`} element={<AdminLayout><AdminProjects /></AdminLayout>} />,
            <Route key={`${prefix}-proj-new`} path={`${prefix}/projects/new`} element={<AdminLayout><ProjectForm /></AdminLayout>} />,
            <Route key={`${prefix}-proj-edit`} path={`${prefix}/projects/:id/edit`} element={<AdminLayout><ProjectForm /></AdminLayout>} />,
            <Route key={`${prefix}-brands`} path={`${prefix}/brands`} element={<AdminLayout><AdminBrands /></AdminLayout>} />,
            <Route key={`${prefix}-brands-new`} path={`${prefix}/brands/new`} element={<AdminLayout><BrandForm /></AdminLayout>} />,
            <Route key={`${prefix}-brands-edit`} path={`${prefix}/brands/:id/edit`} element={<AdminLayout><BrandForm /></AdminLayout>} />,
            <Route key={`${prefix}-kw`} path={`${prefix}/keywords`} element={<AdminLayout><AdminKeywords /></AdminLayout>} />,
          ])}
          </Routes>
    </div>
  );
}

function App() {
  const [siteOffline, setSiteOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const response = await getSiteOffline();
        // API response format: { data: { siteOffline: boolean } }
        setSiteOffline(response.data?.siteOffline ?? false);
      } catch (error) {
        console.error('Site durumu kontrol edilemedi:', error);
        // Hata durumunda siteyi açık varsay
        setSiteOffline(false);
      } finally {
        setLoading(false);
      }
    };

    checkSiteStatus();
    
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(checkSiteStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Admin route'ları için site offline kontrolü yapma
  const isAdminRoute = typeof window !== 'undefined' && ADMIN_PREFIXES.some(p => window.location.pathname.startsWith(p));

  // Loading durumunda gösterilecek içerik
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#666' }}>Yükleniyor...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Site offline ise bakım sayfasını göster (admin route hariç)
  if (!isAdminRoute && siteOffline) {
    return <Maintenance />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;

