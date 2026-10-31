import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetBrands, adminDeleteBrand, adminToggleBrandVisible, type Brand } from '../../services/adminApi';

function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await adminGetBrands();
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu markayı silmek istediğinize emin misiniz?')) return;
    try {
      await adminDeleteBrand(id);
      setBrands(brands.filter(b => b.id !== id));
    } catch (error) {
      alert('Marka silinirken hata oluştu');
    }
  };

  const handleToggleVisible = async (id: number) => {
    try {
      const response = await adminToggleBrandVisible(id);
      setBrands(brands.map(b => b.id === id ? response.data : b));
    } catch (error) {
      alert('Görünürlük durumu değiştirilirken hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <Link
          to="/admin/brands/new"
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
          <span className="material-symbols-outlined">add</span> Yeni Marka
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {brands.map((brand) => (
          <div key={brand.id} style={{
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0, overflow: 'hidden', maxWidth: 'calc(100% - 150px)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '2px solid #e5e7eb',
              }}>
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span style="color: #9ca3af; font-size: 0.75rem;">Logo</span>`;
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{brand.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--office-gray)' }}>
                  <span>Sıra: {brand.order}</span>
                  <span style={{
                    color: brand.active ? '#10b981' : '#ef4444',
                    fontWeight: 500,
                  }}>
                    {brand.active ? 'Aktif' : 'Pasif'}
                  </span>
                  <span style={{
                    color: brand.visible !== false ? '#10b981' : '#9ca3af',
                    fontWeight: 500,
                  }}>
                    {brand.visible !== false ? 'Görünür' : 'Gizli'}
                  </span>
                  {brand.websiteUrl && (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#16a34a', textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Web Sitesi →
                    </a>
                  )}
                </div>
              </div>
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
                onClick={() => handleToggleVisible(brand.id!)}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: brand.visible !== false ? '#10b981' : '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title={brand.visible !== false ? 'Göster (Aktif)' : 'Gizle (Pasif)'}
              >
                <span className="material-symbols-outlined">
                  {brand.visible !== false ? 'visibility' : 'visibility_off'}
                </span>
              </button>
              <Link
                to={`/admin/brands/${brand.id}/edit`}
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
                onClick={() => handleDelete(brand.id!)}
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

export default AdminBrands;

