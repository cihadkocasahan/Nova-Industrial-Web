import { useEffect, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import { 
  adminGetHeroSections, 
  adminDeleteHeroSection, 
  adminUpdateHeroSection,
  type HeroSection 
} from '../../services/adminApi';

function AdminHeroSections() {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const response = await adminGetHeroSections();
      setHeroSections(response.data);
    } catch (error) {
      console.error('Error fetching hero sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu slide\'Ä± silmek istediÄŸinize emin misiniz?')) return;
    try {
      await adminDeleteHeroSection(id);
      setHeroSections(heroSections.filter(h => h.id !== id));
    } catch (error) {
      alert('Slide silinirken hata oluÅŸtu');
    }
  };

  const handleToggleActive = async (id: number) => {
    const hero = heroSections.find(h => h.id === id);
    if (!hero) return;
    
    try {
      const newActive = !hero.active;
      await adminUpdateHeroSection(id, { active: newActive });
      await fetchHeroSections();
    } catch (error) {
      alert('Aktif durum gÃ¼ncellenirken hata oluÅŸtu');
    }
  };

  const handleMoveUp = async (id: number) => {
    const currentIndex = heroSections.findIndex(h => h.id === id);
    if (currentIndex <= 0) return;
    
    const current = heroSections[currentIndex];
    const previous = heroSections[currentIndex - 1];
    
    try {
      await adminUpdateHeroSection(current.id!, { order: previous.order || 0 });
      await adminUpdateHeroSection(previous.id!, { order: current.order || 0 });
      await fetchHeroSections();
    } catch (error) {
      alert('SÄ±ralama gÃ¼ncellenirken hata oluÅŸtu');
    }
  };

  const handleMoveDown = async (id: number) => {
    const currentIndex = heroSections.findIndex(h => h.id === id);
    if (currentIndex < 0 || currentIndex >= heroSections.length - 1) return;
    
    const current = heroSections[currentIndex];
    const next = heroSections[currentIndex + 1];
    
    try {
      await adminUpdateHeroSection(current.id!, { order: next.order || 0 });
      await adminUpdateHeroSection(next.id!, { order: current.order || 0 });
      await fetchHeroSections();
    } catch (error) {
      alert('SÄ±ralama gÃ¼ncellenirken hata oluÅŸtu');
    }
  };

  if (loading) return <div>YÃ¼kleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Slider YÃ¶netimi</h1>
        <Link
          to="/admin/hero-sections/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#16a34a',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#15803d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#16a34a';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add</span>
          Yeni Slide Ekle
        </Link>
      </div>

      {heroSections.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--office-gray)',
        }}>
          <p>HenÃ¼z slide eklenmemiÅŸ.</p>
          <Link
            to="/admin/hero-sections/new"
            style={{
              marginTop: '1rem',
              display: 'inline-block',
              background: '#16a34a',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            Ä°lk Slide'Ä± Ekle
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {heroSections.map((hero, index) => (
            <div key={hero.id} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              minWidth: 0,
              overflow: 'visible',
            }}
            className="hero-section-card"
            >
              <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0, overflow: 'hidden', maxWidth: 'calc(100% - 150px)' }}>
                {/* SÄ±ralama ButonlarÄ± */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <button
                    onClick={() => handleMoveUp(hero.id!)}
                    disabled={index === 0}
                    style={{
                      padding: '0.25rem',
                      background: index === 0 ? 'var(--office-gray)' : 'var(--power-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="YukarÄ± taÅŸÄ±"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_upward</span>
                  </button>
                  <button
                    onClick={() => handleMoveDown(hero.id!)}
                    disabled={index === heroSections.length - 1}
                    style={{
                      padding: '0.25rem',
                      background: index === heroSections.length - 1 ? 'var(--office-gray)' : 'var(--power-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: index === heroSections.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="AÅŸaÄŸÄ± taÅŸÄ±"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_downward</span>
                  </button>
                </div>

                {/* Slide Ã–nizleme */}
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{hero.title}</h3>
                    <span style={{
                      background: 'var(--office-gray)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                    }}>
                      SÄ±ra: {hero.order || 0}
                    </span>
                  </div>
                  {hero.subtitle && (
                    <div 
                      style={{ 
                        margin: 0, 
                        color: 'var(--office-gray)', 
                        marginBottom: '0.25rem',
                        fontSize: '0.875rem',
                        maxHeight: '60px',
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(hero.subtitle.length > 150 ? hero.subtitle.substring(0, 150) + '...' : hero.subtitle) }}
                    />
                  )}
                  {hero.backgroundImage && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={hero.backgroundImage} 
                        alt={hero.title}
                        style={{
                          maxWidth: '200px',
                          maxHeight: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                        }}
                      />
                    </div>
                  )}
                  {hero.ctaText && hero.ctaLink && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--power-blue)' }}>
                      CTA: {hero.ctaText} â†’ {hero.ctaLink}
                    </div>
                  )}
                </div>
              </div>

              {/* Aksiyon ButonlarÄ± */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                alignItems: 'center',
                flexShrink: 0,
                flexGrow: 0,
                minWidth: '120px',
                zIndex: 10,
                position: 'relative',
              }}>
                <button
                  onClick={() => handleToggleActive(hero.id!)}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: hero.active ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    minWidth: '40px',
                  }}
                  title={hero.active ? 'Gizle (Pasif)' : 'GÃ¶ster (Aktif)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', display: 'inline-block', lineHeight: 1 }}>
                    {hero.active ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
                <Link
                  to={`/admin/hero-sections/${hero.id}/edit`}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#16a34a',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    minWidth: '40px',
                  }}
                  title="DÃ¼zenle"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(hero.id!)}
                  style={{
                    padding: '0.5rem',
                    background: 'var(--power-red)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    minWidth: '40px',
                  }}
                  title="Sil"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', display: 'inline-block', lineHeight: 1 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
          )}
    </div>
  );
}

export default AdminHeroSections;
