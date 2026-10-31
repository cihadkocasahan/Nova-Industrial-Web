import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { scrollToSection } from '../utils/scrollToSection';
import { getHomeSettings, getAboutSection } from '../services/api';
import { useSiteInfo } from '../contexts/SiteInfoContext';
import type { AboutSection } from '../types';
import QuoteModal from './QuoteModal';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteInfo } = useSiteInfo();
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);

  // Home settings ve about section'ı yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeSettingsRes, aboutRes] = await Promise.all([
          getHomeSettings().catch(() => ({ data: null })),
          getAboutSection().catch(() => ({ data: null })),
        ]);
        
        // API response format: { data: { home_show_...: boolean } }
        if (homeSettingsRes.data) {
          setHomeSettings({
            home_show_articles: homeSettingsRes.data.home_show_articles ?? true,
            home_show_services: homeSettingsRes.data.home_show_services ?? true,
            home_show_projects: homeSettingsRes.data.home_show_projects ?? true,
            home_show_categories: homeSettingsRes.data.home_show_categories ?? true,
          });
        }
        
        if (aboutRes.data && aboutRes.data.visible !== false) {
          setAboutSection(aboutRes.data);
        }
      } catch (error) {
        console.warn('Home settings or about section not found, using defaults');
      }
    };
    fetchData();
  }, []);

  // Hash değişikliklerini dinle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      setCurrentHash(hash);
    };

    // İlk yüklemede hash'i kontrol et
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Location pathname değiştiğinde hash'i güncelle
  useEffect(() => {
    if (location.pathname === '/') {
      // Eğer ana sayfaya geçiş yapılıyorsa hash'i temizle
      if (isNavigatingHome) {
        setCurrentHash('');
        setIsNavigatingHome(false);
      } else {
        // Normal durumda mevcut hash'i al
        // window.location.hash gerçek URL'deki hash'i gösterir
        const hash = window.location.hash || '';
        setCurrentHash(hash);
      }
    } else {
      // Ana sayfa değilse hash'i temizle
      setCurrentHash('');
    }
  }, [location.pathname, isNavigatingHome]);

  // Ekran boyutu masaüstüne geçerse mobil menüyü kapat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const hash = sectionId.replace('#', '');
    
    // Eğer ana sayfada değilsek, önce ana sayfaya git
    if (location.pathname !== '/') {
      // Ana sayfaya navigate et
      navigate('/');
      // Hash'i ayarla ve DOM güncellemesini bekle
      setTimeout(() => {
        window.location.hash = hash;
        setCurrentHash(sectionId);
        // Scroll için biraz daha bekle
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 200);
      }, 300);
    } else {
      // Ana sayfadaysa hash'i URL'e ekle ve scroll yap
      window.location.hash = hash;
      setCurrentHash(sectionId);
      scrollToSection(sectionId);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      // Zaten ana sayfadaysa hash'i temizle ve hero bölümüne scroll yap
      // URL'yi temizlemek için hash'i kaldır
      if (window.location.hash) {
        window.history.replaceState(null, '', '/');
        // Hash'i state'den de temizle
        setCurrentHash('');
      } else {
        // Hash zaten yoksa state'i temizle
        setCurrentHash('');
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const isMobile = window.innerWidth <= 768;
          const header = document.querySelector('.header');
          const headerHeight = header ? header.getBoundingClientRect().height : (isMobile ? 80 : 70);
          const heroSection = document.querySelector('.hero');
          
          if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            const currentScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
            const heroTop = heroRect.top + currentScrollTop - headerHeight;
            window.scrollTo({
              top: Math.max(0, heroTop),
              behavior: 'smooth',
            });
          } else {
            // Hero yoksa en üste git
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    } else {
      // Başka sayfadaysa ana sayfaya git (hash olmadan)
      // Hash'i URL'den de temizle
      setIsNavigatingHome(true);
      window.history.replaceState(null, '', '/');
      // Hash state'ini hemen temizle (useEffect'ten önce)
      setCurrentHash('');
      navigate('/', { replace: true });
      
      // Biraz sonra tekrar kontrol et
      setTimeout(() => {
        // Hash'in gerçekten temizlendiğinden emin ol
        if (window.location.hash) {
          window.history.replaceState(null, '', '/');
        }
        // State'i tekrar temizle ve flag'i kaldır
        setCurrentHash('');
        setIsNavigatingHome(false);
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const isMobile = window.innerWidth <= 768;
            const header = document.querySelector('.header');
            const headerHeight = header ? header.getBoundingClientRect().height : (isMobile ? 80 : 70);
            const heroSection = document.querySelector('.hero');
            
            if (heroSection) {
              const heroRect = heroSection.getBoundingClientRect();
              const currentScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
              const heroTop = heroRect.top + currentScrollTop - headerHeight;
              window.scrollTo({
                top: Math.max(0, heroTop),
                behavior: 'smooth',
              });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
        });
      }, 100);
    }
  };

  // Aktif link kontrolü
  const isActive = (sectionId: string) => {
    if (location.pathname !== '/') {
      return false; // Ana sayfa değilse hiçbiri aktif değil
    }
    
    // Mevcut hash'i kontrol et (öncelik sırası: state -> window.location.hash -> location.hash)
    const hash = currentHash !== undefined ? currentHash : (window.location.hash || location.hash || '');
    
    // Ana sayfa linki için hash olmamalı (boş string veya sadece #)
    if (sectionId === 'home') {
      const cleanHash = hash.replace('#', '').trim();
      return cleanHash === '';
    }
    
    // Diğer linkler için hash eşleşmeli
    const cleanHash = hash.startsWith('#') ? hash : `#${hash}`;
    const cleanSectionId = sectionId.startsWith('#') ? sectionId : `#${sectionId}`;
    return cleanHash === cleanSectionId;
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo" onClick={handleHomeClick}>
          <img src="/logo.svg" alt="Nova Agro Logo" />
          <h1>Nova Agro</h1>
        </a>

        {/* Mobile menu toggle button */}
        <button
          type="button"
          className={`mobile-menu-toggle ${isMenuOpen ? 'is-active' : ''}`}
          aria-label={isMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`nav ${aboutSection && aboutSection.visible ? 'has-about' : ''} ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <a 
                href="/" 
                onClick={handleHomeClick} 
                className={isActive('home') ? 'active' : ''}
              >
                Ana Sayfa
              </a>
            </li>
            {homeSettings.home_show_categories && (
              <li>
                <a 
                  href="#categories" 
                  onClick={(e) => handleLinkClick(e, '#categories')}
                  className={isActive('#categories') ? 'active' : ''}
                >
                  Projelerimiz
                </a>
              </li>
            )}
            {homeSettings.home_show_services && (
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => handleLinkClick(e, '#services')}
                  className={isActive('#services') ? 'active' : ''}
                >
                  Hizmetler
                </a>
              </li>
            )}
            {homeSettings.home_show_articles && (
              <li>
                <a 
                  href="#articles" 
                  onClick={(e) => handleLinkClick(e, '#articles')}
                  className={isActive('#articles') ? 'active' : ''}
                >
                  Makaleler
                </a>
              </li>
            )}
            {aboutSection && aboutSection.visible && (
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick(e, '#about')}
                  className={isActive('#about') ? 'active' : ''}
                >
                  Hakkımızda
                </a>
              </li>
            )}
            <li>
              <a 
                href="#contact" 
                onClick={(e) => handleLinkClick(e, '#contact')}
                className={isActive('#contact') ? 'active' : ''}
              >
                İletişim
              </a>
            </li>
          </ul>
          <button 
            type="button"
            className="btn btn-primary header-quote-btn"
            onClick={() => {
              setIsMenuOpen(false);
              setIsQuoteModalOpen(true);
            }}
          >
            Teklif Al
          </button>
        </nav>
      </div>

      {/* Dedicated Agricultural Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </header>
  );
}

export default Header;

