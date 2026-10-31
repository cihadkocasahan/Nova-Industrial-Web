import { useEffect, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import { 
  adminGetAboutSection, 
  adminToggleAboutSectionVisible
} from '../../services/adminApi';
import type { AboutSection } from '../../types';
import Toast, { type ToastType } from '../../components/Toast';

function AdminAboutSection() {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    fetchAboutSection();
  }, []);

  const fetchAboutSection = async () => {
    try {
      const response = await adminGetAboutSection();
      setAboutSection(response.data);
    } catch (error) {
      console.error('Error fetching about section:', error);
      showToast('HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼ yÃ¼klenirken hata oluÅŸtu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ isOpen: true, message, type });
  };

  const handleToggleVisible = async () => {
    if (!aboutSection) return;
    
    try {
      const response = await adminToggleAboutSectionVisible(aboutSection.id);
      setAboutSection(response.data);
      showToast(response.data.visible ? 'HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼ aktif yapÄ±ldÄ±' : 'HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼ pasif yapÄ±ldÄ±', 'success');
    } catch (error) {
      showToast('Durum deÄŸiÅŸtirilirken hata oluÅŸtu', 'error');
      console.error('Toggle error:', error);
    }
  };

  if (loading) return <div>YÃ¼kleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '0.5rem' }}>
            HakkÄ±mÄ±zda BÃ¶lÃ¼mÃ¼
          </h1>
          <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-base)' }}>
            Anasayfa iÃ§in HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼nÃ¼ yÃ¶netin
          </p>
        </div>
        {aboutSection ? (
          <Link
            to="/admin/about-section/edit"
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
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
            DÃ¼zenle
          </Link>
        ) : (
          <Link
            to="/admin/about-section/new"
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
            HakkÄ±mÄ±zda BÃ¶lÃ¼mÃ¼ OluÅŸtur
          </Link>
        )}
      </div>

      {!aboutSection ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--office-gray)',
        }}>
          <p>HenÃ¼z HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼ oluÅŸturulmamÄ±ÅŸ.</p>
          <Link
            to="/admin/about-section/new"
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
            Ä°lk HakkÄ±mÄ±zda BÃ¶lÃ¼mÃ¼nÃ¼ OluÅŸtur
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{aboutSection.title}</h3>
                {aboutSection.visible && (
                  <span style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}>
                    Aktif
                  </span>
                )}
              </div>
              <div 
                style={{ 
                  margin: 0, 
                  color: '#6b7280', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  maxWidth: '800px',
                  maxHeight: '60px',
                  overflow: 'hidden',
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutSection.content.length > 200 ? aboutSection.content.substring(0, 200) + '...' : aboutSection.content) }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handleToggleVisible}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: aboutSection.visible ? '#10b981' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                }}
                title={aboutSection.visible ? 'GÃ¶ster (Aktif)' : 'Gizle (Pasif)'}
              >
                <span className="material-symbols-outlined">
                  {aboutSection.visible ? 'visibility' : 'visibility_off'}
                </span>
              </button>
              <Link
                to="/admin/about-section/edit"
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
                }}
                title="DÃ¼zenle"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}

export default AdminAboutSection;

