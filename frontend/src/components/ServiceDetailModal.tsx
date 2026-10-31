import { useEffect } from 'react';
import type { AgriculturalServiceDetail } from '../services/mockData';

interface ServiceDetailModalProps {
  service: AgriculturalServiceDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onQuoteRequest?: (serviceTitle: string) => void;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onQuoteRequest,
}: ServiceDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) {
    return null;
  }

  const handleQuoteClick = () => {
    onClose();
    if (onQuoteRequest) {
      onQuoteRequest(service.title);
    } else {
      // Dispatch custom event that QuoteModal or Header can listen to
      window.dispatchEvent(
        new CustomEvent('open-quote-modal', {
          detail: { serviceType: service.title },
        })
      );
      // Fallback scroll to contact if quote modal is not active
      const quoteBtn = document.querySelector<HTMLButtonElement>('.quote-modal-btn');
      if (quoteBtn) {
        quoteBtn.click();
      } else {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div
      className="service-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="service-modal-container"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                {service.iconText || 'science'}
              </span>
            </div>
            <div>
              {service.badge && (
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {service.badge}
                </span>
              )}
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                  lineHeight: '1.3',
                }}
              >
                {service.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              close
            </span>
          </button>
        </div>

        {/* Description */}
        <div>
          <h4
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#16a34a',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            Agronomik Kapsam & Çözüm Özeti
          </h4>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: '1.65',
              color: '#374151',
              margin: 0,
            }}
          >
            {service.description}
          </p>
        </div>

        {/* Technical Specifications Grid */}
        {service.specs && service.specs.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#16a34a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              Teknik Özellikler & Kapasite
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {service.specs.map((spec, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                    {spec.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 700, marginTop: '0.15rem' }}>
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features List */}
        {service.features && service.features.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#16a34a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              Hizmet Kapsamı & Yetkinlikler
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {service.features.map((feat, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    fontSize: '0.925rem',
                    color: '#374151',
                    lineHeight: '1.5',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '18px',
                      color: '#16a34a',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  >
                    check_circle
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1.25rem',
            marginTop: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={handleQuoteClick}
            className="btn btn-primary"
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#15803d';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              request_quote
            </span>
            Bu Hizmet İçin Teklif İste
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailModal;
