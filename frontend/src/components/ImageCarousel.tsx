import { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  title?: string;
}

function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
    }}>
      {title && (
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'white',
          marginBottom: '1rem',
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          padding: '0 1rem',
        }}>
          {title}
        </h3>
      )}
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        maxHeight: '80vh',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        boxSizing: 'border-box',
      }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${title || 'Image'} ${index + 1}`}
            onError={(e) => {
              console.error('Image load error:', image);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              backgroundColor: '#000',
              display: 'block',
              margin: '0 auto',
            }}
          />
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                zIndex: 10,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                zIndex: 10,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
          }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentIndex === index ? '24px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'width 0.2s, background-color 0.2s',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'var(--office-gray)',
          fontSize: '0.875rem',
        }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;

