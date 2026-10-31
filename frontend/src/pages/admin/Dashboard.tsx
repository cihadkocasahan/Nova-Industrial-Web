import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  adminGetArticles,
  adminGetServices,
  adminGetHeroSections,
  adminGetCategories,
  adminGetPages,
  adminGetContactForms,
  adminGetProjects,
  adminGetBrands,
} from '../../services/adminApi';

function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    services: 0,
    heroSections: 0,
    categories: 0,
    pages: 0,
    contactForms: 0,
    projects: 0,
    brands: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const currentPrefix = location.pathname.startsWith('/kokpit')
    ? '/kokpit'
    : location.pathname.startsWith('/agro-kokpit')
      ? '/agro-kokpit'
      : '/admin';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articles, services, heroSections, categories, pages, contactForms, projects, brands] = await Promise.all([
          adminGetArticles(1, 0),
          adminGetServices(),
          adminGetHeroSections(),
          adminGetCategories(),
          adminGetPages(),
          adminGetContactForms(1, 0),
          adminGetProjects(),
          adminGetBrands(),
        ]);

        setStats({
          articles: articles?.meta?.total ?? articles?.data?.length ?? 0,
          services: services?.meta?.total ?? services?.data?.length ?? 0,
          heroSections: heroSections?.meta?.total ?? heroSections?.data?.length ?? 0,
          categories: categories?.meta?.total ?? categories?.data?.length ?? 0,
          pages: pages?.meta?.total ?? pages?.data?.length ?? 0,
          contactForms: contactForms?.meta?.total ?? contactForms?.data?.length ?? 0,
          projects: projects?.meta?.total ?? projects?.data?.length ?? 0,
          brands: brands?.meta?.total ?? brands?.data?.length ?? 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Makaleler', value: stats.articles, path: `${currentPrefix}/articles`, icon: 'article', color: '#16a34a' },
    { label: 'Hizmetler', value: stats.services, path: `${currentPrefix}/services`, icon: 'build', color: '#15803d' },
    { label: 'Ana Bölüm', value: stats.heroSections, path: `${currentPrefix}/hero-sections`, icon: 'image', color: '#047857' },
    { label: 'Proje Kategorileri', value: stats.categories, path: `${currentPrefix}/categories`, icon: 'category', color: '#059669' },
    { label: 'Projeler', value: stats.projects, path: `${currentPrefix}/projects`, icon: 'work', color: '#0d9488' },
    { label: 'Markalar & Partnerler', value: stats.brands, path: `${currentPrefix}/brands`, icon: 'branding_watermark', color: '#10b981' },
    { label: 'Sayfalar', value: stats.pages, path: `${currentPrefix}/pages`, icon: 'description', color: '#84cc16' },
    { label: 'İletişim Formları', value: stats.contactForms, path: `${currentPrefix}/contact-forms`, icon: 'mail', color: '#d97706' },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '1rem' : '1.5rem',
      }}>
        {statCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                {card.icon}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1.85rem',
                fontWeight: 'bold',
                color: 'var(--office-dark-gray)',
                lineHeight: 1.2,
              }}>
                {card.value}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--office-gray)',
                marginTop: '0.2rem',
              }}>
                {card.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
