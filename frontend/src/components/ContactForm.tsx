import { useState } from 'react';
import { createContactForm } from '../services/api';
import type { ContactFormInput } from '../types';

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{
      padding: '2rem 0 4rem 0',
      backgroundColor: '#f9fafb',
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--gray-900)',
            marginBottom: 0,
          }}>
            İletişim
          </h2>
        </div>
        
        <div className="contact-wrapper" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {/* İletişim Bilgileri ve Konum */}
          <div className="contact-info" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: '1.5rem',
              color: 'var(--gray-900)'
            }}>
              İletişim Bilgileri
            </h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '0.5rem',
                  color: 'var(--office-green)'
                }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    email
                  </span>
                  E-posta
                </h4>
                <p style={{ margin: 0 }}>
                  <a 
                    href="mailto:info@nova-agro.demo" 
                    style={{ 
                      color: 'var(--office-green)', 
                      textDecoration: 'none',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    info@nova-agro.demo
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '0.5rem',
                  color: 'var(--office-green)'
                }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    phone
                  </span>
                  Telefon & WhatsApp
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    color: 'var(--gray-700)', 
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    +90 (555) 000 00 00
                  </span>
                  <a 
                    href="tel:+905550000000" 
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--office-green)',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#15803d';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--office-green)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Ara"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      call
                    </span>
                  </a>
                  <a 
                    href="https://wa.me/905550000000?text=Merhaba%2C%20Nova%20Agro%20tar%C4%B1m%20teknolojileri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#25D366',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#128C7E';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#25D366';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="WhatsApp ile İletişime Geç"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      chat
                    </span>
                  </a>
                </div>
                <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                  <strong>Yetkili Ziraat Mühendisi & Teknik Danışman</strong>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '0.5rem',
                  color: 'var(--office-green)'
                }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    location_on
                  </span>
                  Adres
                </h4>
                <p style={{ color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
                  Lorem Ipsum Mah. Teknoloji Cad.<br />
                  No: 123/A Kat: 4<br />
                  Kadıköy / İstanbul
                </p>
              </div>

            </div>

            {/* Harita */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '1rem',
                color: 'var(--office-green)'
              }}>
                <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                  map
                </span>
                Konum
              </h4>
              <div style={{ 
                width: '100%', 
                height: '300px', 
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8767!2d29.0644!3d40.1827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEwJzU3LjciTiAyOcKwMDMnNTUuOCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nova Agro Merkez Yerleşkesi"
                />
              </div>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--gray-500)', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                Lorem Ipsum Teknoloji & İnovasyon Merkezi
              </p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            {success && (
              <div style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                backgroundColor: 'var(--office-green)', 
                color: 'white', 
                borderRadius: 'var(--radius-md)' 
              }}>
                Mesajınız başarıyla gönderildi!
              </div>
            )}
            
            {error && (
              <div style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                backgroundColor: 'var(--power-red)', 
                color: 'white', 
                borderRadius: 'var(--radius-md)' 
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Adınız</label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınızı girin"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">E-posta</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Telefon</label>
                <input
                  className="form-input"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon numaranızı girin"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Konu</label>
                <select
                  className="form-input"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Konu seçiniz</option>
                  <option value="Zirai Drone İlaçlama & Analiz">Zirai Drone İlaçlama & Analiz</option>
                  <option value="Hassas Tarım & Akıllı Sulama">Hassas Tarım & Akıllı Sulama</option>
                  <option value="Toprak Analizi & Bitki Besleme">Toprak Analizi & Bitki Besleme</option>
                  <option value="Modern Sera Otomasyonu">Modern Sera Otomasyonu</option>
                  <option value="Ziraat Mühendisliği Ruhsatlı Danışmanlık">Ziraat Mühendisliği Ruhsatlı Danışmanlık</option>
                  <option value="Sertifikalı Tohum & Gübre Tedariki">Sertifikalı Tohum & Gübre Tedariki</option>
                  <option value="Genel Bilgi & İletişim">Genel Bilgi & İletişim</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Mesajınız</label>
                <textarea
                  className="form-textarea"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı girin"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--gray-600)',
                marginTop: '1rem',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                Formu doldurduktan sonra mesajınız bize ulaşacaktır. En kısa sürede size geri dönüş yapacağız. 
                Acil durumlarda telefon veya WhatsApp üzerinden iletişime geçebilirsiniz.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;

