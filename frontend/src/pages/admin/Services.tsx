import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetServices, adminDeleteService, adminToggleServiceVisible, type Service } from '../../services/adminApi';

function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await adminGetServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    try {
      await adminDeleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      alert('Hizmet silinirken hata oluştu');
    }
  };

  const handleToggleVisible = async (id: number) => {
    try {
      const response = await adminToggleServiceVisible(id);
      setServices(services.map(s => s.id === id ? { ...s, visible: response.data.visible } : s));
    } catch (error) {
      alert('Görünürlük değiştirilirken hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <Link
          to="/admin/services/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#16a34a',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#15803d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#16a34a';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add</span>
          Yeni Hizmet
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {services.map((service) => (
          <div key={service.id} style={{
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
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ margin: 0, color: 'var(--office-gray)' }}>{service.description}</p>
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
              <Link
                to={`/admin/services/${service.id}`}
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
                onClick={() => handleToggleVisible(service.id!)}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: service.visible !== false ? '#10b981' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title={service.visible !== false ? 'Göster (Aktif)' : 'Gizle (Pasif)'}
              >
                <span className="material-symbols-outlined">
                  {service.visible !== false ? 'visibility' : 'visibility_off'}
                </span>
              </button>
              <button
                onClick={() => handleDelete(service.id!)}
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
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminServices;

