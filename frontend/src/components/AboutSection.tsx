import { useEffect, useState } from 'react';
import { getAboutSection } from '../services/api';
import { mockAboutSection } from '../services/mockData';
import type { AboutSection as AboutSectionType } from '../types';
import { sanitizeHtml } from '../utils/sanitize';

function AboutSection() {
  const [aboutSection, setAboutSection] = useState<AboutSectionType>(mockAboutSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutSection = async () => {
      try {
        const response = await getAboutSection();
        if (response.data && response.data.visible !== false) {
          setAboutSection(response.data);
        } else {
          setAboutSection(mockAboutSection);
        }
      } catch (error) {
        console.warn('About section fetch error, using Nova Agro fallback:', error);
        setAboutSection(mockAboutSection);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSection();
  }, []);

  if (loading && !aboutSection) {
    return null;
  }

  const activeAbout = aboutSection || mockAboutSection;

  return (
    <section id="about" className="about-section" style={{
      padding: '5rem 2rem',
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #f3f4f6',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              color: '#15803d',
              backgroundColor: '#f0fdf4',
              border: '1px solid #dcfce7',
              fontWeight: 700,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem',
            }}
          >
            Hakkımızda
          </span>
          <h2 style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: '#111827',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            {activeAbout.title}
          </h2>
        </div>
        <div 
          className="about-content"
          style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-relaxed)',
            color: 'var(--text-color)',
            maxWidth: '900px',
            margin: '0 auto',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeAbout.content) }}
        />
      </div>
    </section>
  );
}

export default AboutSection;
