import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServiceCards from '../components/ServiceCards';
import ArticleList from '../components/ArticleList';
import CategoryCards from '../components/CategoryCards';
import ContactForm from '../components/ContactForm';
import BrandsSection from '../components/BrandsSection';
import Loading from '../components/Loading';
import { scrollToSection } from '../utils/scrollToSection';
import { getHomeSettings } from '../services/api';
import type { HeroSection as HeroSectionType, Service, Article, Category, Brand } from '../types';

function Home() {
  const location = useLocation();
  const [heroSections, setHeroSections] = useState<HeroSectionType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [homeSettings, setHomeSettings] = useState<{
    home_show_articles: boolean;
    home_show_services: boolean;
    home_show_projects: boolean;
    home_show_categories: boolean;
  }>({
    home_show_articles: true,
    home_show_services: true,
    home_show_projects: true,
    home_show_categories: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sayfa ilk yüklendiğinde scroll'u kontrol et
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Browser scroll restoration'ı devre dışı bırak
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Sayfa yüklendiğinde ve hash durumuna göre scroll yap
  useEffect(() => {
    if (!loading && !initialLoadDone) {
      // Loading bittiğinde ilk scroll işlemi (sadece bir kere)
      const timer = setTimeout(() => {
        if (location.hash) {
          // Hash varsa direkt ilgili bölüme scroll yap (en üste gitmeden)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              scrollToSection(location.hash);
              setInitialLoadDone(true);
            });
          });
        } else {
          // Hash yoksa en üste git
          window.scrollTo({ top: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          setInitialLoadDone(true);
        }
      }, 900); // DOM'un tam render olması için yeterli süre
      return () => clearTimeout(timer);
    }
  }, [loading, initialLoadDone, location.hash]);

  // Hash değişikliğini dinle (kullanıcı navigasyonu için)
  useEffect(() => {
    if (initialLoadDone && location.hash && !loading) {
      // İlk yükleme sonrası hash değişirse scroll yap
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToSection(location.hash);
          });
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.hash, initialLoadDone, loading]);

  // /contact path'inden geldiğinde #contact'e scroll yap
  useEffect(() => {
    if (location.pathname === '/contact' && !loading && initialLoadDone) {
      const timer = setTimeout(() => {
        window.location.hash = 'contact';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToSection('#contact');
          });
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, loading, initialLoadDone]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hero sections (slider için tüm aktif slide'ları)
        try {
          const heroSectionsData = await import('../services/api').then(m => m.getActiveHeroSections());
          setHeroSections(heroSectionsData.data || []);
        } catch (err: any) {
          console.error('Hero sections fetch error:', err);
          console.warn('Hero sections not found, using default');
          setHeroSections([]);
        }

        // Fetch services
        try {
          const servicesData = await import('../services/api').then(m => m.getServices());
          setServices(Array.isArray(servicesData.data) ? servicesData.data : []);
        } catch (err) {
          console.warn('Services not found');
          setServices([]);
        }

        // Fetch articles
        try {
          const articlesData = await import('../services/api').then(m => m.getArticles(6));
          setArticles(Array.isArray(articlesData.data) ? articlesData.data : []);
        } catch (err) {
          console.warn('Articles not found');
          setArticles([]);
        }

        // Fetch categories
        try {
          const categoriesData = await import('../services/api').then(m => m.getCategories());
          setCategories(Array.isArray(categoriesData.data) ? categoriesData.data : []);
        } catch (err) {
          console.warn('Categories not found');
          setCategories([]);
        }

        // Fetch brands
        try {
          const brandsData = await import('../services/api').then(m => m.getActiveBrands());
          setBrands(Array.isArray(brandsData.data) ? brandsData.data : []);
        } catch (err) {
          console.warn('Brands not found');
          setBrands([]);
        }

        // Fetch home settings
        try {
          const homeSettingsData = await getHomeSettings();
          // API response format: { data: { home_show_...: boolean } }
          if (homeSettingsData.data) {
            setHomeSettings({
              home_show_articles: homeSettingsData.data.home_show_articles ?? true,
              home_show_services: homeSettingsData.data.home_show_services ?? true,
              home_show_projects: homeSettingsData.data.home_show_projects ?? true,
              home_show_categories: homeSettingsData.data.home_show_categories ?? true,
            });
          }
        } catch (err) {
          console.warn('Home settings not found, using defaults');
        }
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading message="İçerik yükleniyor..." />;
  }

  return (
    <>
      <Helmet>
        <title>Nova Agro | Ziraat Mühendisliği & İleri Tarım Teknolojileri</title>
        <meta name="description" content="Nova Agro ile zirai drone ilaçlama, multispektral haritalama, hassas tarım, akıllı sulama otomasyonu, toprak analizi ve sera iklimlendirme çözümleri." />
        <meta name="keywords" content="zirai drone ilaçlama, hassas tarım, multispektral haritalama, toprak analizi, akıllı sulama, sera otomasyonu, ziraat mühendisliği, Nova Agro" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nova Agro | Ziraat Mühendisliği & İleri Tarım Teknolojileri" />
        <meta property="og:description" content="Zirai drone ilaçlama, hassas tarım ve modern ziraat mühendisliği çözümleri." />
        <meta property="og:url" content={window.location.origin} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nova Agro | Ziraat Mühendisliği & İleri Tarım Teknolojileri" />
        <meta name="twitter:description" content="Zirai drone ilaçlama, hassas tarım ve modern ziraat mühendisliği çözümleri." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <HeroSection heroSections={heroSections} />
      {homeSettings.home_show_categories && <CategoryCards categories={categories} />}
      <AboutSection />
      {homeSettings.home_show_services && <ServiceCards services={services} />}
      <BrandsSection brands={brands} />
      {homeSettings.home_show_articles && <ArticleList articles={articles} />}
      <ContactForm />
      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--power-red)' }}>
          {error}
        </div>
      )}
    </>
  );
}

export default Home;

