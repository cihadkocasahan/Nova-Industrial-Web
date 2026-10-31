import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollToSection';
import type { HeroSection as HeroSectionType } from '../types';
import { sanitizeHtml } from '../utils/sanitize';

interface HeroSectionProps {
  heroSections: HeroSectionType[];
}

function HeroSection({ heroSections }: HeroSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    const hash = sectionId.replace('#', '');
    
    // Eğer ana sayfada değilsek, önce ana sayfaya git
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.location.hash = hash;
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 200);
      }, 300);
    } else {
      // Ana sayfadaysa hash'i URL'e ekle ve scroll yap
      window.location.hash = hash;
      scrollToSection(sectionId);
    }
  };

  // DB'den gelen slide'ları kullan, yoksa default göster
  // Ensure heroSections is an array
  const safeHeroSections = Array.isArray(heroSections) ? heroSections : [];
  const hasSlides = safeHeroSections.length > 0;
  
  // Default hero content if none from API
  const defaultHeroCards = [
    {
      backgroundImage: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80",
      title: "Nova Agro — Zirai Drone & Multispektral Analiz",
      subtitle: "RTK Destekli Hassas Otonom İlaçlama ve NDVI Bitki Sağlığı Haritalama",
      description: "Santimetre hassasiyetinde değişken oranlı ilaçlama (VRA) ile mahsulü ezmeden %90 su ve %30 kimyasal tasarrufu sağlayın.",
      ctaText: "Hizmeti İncele",
      ctaLink: "/#services",
    },
    {
      backgroundImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&q=80",
      title: "Hassas Tarım & Akıllı Sulama Otomasyonu",
      subtitle: "IoT Toprak Nem Sensörleri ve Yapay Zeka Destekli Sulama Yönetimi",
      description: "Toprak nemi ve mikroklima verileriyle otonom çalışan sulama altyapısı sayesinde su ve enerji israfına son verin.",
      ctaText: "Sulama Çözümleri",
      ctaLink: "/#services",
    },
    {
      backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80",
      title: "Modern Sera Otomasyonu & İklimlendirme",
      subtitle: "365 Gün Yüksek Verimli Örtüaltı Tarım ve Fertigasyon Çözümleri",
      description: "Endüstriyel iklim bilgisayarları, oransal havalandırma ve topraksız fertigasyon ile maksimum fotosentez ve rekolte artışı.",
      ctaText: "Sera Sistemleri",
      ctaLink: "/#services",
    },
  ];

  // DB'den gelen slide'ları format'a çevir
  const heroCards = hasSlides
    ? safeHeroSections.map((hero) => {
        // Debug: description değerini kontrol et
        if (process.env.NODE_ENV === 'development') {
          console.log('Hero section:', { 
            title: hero.title, 
            subtitle: hero.subtitle, 
            description: hero.description,
            hasDescription: !!hero.description 
          });
        }
        return {
          backgroundImage: hero.backgroundImage || "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80",
          title: hero.title || "Nova Agro - İleri Tarım Teknolojileri",
          subtitle: hero.subtitle || "",
          description: hero.description || "",
          ctaText: hero.ctaText || "Detaylı Bilgi",
          ctaLink: hero.ctaLink || "/#services",
        };
      })
    : defaultHeroCards;

  // Toplam slide sayısı
  const totalSlides = heroCards.length;

  // Auto-slide functionality
  useEffect(() => {
    if (totalSlides <= 1) return; // Tek slide varsa auto-slide yapma
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <section className="hero" style={{
      position: 'relative',
      width: '100%',
      minHeight: '80vh',
      overflow: 'hidden',
      padding: 0,
      margin: 0,
    }}>
      {/* Slider Container - Full Width */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: '600px',
        overflow: 'hidden',
      }}>
        {/* Slider Track */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.6s ease-in-out',
          willChange: 'transform',
        }}>
          {heroCards.map((card, index) => {
            const sectionId = card.ctaLink?.startsWith('/#') ? card.ctaLink.substring(1) : card.ctaLink || '#contact';
            return (
              <div
                key={index}
                style={{
                  minWidth: '100%',
                  width: '100%',
                  flexShrink: 0,
                  height: '100%',
                  position: 'relative',
                }}
              >
                <a
                  href={card.ctaLink || '/#contact'}
                  onClick={(e) => handleCardClick(e, sectionId)}
                  className="hero-slide-card"
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    textDecoration: 'none',
                    color: 'white',
                    position: 'relative',
                    backgroundImage: `url(${card.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Cinematic Natural Dark Vignette Overlay for Crisp Legibility */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.62) 48%, rgba(15, 23, 42, 0.38) 100%)',
                    zIndex: 1,
                  }} />
                  
                  {/* Content Container */}
                  <div className="hero-slide-content" style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '4rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}>
                    <h3 className="hero-slide-title" style={{
                      fontSize: 'var(--font-size-5xl)',
                      fontWeight: 'var(--font-weight-extrabold)',
                      marginBottom: '1.5rem',
                      color: 'white',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                      lineHeight: 'var(--line-height-tight)',
                    }}>
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <div 
                        className="hero-slide-subtitle" 
                        style={{
                          fontSize: 'var(--font-size-2xl)',
                          fontWeight: 'var(--font-weight-semibold)',
                          marginBottom: '1rem',
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                          lineHeight: 'var(--line-height-normal)',
                          maxWidth: '600px',
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(card.subtitle) }}
                      />
                    )}
                    {card.description && card.description.trim() ? (
                      <div 
                        className="hero-slide-description" 
                        style={{
                          fontSize: 'var(--font-size-xl)',
                          color: 'rgba(255, 255, 255, 0.95)',
                          lineHeight: 'var(--line-height-normal)',
                          marginBottom: '2rem',
                          maxWidth: '600px',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(card.description) }}
                      />
                    ) : null}
                    {card.ctaText && (
                      <span style={{
                        backgroundColor: '#15803d',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.75rem 1.6rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                        transition: 'background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#166534';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#15803d';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
                      }}
                      >
                        {card.ctaText}
                        <span className="material-symbols-outlined" style={{
                          fontSize: '1.25rem',
                          transition: 'transform var(--transition-base)',
                        }}>
                          arrow_forward
                        </span>
                      </span>
                    )}
                  </div>
                </a>
              </div>
            );
          })}
          
        </div>

        {/* Navigation Buttons - sadece birden fazla slide varsa göster */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hero-slider-nav-btn hero-slider-nav-prev"
              style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--office-green)',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                zIndex: 10,
                transition: 'all 0.3s',
                boxShadow: 'var(--shadow-lg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              aria-label="Previous slide"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            <button
              onClick={goToNext}
              className="hero-slider-nav-btn hero-slider-nav-next"
              style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--office-green)',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                zIndex: 10,
                transition: 'all 0.3s',
                boxShadow: 'var(--shadow-lg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              aria-label="Next slide"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Slider Indicators */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.75rem',
              zIndex: 10,
            }}>
              {heroCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: currentSlide === index ? '40px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'width 0.3s, background-color 0.3s',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
