import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminMe, adminGetSiteOffline, adminUpdateSiteOffline } from '../../services/adminApi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [siteOffline, setSiteOffline] = useState(false);
  const [loadingOffline, setLoadingOffline] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPrefix = location.pathname.startsWith('/kokpit')
    ? '/kokpit'
    : location.pathname.startsWith('/agro-kokpit')
      ? '/agro-kokpit'
      : '/admin';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Mobilde sidebar'ı varsayılan olarak kapat
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // İlk yüklemede kontrol et

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate(`${currentPrefix}/login`);
        return;
      }

      // Demo token: skip backend entirely for instant access
      if (token.startsWith('demo-mock-')) {
        const saved = localStorage.getItem('admin_user');
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        } else {
          setUser({ id: 1, email: 'admin@nova-agro.demo' } as any);
        }
        setSiteOffline(false);
        return;
      }

      try {
        const response = await adminMe();
        setUser(response.data);
        
        // Site offline durumunu yükle
        const offlineResponse = await adminGetSiteOffline();
        // API response format: { data: { siteOffline: boolean } }
        setSiteOffline(offlineResponse.data?.siteOffline ?? false);
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate(`${currentPrefix}/login`);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleToggleSiteOffline = async () => {
    try {
      setLoadingOffline(true);
      const response = await adminUpdateSiteOffline(!siteOffline);
      setSiteOffline(response.data.siteOffline);
    } catch (error) {
      console.error('Site offline durumu güncellenemedi:', error);
      alert('Site offline durumu güncellenirken hata oluştu');
    } finally {
      setLoadingOffline(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate(`${currentPrefix}/login`);
  };

    const menuItems = [
    { path: `${currentPrefix}/dashboard`, label: 'Dashboard', icon: 'dashboard' },
    { path: `${currentPrefix}/articles`, label: 'Makaleler', icon: 'article' },
    { path: `${currentPrefix}/services`, label: 'Hizmetler', icon: 'build' },
    { path: `${currentPrefix}/hero-sections`, label: 'Slider', icon: 'image' },
    { path: `${currentPrefix}/about-section`, label: 'Hakkımızda', icon: 'info' },
    { path: `${currentPrefix}/categories`, label: 'Proje Kategorileri', icon: 'category' },
    { path: `${currentPrefix}/projects`, label: 'Projeler', icon: 'work' },
    { path: `${currentPrefix}/brands`, label: 'Markalar & Partnerler', icon: 'branding_watermark' },
    { path: `${currentPrefix}/keywords`, label: 'SEO Anahtar Kelimeler', icon: 'tag' },
    { path: `${currentPrefix}/pages`, label: 'Sayfalar', icon: 'description' },
    { path: `${currentPrefix}/contact-forms`, label: 'İletişim Formları', icon: 'mail' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: isMobile ? (sidebarOpen ? '250px' : '0') : (sidebarOpen ? '250px' : '70px'),
        backgroundColor: '#0a0f1a',
        color: '#ffffff',
        transition: 'width 0.3s, transform 0.3s',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: isMobile && !sidebarOpen ? 'hidden' : 'auto',
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#151b2e',
          position: 'relative',
          gap: '0.5rem',
        }}>
          {sidebarOpen ? (
            <Link
              to="/admin/dashboard"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                flex: 1,
                transition: 'opacity 0.2s',
                fontWeight: 'bold',
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>Nova Agro Admin</h2>
            </Link>
          ) : (
            <Link
              to="/admin/dashboard"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              title="Dashboard"
            >
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? '#ffffff' : '#d1d5db',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#16a34a' : 'transparent',
                  transition: 'all 0.2s',
                  borderLeft: isActive ? '4px solid #ffffff' : '4px solid transparent',
                  fontWeight: isActive ? '700' : '500',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.2)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ marginRight: sidebarOpen ? '0.75rem' : '0', fontSize: '1.25rem' }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span style={{ color: 'inherit' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? '0' : (sidebarOpen ? '250px' : '70px'),
        flex: 1,
        transition: 'margin-left 0.3s',
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? '100%' : 'auto',
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minHeight: '60px',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1d263b',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Toggle sidebar"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            )}
            <div
              onClick={() => navigate('/admin/dashboard')}
              style={{
                textDecoration: 'none',
                color: '#1d263b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.375rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Dashboard'a dön"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', display: 'block' }}>home</span>
            </div>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              color: '#1d263b', 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {menuItems.find(item => item.path === location.pathname || (item.path === '/admin/dashboard' && location.pathname === '/admin'))?.label || 'Admin Panel'}
            </h1>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '0.5rem' : '0.75rem', 
            flexShrink: 0,
            flexWrap: 'wrap',
          }}>
            {/* Site Offline Toggle */}
            <button
              onClick={handleToggleSiteOffline}
              disabled={loadingOffline}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: isMobile ? '0.5rem' : '0.5rem 0.875rem',
                backgroundColor: siteOffline ? '#EF4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loadingOffline ? 'not-allowed' : 'pointer',
                fontSize: isMobile ? '0.75rem' : '0.8125rem',
                fontWeight: 500,
                opacity: loadingOffline ? 0.7 : 1,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!loadingOffline) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingOffline) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              title={siteOffline ? 'Siteyi Aktif Et' : 'Siteyi Bakım Moduna Al'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '1rem' : '1.125rem' }}>
                {siteOffline ? 'power_off' : 'power'}
              </span>
              {!isMobile && (siteOffline ? 'Site Kapalı' : 'Site Aktif')}
            </button>
            
            {user && !isMobile && (
              <span style={{ 
                color: 'var(--office-gray)', 
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px',
              }}>
                {user.email}
              </span>
            )}
            {!isMobile && (
              <Link
                to="/"
                target="_blank"
                style={{
                  color: '#16a34a',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.875rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>open_in_new</span>
              <span style={{ whiteSpace: 'nowrap' }}>Siteyi Görüntüle</span>
            </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: isMobile ? '0.5rem' : '0.5rem 0.875rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EF4444';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '1rem' : '1.125rem' }}>logout</span>
              {!isMobile && <span style={{ whiteSpace: 'nowrap' }}>Çıkış</span>}
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : '2rem',
          overflow: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

