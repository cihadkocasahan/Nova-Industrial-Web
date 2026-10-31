import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectBySlug } from '../services/api';
import ProjectModal from '../components/ProjectModal';
import { sanitizeHtml } from '../utils/sanitize';
import ImageSlider from '../components/ImageSlider';
import Loading from '../components/Loading';
import type { Project } from '../types';

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Sayfa yüklendiğinde scroll'u en üste getir
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await getProjectBySlug(slug!);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Proje yükleniyor..." />;
  }

  if (!project) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Proje Bulunamadı</h2>
        <Link to="/" style={{ color: '#16a34a', textDecoration: 'none' }}>
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Tüm resimleri topla (slider için)
  const allImages: string[] = [];
  
  // Ana resmi ekle
  if (project.image) {
    allImages.push(project.image);
  }
  
  // Project images array'inden resimleri ekle
  if (project.images && project.images.length > 0) {
    project.images.forEach((img) => {
      const imageUrl = typeof img === 'string' ? img : img.imageUrl;
      if (imageUrl && !allImages.includes(imageUrl)) {
        allImages.push(imageUrl);
      }
    });
  }
  
  // Content HTML'inden resimleri extract et
  if (project.content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(project.content, 'text/html');
    const imgElements = doc.querySelectorAll('img');
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !allImages.includes(src)) {
        // Relative URL'leri absolute yap
        const absoluteSrc = src.startsWith('http') || src.startsWith('//') 
          ? src 
          : `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`;
        allImages.push(absoluteSrc);
      }
    });
  }
  
  const mainImage = allImages.length > 0 ? allImages[0] : null;
  
  // Content'ten img tag'lerini kaldır (slider'da gösterilecek)
  const getContentWithoutImages = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgElements = doc.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
    return doc.body.innerHTML;
  };
  
  const cleanedContent = project.content ? getContentWithoutImages(project.content) : '';

  const seoTitle = project.seoTitle || `${project.title} | Nova Agro AgTech & Ziraat Mühendisliği`;
  const seoDescription = project.seoDescription || project.description || `${project.title} - Ziraat mühendisliği ve ileri AgTech çözümleri. Nova Agro ile iletişime geçin.`;
  const seoKeywords = project.seoKeywords || `Zirai drone, akıllı tarım, ${project.location || ''}, AgTech projesi, Nova Agro`;

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
        {mainImage && <meta property="og:image" content={mainImage} />}
        <meta property="og:url" content={`${window.location.origin}/proje/${project.slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {mainImage && <meta name="twitter:image" content={mainImage} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${window.location.origin}/proje/${project.slug}`} />
      </Helmet>

      <div style={{ 
        padding: '2rem 0',
        minHeight: 'calc(100vh - 75px)',
        scrollBehavior: 'smooth',
      }}>
        {/* Breadcrumb */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem auto',
          padding: '0 1rem',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          <Link 
            to="/" 
            style={{ 
              color: 'var(--office-green)', 
              textDecoration: 'none',
              transition: 'color var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--office-green-dark)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--office-green)';
            }}
          >
            Ana Sayfa
          </Link>
          {' / '}
          {project.category && (
            <>
              <Link 
                to={`/category/${project.category.slug}`} 
                style={{ 
                  color: 'var(--office-green)', 
                  textDecoration: 'none',
                  transition: 'color var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--office-green-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--office-green)';
                }}
              >
                {project.category.name}
              </Link>
              {' / '}
            </>
          )}
          <span style={{ color: 'var(--gray-600)' }}>{project.title}</span>
        </div>

        {/* Project Header */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1d263b',
            marginBottom: '1rem',
          }}>
            {project.title}
          </h1>

          {project.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              color: '#6b7280',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>location_on</span>
              <span>{project.location}</span>
            </div>
          )}

          {project.description && (
            <p style={{
              fontSize: '1.125rem',
              color: '#4b5563',
              marginBottom: '2rem',
              lineHeight: '1.75',
            }}>
              {project.description}
            </p>
          )}

          {/* Image Slider */}
          {allImages.length > 0 && (
            <div style={{
              marginBottom: '2rem',
              position: 'relative',
            }}>
              <ImageSlider 
                images={allImages} 
                projectTitle={project.title}
                onImageClick={() => {
                  setSelectedProject(project);
                  setIsModalOpen(true);
                }}
              />
            </div>
          )}

          {/* Content */}
          {cleanedContent && (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(cleanedContent) }}
              style={{
                fontSize: '1rem',
                lineHeight: '1.75',
                color: '#374151',
              }}
            />
          )}
        </div>
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
    </>
  );
}

export default ProjectDetail;

