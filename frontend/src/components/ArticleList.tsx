import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
  limit?: number;
}

function ArticleList({ articles, limit = 6 }: ArticleListProps) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const displayArticles = safeArticles.slice(0, limit);

  if (displayArticles.length === 0) {
    return (
      <section id="articles" className="section" style={{
        padding: '2.5rem 0 4.5rem 0',
        backgroundColor: '#f8fafc',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--gray-900, #0f172a)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              AgTech Bilgi Merkezi & Makaleler
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--gray-600, #64748b)',
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              Henüz makale eklenmemiş.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="section" style={{
      padding: '3rem 0 5rem 0',
      backgroundColor: '#f8fafc',
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--gray-900, #0f172a)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            AgTech Bilgi Merkezi & Makaleler
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--gray-600, #64748b)',
            maxWidth: '580px',
            margin: '0 auto',
          }}>
            Hassas tarım, zirai drone teknolojileri, toprak analizi ve modern sera yönetimi üzerine teknik rehberler
          </p>
        </div>
        
        {/* Uniform Article Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
        }}>
          {displayArticles.map((article) => (
            <article 
              key={article.id} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              {/* Fixed Aspect-Ratio Image Container */}
              <div style={{
                width: '100%',
                height: '210px',
                aspectRatio: '16 / 10',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                position: 'relative',
                flexShrink: 0
              }}>
                <img 
                  src={article.featuredImage || '/articles/placeholder-drone.svg'} 
                  alt={article.title}
                  loading="lazy"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.35s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.78)',
                  backdropFilter: 'blur(4px)',
                  color: '#f8fafc',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  letterSpacing: '0.5px'
                }}>
                  Ziraat Rehberi
                </span>
              </div>

              {/* Card Body */}
              <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--gray-900, #0f172a)',
                    marginBottom: '0.6rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.8em'
                  }}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p style={{
                      color: 'var(--gray-600, #64748b)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '4.8em'
                    }}>
                      {article.excerpt}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link 
                    to={`/articles/${article.slug}`} 
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      padding: '0.6rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      borderRadius: '8px'
                    }}
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticleList;
