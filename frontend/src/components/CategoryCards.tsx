import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { mockCategories } from '../services/mockData';

interface CategoryCardsProps {
  categories?: Category[];
}

function CategoryCards({ categories }: CategoryCardsProps) {
  const safeCategories = (categories && categories.length > 0) ? categories : mockCategories;

  if (safeCategories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="section" style={{
      padding: '2rem 0 4rem 0',
      backgroundColor: '#f9fafb',
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--gray-900)',
            marginBottom: '1rem',
          }}>
            Projelerimiz & Uzmanlık Alanlarımız
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--gray-600)',
            maxWidth: '650px',
            margin: '0 auto',
          }}>
            İleri AgTech, zirai drone, akıllı sulama ve modern örtüaltı tarım alanlarında gerçekleştirdiğimiz çalışmalarımız
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
        }}>
          {safeCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                border: '1px solid #e5e7eb',
              }}
              onMouseEnter={(e) => {
                const link = e.currentTarget;
                link.style.transform = 'translateY(-8px)';
                link.style.boxShadow = '0 8px 24px rgba(22, 163, 74, 0.2)';
                link.style.borderColor = 'var(--office-green)';
                const iconDiv = link.querySelector('div[style*="backgroundColor"]') as HTMLElement;
                if (iconDiv) {
                  iconDiv.style.backgroundColor = 'var(--office-green-dark)';
                  iconDiv.style.transform = 'scale(1.1)';
                  iconDiv.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.3)';
                }
                const linkText = link.querySelector('.category-link-text') as HTMLElement;
                if (linkText) {
                  linkText.style.color = 'var(--office-green-dark)';
                }
                const arrow = link.querySelector('span.material-symbols-outlined:last-child') as HTMLElement;
                if (arrow) {
                  arrow.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                const link = e.currentTarget;
                link.style.transform = 'translateY(0)';
                link.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                link.style.borderColor = '#e5e7eb';
                const iconDiv = link.querySelector('div[style*="backgroundColor"]') as HTMLElement;
                if (iconDiv) {
                  iconDiv.style.backgroundColor = 'var(--office-green)';
                  iconDiv.style.transform = 'scale(1)';
                  iconDiv.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.2)';
                }
                const linkText = link.querySelector('.category-link-text') as HTMLElement;
                if (linkText) {
                  linkText.style.color = 'var(--office-green)';
                }
                const arrow = link.querySelector('span.material-symbols-outlined:last-child') as HTMLElement;
                if (arrow) {
                  arrow.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--office-green)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '2rem',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                transition: 'all var(--transition-base)',
              }}>
                <span className="material-symbols-outlined">category</span>
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--gray-900)',
                marginBottom: '0.75rem',
                margin: 0,
              }}>
                {category.name}
              </h3>
              
              {category.description && (
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--gray-600)',
                  lineHeight: '1.6',
                  margin: 0,
                  flex: 1,
                }}>
                  {category.description}
                </p>
              )}
              
              <div 
                className="category-link-text"
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--office-green)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)',
                }}>
                Detaylı Bilgi
                <span className="material-symbols-outlined" style={{
                  fontSize: '1.25rem',
                  marginLeft: '0.5rem',
                  transition: 'transform 0.2s',
                }}>
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryCards;
