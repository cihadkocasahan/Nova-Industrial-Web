import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminGetArticles,
  adminDeleteArticle,
  adminToggleArticleVisible,
  type Article,
} from '../../services/adminApi';

function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await adminGetArticles(50, 0);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return;
    
    try {
      await adminDeleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('Makale silinirken hata oluştu');
    }
  };

  const handleToggleVisible = async (id: number) => {
    try {
      const response = await adminToggleArticleVisible(id);
      setArticles(articles.map(a => a.id === id ? { ...a, visible: response.data.visible } : a));
    } catch (error) {
      alert('Görünürlük değiştirilirken hata oluştu');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <Link
          to="/admin/articles/new"
          style={{
            background: 'var(--power-blue)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Makale
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Başlık</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Slug</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Kategori</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Yayın Tarihi</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Görünür</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '1rem' }}>{article.title}</td>
                <td style={{ padding: '1rem', color: 'var(--office-gray)' }}>{article.slug}</td>
                <td style={{ padding: '1rem' }}>{article.category?.name || '-'}</td>
                <td style={{ padding: '1rem' }}>
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('tr-TR') : 'Yayınlanmadı'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleVisible(article.id!)}
                    style={{
                      padding: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: article.visible !== false ? '#10b981' : '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                    }}
                    title={article.visible !== false ? 'Göster (Aktif)' : 'Gizle (Pasif)'}
                  >
                    <span className="material-symbols-outlined">
                      {article.visible !== false ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link
                      to={`/admin/articles/${article.id}`}
                      style={{
                        padding: '0.5rem',
                        color: 'var(--power-blue)',
                        textDecoration: 'none',
                      }}
                      title="Düzenle"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id!)}
                      style={{
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--power-red)',
                        cursor: 'pointer',
                      }}
                      title="Sil"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminArticles;

