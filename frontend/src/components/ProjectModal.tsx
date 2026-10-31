import { useState, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';
import type { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      // Tüm resimleri topla
      const allImages: string[] = [];
      
      // Ana resmi ekle (varsa)
      if (project.image) {
        allImages.push(project.image);
      }
      
      // Ek resimleri ekle
      if (project.images && Array.isArray(project.images) && project.images.length > 0) {
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
            if (!allImages.includes(absoluteSrc)) {
              allImages.push(absoluteSrc);
            }
          }
        });
      }
      
      setImages(allImages);
    } else {
      setImages([]);
    }
  }, [project]);

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'transparent',
          borderRadius: '12px',
          maxWidth: '1400px',
          width: '100%',
          maxHeight: '95vh',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            zIndex: 1000,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span>
        </button>

        {/* Sadece Carousel - İçerik Yok */}
        {images.length > 0 ? (
          <div style={{ 
            width: '100%', 
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImageCarousel images={images} title={project.title} />
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--office-gray)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>
              image_not_supported
            </span>
            <p>Bu proje için resim bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectModal;

