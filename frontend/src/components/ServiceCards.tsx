import { useState } from 'react';
import type { Service } from '../types';
import { mockServices, type AgriculturalServiceDetail } from '../services/mockData';
import { ServiceDetailModal } from './ServiceDetailModal';

interface ServiceCardsProps {
  services?: Service[];
}

function ServiceCards({ services }: ServiceCardsProps) {
  const [selectedService, setSelectedService] = useState<AgriculturalServiceDetail | null>(null);

  // If services is empty or not passed, use the comprehensive mockServices
  const safeServices: Service[] = (services && services.length > 0) ? services : mockServices;

  // Enrich standard Service with mock detail metadata if available
  const enrichService = (service: Service): AgriculturalServiceDetail => {
    const mockMatch = mockServices.find(
      (m) => m.id === service.id || m.title.toLowerCase().includes(service.title.toLowerCase().slice(0, 10))
    );
    return {
      ...service,
      slug: (service as any).slug || mockMatch?.slug || 'tarim-hizmeti',
      categoryName: (service as any).categoryName || mockMatch?.categoryName || 'Tarımsal Mühendislik',
      badge: (service as any).badge || mockMatch?.badge || 'AgTech',
      features: (service as any).features || mockMatch?.features || [
        'Ziraat Mühendisliği onaylı uygulama',
        'Yüksek verim ve maliyet tasarrufu',
        'Modern teknoloji desteği',
      ],
      specs: (service as any).specs || mockMatch?.specs || [
        { label: 'Uygulama Alanı', value: 'Tarla, Bağ, Bahçe ve Sera' },
        { label: 'Teknoloji', value: 'İleri AgTech & GPS Hassasiyeti' },
      ],
      benefits: (service as any).benefits || mockMatch?.benefits || [
        'Kaynak kullanımında tasarruf',
        'Toprak ve bitki sağlığının korunması',
      ],
    };
  };

  const handleOpenDetail = (service: Service) => {
    const detailed = enrichService(service);
    setSelectedService(detailed);
  };

  const handleCloseDetail = () => {
    setSelectedService(null);
  };

  const handleDirectQuote = (service: Service) => {
    window.dispatchEvent(
      new CustomEvent('open-quote-modal', {
        detail: { serviceType: service.title },
      })
    );
    const quoteBtn = document.querySelector<HTMLButtonElement>('.quote-modal-btn');
    if (quoteBtn) {
      quoteBtn.click();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="section" id="services" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              color: '#15803d',
              backgroundColor: '#f0fdf4',
              border: '1px solid #dcfce7',
              fontWeight: 700,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem',
            }}
          >
            Hizmetlerimiz
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            5 Temel Ziraat Mühendisliği & AgTech Hizmetimiz
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto', color: '#4b5563' }}>
            İleri AgTech & Ziraat Mühendisliği Çözümleri: Zirai drone ilaçlama ve multispektral analiz, akıllı sulama, toprak analizi ve gübreleme, modern sera otomasyonu ile ruhsatlı tarımsal danışmanlık.
          </p>
        </div>

        <div
          className="card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {safeServices.map((service) => {
            const enriched = enrichService(service);
            return (
              <div
                key={service.id}
                className="card service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2rem',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      className="card-icon"
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                      }}
                    >
                      <span className="material-symbols-outlined">
                        {service.iconText || service.icon || 'eco'}
                      </span>
                    </div>

                    {enriched.badge && (
                      <span
                        style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.12)',
                          color: '#15803d',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {enriched.badge}
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.75rem',
                      lineHeight: '1.35',
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: '#4b5563',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {service.description}
                  </p>

                  {enriched.features && enriched.features.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                        }}
                      >
                        {enriched.features.slice(0, 3).map((feat, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.85rem',
                              color: '#374151',
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '16px', color: '#16a34a', flexShrink: 0 }}
                            >
                              check
                            </span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(service)}
                    style={{
                      flex: 1,
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#16a34a',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.08)';
                      e.currentTarget.style.borderColor = '#16a34a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      info
                    </span>
                    Detayları İncele
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectQuote(service)}
                    className="btn btn-primary"
                    style={{
                      padding: '0.625rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#15803d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                    }}
                  >
                    Teklif Al
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={handleCloseDetail}
      />
    </section>
  );
}

export default ServiceCards;
