import { useEffect, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import {
  adminGetPages,
  adminDeletePage,
  adminGetHomeSettings,
  adminUpdateHomeSettings,
  adminGetAboutSection,
  adminToggleAboutSectionVisible,
  type Page
} from '../../services/adminApi';
import type { AboutSection } from '../../types';

function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [homeSettings, setHomeSettings] = useState<{
    home_show_articles: boolean;
    home_show_services: boolean;
    home_show_projects: boolean;
    home_show_categories: boolean;
  }>({
    home_show_articles: true,
    home_show_services: true,
    home_show_projects: true,
    home_show_categories: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pagesRes, homeSettingsRes, aboutRes] = await Promise.all([
        adminGetPages(),
        adminGetHomeSettings(),
        adminGetAboutSection().catch(() => ({ data: null })), // Hata durumunda null dÃ¶ndÃ¼r
      ]);
      setPages(pagesRes.data || []);
      setAboutSection(aboutRes.data);
      setHomeSettings(homeSettingsRes.data || {
        home_show_articles: true,
        home_show_services: true,
        home_show_projects: true,
        home_show_categories: true,
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      // Home settings hatasÄ± kritik deÄŸil, sadece log'la
      if (error.response?.status !== 404) {
        alert('Veriler yÃ¼klenirken hata oluÅŸtu: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('Bu sayfayÄ± silmek istediÄŸinize emin misiniz?')) return;
    try {
      await adminDeletePage(id);
      setPages(pages.filter(p => p.id !== id));
    } catch (error) {
      alert('Sayfa silinirken hata oluÅŸtu');
    }
  };

  const handleToggleHomeSetting = async (key: 'home_show_articles' | 'home_show_services' | 'home_show_projects' | 'home_show_categories') => {
    try {
      const newValue = !homeSettings[key];
      const updatedSettings = { ...homeSettings, [key]: newValue };
      setHomeSettings(updatedSettings);
      
      const response = await adminUpdateHomeSettings({ [key]: newValue });
      setHomeSettings(response.data);
    } catch (error: any) {
      alert('Anasayfa ayarÄ± gÃ¼ncellenirken hata oluÅŸtu: ' + (error.response?.data?.error || error.message));
      // Revert on error
      fetchAll();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--office-gray)' }}>YÃ¼kleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>YÃ¼kleniyor...</div>
        </div>
      ) : (
        <>
          {/* Anasayfa Blok GÃ¶rÃ¼nÃ¼rlÃ¼k AyarlarÄ± */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d263b', margin: '0 0 1rem 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                home
              </span>
              Anasayfa Blok GÃ¶rÃ¼nÃ¼rlÃ¼k AyarlarÄ±
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#16a34a' }}>article</span>
                  <span style={{ fontWeight: 500 }}>Makaleler BloÄŸu</span>
                </div>
                <button
                  onClick={() => handleToggleHomeSetting('home_show_articles')}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: homeSettings.home_show_articles ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                  }}
                  title={homeSettings.home_show_articles ? 'Anasayfada GÃ¶ster (Aktif)' : 'Anasayfada Gizle (Pasif)'}
                >
                  <span className="material-symbols-outlined">
                    {homeSettings.home_show_articles ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#16a34a' }}>build</span>
                  <span style={{ fontWeight: 500 }}>Hizmetler BloÄŸu</span>
                </div>
                <button
                  onClick={() => handleToggleHomeSetting('home_show_services')}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: homeSettings.home_show_services ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                  }}
                  title={homeSettings.home_show_services ? 'Anasayfada GÃ¶ster (Aktif)' : 'Anasayfada Gizle (Pasif)'}
                >
                  <span className="material-symbols-outlined">
                    {homeSettings.home_show_services ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#16a34a' }}>work</span>
                  <span style={{ fontWeight: 500 }}>Projeler BloÄŸu</span>
                </div>
                <button
                  onClick={() => handleToggleHomeSetting('home_show_projects')}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: homeSettings.home_show_projects ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                  }}
                  title={homeSettings.home_show_projects ? 'Anasayfada GÃ¶ster (Aktif)' : 'Anasayfada Gizle (Pasif)'}
                >
                  <span className="material-symbols-outlined">
                    {homeSettings.home_show_projects ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#16a34a' }}>folder</span>
                  <span style={{ fontWeight: 500 }}>Kategoriler BloÄŸu</span>
                </div>
                <button
                  onClick={() => handleToggleHomeSetting('home_show_categories')}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: homeSettings.home_show_categories ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                  }}
                  title={homeSettings.home_show_categories ? 'Anasayfada GÃ¶ster (Aktif)' : 'Anasayfada Gizle (Pasif)'}
                >
                  <span className="material-symbols-outlined">
                    {homeSettings.home_show_categories ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* HakkÄ±mÄ±zda BÃ¶lÃ¼mÃ¼ */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d263b', margin: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                  info
                </span>
                HakkÄ±mÄ±zda
              </h2>
            </div>
            {aboutSection ? (
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
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutSection.content.substring(0, 200)) }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={async () => {
                        try {
                          const response = await adminToggleAboutSectionVisible(aboutSection.id);
                          setAboutSection(response.data);
                        } catch (error) {
                          console.error('Toggle error:', error);
                          alert('Durum deÄŸiÅŸtirilirken hata oluÅŸtu');
                        }
                      }}
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
            ) : (
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#6b7280' }}>HakkÄ±mÄ±zda bÃ¶lÃ¼mÃ¼ henÃ¼z oluÅŸturulmamÄ±ÅŸ</p>
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
                  HakkÄ±mÄ±zda OluÅŸtur
                </Link>
              </div>
            )}
          </div>

          {/* Sayfalar BÃ¶lÃ¼mÃ¼ */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d263b', margin: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                  description
                </span>
                Sayfalar
              </h2>
              <button style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add</span>
                Yeni Sayfa
              </button>
            </div>
            {pages.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#6b7280' }}>HenÃ¼z sayfa yok</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pages.map((page) => (
                  <div key={page.id} style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{page.title}</h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Slug: {page.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePage(page.id!)}
                      style={{
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                      }}
                      title="Sil"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPages;

