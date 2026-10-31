import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetService, adminCreateService, adminUpdateService } from '../../services/adminApi';
import type { Service } from '../../types';

function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    iconText: '',
    order: '0',
    visible: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && id) {
      loadService();
    }
  }, [id, isEdit]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await adminGetService(parseInt(id!));
      const service = response.data;
      setFormData({
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || '',
        iconText: service.iconText || '',
        order: service.order?.toString() || '0',
        visible: service.visible !== undefined ? service.visible : true,
      });
    } catch (error) {
      console.error('Error loading service:', error);
      alert('Hizmet yüklenirken hata oluştu');
      navigate('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? value : value),
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setSaving(true);
      const serviceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || undefined,
        iconText: formData.iconText.trim() || undefined,
        order: parseInt(formData.order) || 0,
        visible: formData.visible,
      };
      
      if (isEdit && id) {
        await adminUpdateService(parseInt(id), serviceData);
      } else {
        await adminCreateService(serviceData);
      }
      
      navigate('/admin/services');
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error.response?.data?.error || 'Hizmet kaydedilirken hata oluştu';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #16a34a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <p>Yükleniyor...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/admin/services"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#16a34a',
            textDecoration: 'none',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
            arrow_back
          </span>
          Hizmetlere Dön
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1d263b' }}>
          {isEdit ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        {/* Başlık */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1d263b',
            fontSize: '0.875rem',
          }}>
            Başlık <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Örn: Elektrik Tesisatı"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.title ? '1px solid #EF4444' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.title ? '#EF4444' : '#e0e0e0';
            }}
          />
          {errors.title && (
            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Açıklama */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1d263b',
            fontSize: '0.875rem',
          }}>
            Açıklama <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Hizmet hakkında detaylı açıklama..."
            rows={5}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.description ? '1px solid #EF4444' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.description ? '#EF4444' : '#e0e0e0';
            }}
          />
          {errors.description && (
            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Icon (Material Symbol) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1d263b',
            fontSize: '0.875rem',
          }}>
            Icon (Material Symbol Name)
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="Örn: bolt, settings, engineering"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
            Material Symbols icon adı. Örn: bolt, settings, engineering. Boş bırakılabilir.
          </p>
        </div>

        {/* Icon Text (Fallback) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1d263b',
            fontSize: '0.875rem',
          }}>
            Icon Text (Fallback)
          </label>
          <input
            type="text"
            name="iconText"
            value={formData.iconText}
            onChange={handleChange}
            placeholder="Örn: ⚡, ⚙️, 🔧"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
            Icon yüklenemezse gösterilecek emoji veya metin. Boş bırakılabilir.
          </p>
        </div>

        {/* Sıra */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1d263b',
            fontSize: '0.875rem',
          }}>
            Sıra
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="0"
            min="0"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
            Görüntülenme sırası. Düşük sayılar önce gösterilir.
          </p>
        </div>

        {/* Görünür */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontWeight: 600, color: '#1d263b', fontSize: '0.875rem' }}>
              Görünür (Anasayfada göster)
            </span>
          </label>
        </div>

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e0e0e0',
        }}>
          <Link
            to="/admin/services"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#1d263b',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: saving ? '#9ca3af' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#15803d';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }
            }}
          >
            {saving ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Kaydediliyor...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                  {isEdit ? 'save' : 'add'}
                </span>
                {isEdit ? 'Güncelle' : 'Ekle'}
              </>
            )}
          </button>
        </div>
      </form>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ServiceForm;

