import { useNavigate } from 'react-router-dom';
import { useSiteInfo } from '../contexts/SiteInfoContext';

function Footer() {
  const navigate = useNavigate();
  const { siteInfo } = useSiteInfo();

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img 
                src="/logo.svg" 
                alt="Nova Agro" 
                className="footer-logo" 
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>
                Nova Agro
              </h3>
            </div>
            <p className="footer-slogan" style={{ color: 'var(--office-green, #16a34a)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Geleceğin Tarımı İçin İleri AgTech & Ziraat Mühendisliği
            </p>
            <p style={{ color: 'var(--gray-300, #cbd5e1)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Hassas tarım teknolojileri, otonom zirai drone operasyonları, akıllı sulama ve modern sera otomasyonu çözümleriyle verimli ve sürdürülebilir tarımsal gelecek inşa ediyoruz.
            </p>
          </div>
          <div className="footer-section">
            <h3>Hızlı Linkler</h3>
            <ul className="footer-links">
              <li><a href="/">Ana Sayfa</a></li>
              <li><a href="#services" onClick={scrollTo('services')}>Hizmetler</a></li>
              <li><a href="#articles" onClick={scrollTo('articles')}>Makaleler</a></li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>İletişim</h3>
            <p style={{ whiteSpace: 'pre-line' }}>
              {siteInfo.site_address || 'Lorem Ipsum Mah. Teknoloji Cad. No: 123/A, Kadıköy / İstanbul'}
            </p>
            <p>
              <a href={`mailto:${siteInfo.site_email || 'demo@nova-agro.example'}`}>
                {siteInfo.site_email || 'demo@nova-agro.example'}
              </a>
            </p>
            <p>
              <a href={`tel:${(siteInfo.site_phone || '+908503024760').replace(/\s/g, '')}`}>
                {siteInfo.site_phone || '+90 (555) 000 00 00'}
              </a>
            </p>
            <p>
              <a
                href={`https://wa.me/${(siteInfo.site_whatsapp || '905301234567').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: {siteInfo.site_whatsapp || '+90 530 123 45 67'}
              </a>
            </p>
          </div>
        </div>
        {/* Portfolio & Demo Mock Data Disclaimer */}
        <div style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 320px' }}>
            <span style={{ fontSize: '1.4rem' }}>🧪</span>
            <div>
              <strong style={{ color: '#f1f5f9', display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                Portföy & Demo Modu (Mock Veri)
              </strong>
              <span style={{ lineHeight: '1.5', display: 'block' }}>
                Bu web sitesindeki tüm şirket unvanları, adresler, telefonlar, hizmetler ve partner markaları tamamen kurgusal olup portföy gösterimi amacıyla simüle edilmiştir.
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px dashed rgba(22, 163, 74, 0.5)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 600, letterSpacing: '0.5px' }}>DEMO ADMIN GİRİŞİ</div>
              <div style={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                admin@nova-agro.demo / DemoAdmin2026! (URL: /kokpit veya /admin)
              </div>
            </div>
            <a
              href="/kokpit/login"
              style={{
                padding: '0.45rem 0.85rem',
                backgroundColor: 'var(--office-green, #16a34a)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Panele Git ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Nova Agro İleri Tarım Teknolojileri & Ziraat Mühendisliği. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
