import { useState, useEffect } from 'react';

interface ImageSliderProps {
  images: string[];
  projectTitle: string;
  onImageClick: () => void;
}

function ImageSlider({ images, projectTitle, onImageClick }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {/* Slider Track */}
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        transform: `translateX(-${currentSlide * 100}%)`,
        transition: 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              minWidth: '100%',
              width: '100%',
              height: '100%',
              flexShrink: 0,
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={onImageClick}
          >
            <img
              src={image}
              alt={`${projectTitle} - Resim ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--office-green)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              zIndex: 10,
              transition: 'all 0.3s',
              boxShadow: 'var(--shadow-lg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--office-green)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              zIndex: 10,
              transition: 'all 0.3s',
              boxShadow: 'var(--shadow-lg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      )}

      {/* Slider Indicators */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.75rem',
          zIndex: 10,
        }}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              style={{
                width: currentSlide === index ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'width 0.3s, background-color 0.3s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Click to view fullscreen hint */}
      {images.length > 0 && (
        <div
          onClick={onImageClick}
          style={{
            position: 'absolute',
            bottom: images.length > 1 ? '4.5rem' : '2rem',
            right: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            zIndex: 10,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
            fullscreen
          </span>
          <span>Tam Ekran</span>
        </div>
      )}
    </div>
  );
}

export default ImageSlider;

