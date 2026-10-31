import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetCategories, adminDeleteCategory, adminToggleCategoryVisible, type Category } from '../../services/adminApi';

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminGetCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await adminDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert('Kategori silinirken hata oluştu');
    }
  };

  const handleToggleVisible = async (id: number) => {
    try {
      const response = await adminToggleCategoryVisible(id);
      setCategories(categories.map(c => c.id === id ? response.data : c));
    } catch (error) {
      alert('Görünürlük durumu değiştirilirken hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <Link
          to="/admin/categories/new"
          style={{
            background: '#16a34a',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span className="material-symbols-outlined">add</span> Yeni Kategori
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {categories.map((category) => (
          <div key={category.id} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'visible',
            position: 'relative',
          }}>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', maxWidth: 'calc(100% - 150px)' }}>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{category.name}</h3>
              <p style={{ margin: 0, color: 'var(--office-gray)' }}>Slug: {category.slug}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--office-gray)', marginTop: '0.5rem' }}>
                <span style={{
                  color: category.visible !== false ? '#10b981' : '#9ca3af',
                  fontWeight: 500,
                }}>
                  {category.visible !== false ? 'Görünür' : 'Gizli'}
                </span>
                {category.visible === false && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                    ⚠️ Kategori gizliyse altındaki projeler de görünmez
                  </span>
                )}
              </div>
              {category.description && (
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--office-gray)', fontSize: '0.875rem' }}>
                  {category.description}
                </p>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              alignItems: 'center',
              flexShrink: 0,
              flexGrow: 0,
              minWidth: '120px',
              zIndex: 10,
              position: 'relative',
            }}>
              <button
                onClick={() => handleToggleVisible(category.id!)}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: category.visible !== false ? '#10b981' : '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title={category.visible !== false ? 'Göster (Aktif)' : 'Gizle (Pasif)'}
              >
                <span className="material-symbols-outlined">
                  {category.visible !== false ? 'visibility' : 'visibility_off'}
                </span>
              </button>
              <Link
                to={`/admin/categories/${category.id}/edit`}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#16a34a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title="Düzenle"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
              </Link>
              <button
                onClick={() => handleDelete(category.id!)}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title="Sil"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;

