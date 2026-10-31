import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectsByCategorySlug, getCategoryById, getCategories } from '../services/api';
import ProjectModal from '../components/ProjectModal';
import { sanitizeHtml } from '../utils/sanitize';
import Loading from '../components/Loading';
import type { Project, Category } from '../types';

function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Sayfa yüklendiğinde scroll'u en üste getir
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getProjectsByCategorySlug(slug!);
      setProjects(response.data);
      
      // Get category from meta or find it from categories
      const meta = response.meta as { category?: Category };
      if (meta?.category) {
        setCategory(meta.category);
      } else {
        const categoriesResponse = await getCategories();
        const foundCategory = categoriesResponse.data.find(c => c.slug === slug);
        if (foundCategory) {
          setCategory(foundCategory);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Projeler yükleniyor..." />;
  }

  const seoTitle = category ? `${category.name} - Endüstriyel Projeler | NOVA INDUSTRIAL` : 'Projeler | NOVA INDUSTRIAL';
  const seoDescription = category 
    ? `${category.name} mühendislik ve otomasyon projeleri. ${category.description || ''} Endüstri standartlarında yüksek güvenilirlikli çözümler.`
    : 'Endüstriyel otomasyon ve mühendislik projelerimiz. NOVA INDUSTRIAL ile iletişime geçin.';
  const seoKeywords = category 
    ? `${category.name}, endüstriyel otomasyon, SCADA, mühendislik projeleri, NOVA INDUSTRIAL`
    : 'Endüstriyel projeler, otomasyon, SCADA, mühendislik';

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`${window.location.origin}/category/${slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${window.location.origin}/category/${slug}`} />
      </Helmet>

      <div style={{ 
        padding: '4rem 0', 
        minHeight: 'calc(100vh - 75px)',
        scrollBehavior: 'smooth',
      }}>
      <div className="container" style={{ scrollMarginTop: '95px' }}>
        {/* Geri Butonu */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--office-green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--office-green-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--office-green)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
              arrow_back
            </span>
            Geri Dön
          </button>
        </div>

        {category && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'var(--office-dark-gray)',
              marginBottom: '1rem',
            }}>
              {category.name}
            </h1>
            {category.description && (
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--office-gray)',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {category.description}
              </p>
            )}
          </div>
        )}

        {projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--office-gray)',
          }}>
            Bu kategoride henüz proje bulunmamaktadır.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem',
          }}>
            {projects.map((project) => {
              // Ana resmi belirle (project.image veya images'ın ilki)
              const mainImage = project.image || 
                (project.images && project.images.length > 0 ? project.images[0].imageUrl : null);
              
              return (
              <Link
                key={project.id}
                to={project.slug ? `/proje/${project.slug}` : '#'}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onClick={(e) => {
                  if (!project.slug) {
                    e.preventDefault();
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }
                }}
              >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {mainImage && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    position: 'relative',
                  }}>
                    <img
                      src={mainImage}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Resim sayısı göstergesi */}
                    {(project.images && project.images.length > 0) && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                          photo_library
                        </span>
                        <span>{project.images.length + (project.image ? 0 : 1)}</span>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--office-dark-gray)',
                    marginBottom: '0.75rem',
                    margin: 0,
                  }}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <p style={{
                      fontSize: '1rem',
                      color: 'var(--office-gray)',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                      margin: 0,
                    }}>
                      {project.description}
                    </p>
                  )}
                  {project.location && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--office-gray)',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                        location_on
                      </span>
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.content && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--office-gray)',
                        lineHeight: '1.6',
                      }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }}
                    />
                  )}
                </div>
              </div>
              </Link>
            )})}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
      </div>
    </>
  );
}

export default CategoryDetail;

