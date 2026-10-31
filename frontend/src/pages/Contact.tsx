import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ContactForm from '../components/ContactForm';

function Contact() {
  useEffect(() => {
    // Sayfa yüklendiğinde contact bölümüne kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>İletişim | NOVA INDUSTRIAL - Mühendislik & Otomasyon Çözümleri</title>
        <meta name="description" content="NOVA INDUSTRIAL mühendislik ekibi ile iletişime geçin. Endüstriyel otomasyon, SCADA, robotik entegrasyon ve akıllı güç sistemleri için profesyonel destek alın." />
        <meta name="keywords" content="Endüstriyel otomasyon iletişim, SCADA mühendislik, PLC proje danışmanlığı, NOVA INDUSTRIAL iletişim" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="İletişim | NOVA INDUSTRIAL - Mühendislik & Otomasyon Çözümleri" />
        <meta property="og:description" content="Endüstriyel otomasyon, SCADA ve güç sistemleri projeleriniz için NOVA INDUSTRIAL uzmanlarıyla görüşün." />
        <meta property="og:url" content={`${window.location.origin}/contact`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="İletişim | NOVA INDUSTRIAL - Mühendislik & Otomasyon Çözümleri" />
        <meta name="twitter:description" content="Endüstriyel otomasyon, SCADA ve güç sistemleri projeleriniz için NOVA INDUSTRIAL uzmanlarıyla görüşün." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <ContactForm />
    </>
  );
}

export default Contact;

