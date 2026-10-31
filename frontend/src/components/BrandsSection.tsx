import { useState } from 'react';
import type { Brand } from '../types';

interface BrandsSectionProps {
  brands: Brand[];
}

function BrandLogo({ brand }: { brand: Brand }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <span style={{
        color: 'var(--gray-600)',
        fontSize: '0.875rem',
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '0.5px'
      }}>
        {brand.name}
      </span>
    );
  }

  return (
    <img
      src={brand.logoUrl}
      alt={brand.name}
      style={{
        maxWidth: '130px',
        maxHeight: '38px',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        transition: 'transform 0.25s ease, filter 0.25s ease',
        display: 'block'
      }}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

function BrandsSection({ brands }: BrandsSectionProps) {
  if (!brands || brands.length === 0) {
    return null;
  }

  const activeBrands = brands
    .filter(brand => brand.active)
    .sort((a, b) => a.order - b.order);

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section id="brands" className="section" style={{
      padding: '3.5rem 0',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid var(--neutral-200, #e2e8f0)',
      borderBottom: '1px solid var(--neutral-200, #e2e8f0)',
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: 'var(--gray-900, #0f172a)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Teknoloji Partnerlerimiz & Referanslar
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'var(--gray-600, #64748b)',
            maxWidth: '540px',
            margin: '0 auto',
          }}>
            Hassas tarım ve zirai operasyonlarımızda entegre çalıştığımız küresel teknoloji üreticileri
          </p>
        </div>

        {/* Clean Logo Cloud Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {activeBrands.map((brand) => (
            <div
              key={brand.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 1.25rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                height: '72px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                filter: 'grayscale(35%)',
                opacity: 0.88,
              }}
              title={brand.name}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'grayscale(0%)';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.borderColor = 'var(--office-green, #16a34a)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'grayscale(35%)';
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
              }}
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsSection;
