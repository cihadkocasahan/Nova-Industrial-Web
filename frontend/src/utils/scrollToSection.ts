/**
 * Smooth scroll to section with offset for sticky header
 * Örnek proje yapısından esinlenilmiştir
 */
export const scrollToSection = (sectionId: string) => {
  const targetId = sectionId.replace('#', '');
  const element = document.getElementById(targetId);
  if (!element) return;

  // Scroll işlemini DOM güncellemesi için iki requestAnimationFrame ile yap
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Mobil/desktop için header yüksekliğini dinamik olarak al
      const isMobile = window.innerWidth <= 768;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.getBoundingClientRect().height : (isMobile ? 80 : 70);
      
      // Eğer 'home' section'ına gidiyorsak, hero bölümüne scroll yap
      if (targetId === 'home') {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          const currentScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
          const heroTop = heroRect.top + currentScrollTop - headerHeight;
          window.scrollTo({
            top: Math.max(0, heroTop),
            behavior: 'smooth',
          });
          return;
        }
      }
      
      // Element'in kendisi zaten section class'ına sahip mi kontrol et
      const isSectionElement = element.classList.contains('section');
      
      // Diğer bölümler için ilk section'ı bul (eğer varsa)
      const firstSection = isSectionElement ? element : (element.querySelector('.section') as HTMLElement);
      
      if (firstSection) {
        // İlk section'ın başına git - getBoundingClientRect ile doğru pozisyon hesapla
        const sectionRect = firstSection.getBoundingClientRect();
        const currentScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        const sectionTop = sectionRect.top + currentScrollTop - headerHeight;
        
        window.scrollTo({
          top: Math.max(0, sectionTop),
          behavior: 'smooth',
        });
      } else {
        // Fallback: bölümün başına git
        // Hero section'ı kontrol et
        const heroSection = document.querySelector('.hero');
        let heroOffset = 0;
        
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          const currentScrollTop = window.pageYOffset;
          
          // Hero section'ın sayfadaki alt pozisyonu
          const heroBottom = heroRect.bottom + currentScrollTop;
          
          // Hedef element'in üst pozisyonu
          const elementTop = element.getBoundingClientRect().top + currentScrollTop;
          
          // Eğer hedef element hero section'dan sonra geliyorsa
          // ve hero section hala görünür durumdaysa (ekranın üstünde veya içinde)
          if (elementTop > heroBottom && heroRect.bottom > 0) {
            // Hero section'ın tamamını atlayacak şekilde offset ekle
            heroOffset = heroRect.height;
          }
        }
        
        // Ekstra boşluk (header ile section arasındaki boşluk için)
        const extraOffset = 20;
        
        // Toplam offset: header yüksekliği + hero yüksekliği (varsa) + ekstra boşluk
        const totalOffset = headerHeight + heroOffset + extraOffset;
        
        // Element'in sayfa içindeki pozisyonunu al
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        
        // Header ve hero'yu tamamen atlayacak şekilde hesapla
        const scrollPosition = absoluteElementTop - totalOffset;

        // Scroll işlemini yap
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      }
    });
  });
};

