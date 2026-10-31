import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetBrand, adminCreateBrand, adminUpdateBrand } from '../../services/adminApi';
import type { Brand } from '../../types';

function BrandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    order: 0,
    active: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && id) {
      loadBrand();
    }
  }, [id, isEdit]);

  const loadBrand = async () => {
    try {
      const response = await adminGetBrand(parseInt(id!));
      const brand = response.data;
      setFormData({
        name: brand.name || '',
        logoUrl: brand.logoUrl || '',
        websiteUrl: brand.websiteUrl || '',
        order: brand.order || 0,
        active: brand.active !== undefined ? brand.active : true,
      });
    } catch (error) {
      console.error('Error loading brand:', error);
      alert('Marka yüklenirken hata oluştu');
      navigate('/admin/brands');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value),
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Marka adı zorunludur';
    }
    
    if (!formData.logoUrl.trim()) {
      newErrors.logoUrl = 'Logo URL zorunludur';
    } else if (!/^https?:\/\/.+/.test(formData.logoUrl)) {
      newErrors.logoUrl = 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)';
    }
    
    if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSaving(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim(),
        websiteUrl: formData.websiteUrl.trim() || null,
        order: formData.order,
        active: formData.active,
      };
      
      if (isEdit) {
        await adminUpdateBrand(parseInt(id!), submitData);
        alert('Marka güncellendi');
      } else {
        await adminCreateBrand(submitData);
        alert('Marka oluşturuldu');
      }
      navigate('/admin/brands');
    } catch (error: any) {
      console.error('Error saving brand:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Marka kaydedilirken hata oluştu';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/admin/brands"
          style={{
            color: '#16a34a',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Markalara Dön
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1d263b' }}>
          {isEdit ? 'Marka Düzenle' : 'Yeni Marka'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Marka Adı *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.name ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="Örn: Schneider Electric, ABB..."
            />
            {errors.name && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Logo URL *
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.logoUrl ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="https://example.com/logo.png"
            />
            {errors.logoUrl && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.logoUrl}
              </div>
            )}
            {formData.logoUrl && !errors.logoUrl && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Logo Önizleme:</div>
                <div style={{
                  width: '150px',
                  height: '80px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #e5e7eb',
                  overflow: 'hidden',
                }}>
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span style="color: #9ca3af; font-size: 0.75rem;">Logo yüklenemedi</span>';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Web Sitesi URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.websiteUrl ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="https://www.example.com"
            />
            {errors.websiteUrl && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.websiteUrl}
              </div>
            )}
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Boş bırakılabilir
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Sıra
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="0"
            />
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Markaların gösterim sırası (küçükten büyüğe)
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontWeight: '600', color: '#1d263b' }}>
                Aktif
              </span>
            </label>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
              Aktif olan markalar frontend'de gösterilir
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
          }}>
            <Link
              to="/admin/brands"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#666',
                border: '2px solid #e0e0e0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: saving ? '#999' : '#16a34a',
                color: 'white',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>
                    refresh
                  </span>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  {isEdit ? 'Güncelle' : 'Oluştur'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandForm;

