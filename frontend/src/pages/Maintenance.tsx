import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

function Maintenance() {
  const { t } = useTranslation();
  
  // WhatsApp ve telefon numaraları
  const phoneNumber = '+90 (212) 555 01 99';
  const whatsappNumber = '905550000000'; // WhatsApp için sadece rakamlar (ülke kodu dahil)
  const whatsappMessage = encodeURIComponent(t('maintenance.whatsappMessage'));

  useEffect(() => {
    // Sayfa yüklendiğinde en üste scroll
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Body padding'i sıfırla (bakım sayfası için)
    document.body.style.paddingTop = '0';
    document.body.style.margin = '0';
    
    return () => {
      // Cleanup: Orijinal değerlere geri dön
      document.body.style.paddingTop = '';
      document.body.style.margin = '';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('maintenance.title')} - Nova Agro</title>
        <meta name="description" content={t('maintenance.description')} />
        <style>{`
          body {
            padding-top: 0 !important;
            margin: 0 !important;
          }
        `}</style>
      </Helmet>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        padding: '0 2rem 2rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Arkaplan deseni */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(42,159,58,0.2) 0%, transparent 50%),
            radial-gradient(circle at 60% 70%, rgba(109,212,122,0.15) 0%, transparent 50%)
          `,
          zIndex: 0,
        }} />

        {/* Ana içerik */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
        }}>
          {/* Logo */}
          <div style={{
            marginBottom: '2rem',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <img
              src="/logo.svg"
              alt="Nova Agro Logo"
              style={{
                width: '250px',
                height: '250px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                marginBottom: '1rem',
              }}
              onError={(e) => {
                // Logo yüklenemezse Material Icon göster
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const icon = document.createElement('span');
                  icon.className = 'material-symbols-outlined';
                  icon.textContent = 'agriculture';
                  icon.style.fontSize = '6rem';
                  icon.style.color = 'white';
                  parent.appendChild(icon);
                }
              }}
            />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white',
              margin: '1rem 0 0 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              letterSpacing: '0.05em',
            }}>
              Nova Agro
            </h2>
          </div>

          {/* Başlık */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 1rem 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            {t('maintenance.heading')}
          </h1>

          {/* Açıklama */}
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.8',
            whiteSpace: 'pre-line',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 3rem 0',
          }}>
            {t('maintenance.message')}
          </p>

          {/* İletişim Butonları */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {/* Telefon */}
            <a
              href={`tel:${phoneNumber}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#16a34a',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(21,127,31,0.3)',
                transition: 'all 0.3s ease',
                flex: 1,
                minWidth: '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(21,127,31,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,127,31,0.3)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>
                call
              </span>
              {phoneNumber}
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: '#25D366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                flex: 1,
                minWidth: '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(37,211,102,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ display: 'block' }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {t('maintenance.whatsapp')}
            </a>
          </div>
        </div>

        {/* CSS Animasyon */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default Maintenance;

