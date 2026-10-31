import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetCategory, adminCreateCategory, adminUpdateCategory } from '../../services/adminApi';
import type { Category } from '../../types';

function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && id) {
      loadCategory();
    }
  }, [id, isEdit]);

  const loadCategory = async () => {
    try {
      const response = await adminGetCategory(parseInt(id!));
      const category = response.data;
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
      });
    } catch (error) {
      console.error('Error loading category:', error);
      alert('Kategori yüklenirken hata oluştu');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from name if name changed and slug is empty or matches previous name-based slug
      if (name === 'name') {
        const currentSlug = prev.slug;
        const nameBasedSlug = generateSlug(value);
        
        // Only auto-generate if slug is empty or matches the previous name-based slug
        if (!currentSlug || currentSlug === generateSlug(prev.name)) {
          updated.slug = nameBasedSlug;
        }
      }
      
      return updated;
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı zorunludur';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug zorunludur';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug sadece küçük harf, rakam ve tire içerebilir';
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
      if (isEdit) {
        await adminUpdateCategory(parseInt(id!), formData);
        alert('Kategori güncellendi');
      } else {
        await adminCreateCategory(formData);
        alert('Kategori oluşturuldu');
      }
      navigate('/admin/categories');
    } catch (error: any) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || 'Kategori kaydedilirken hata oluştu';
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
          to="/admin/categories"
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
          Kategorilere Dön
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1d263b' }}>
          {isEdit ? 'Kategori Düzenle' : 'Yeni Kategori'}
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
              Kategori Adı *
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
              placeholder="Örn: Teknoloji, Sağlık..."
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
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.slug ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
              placeholder="ornek-kategori-adi"
            />
            {errors.slug && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.slug}
              </div>
            )}
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              URL'de kullanılacak: /category/{formData.slug || 'ornek-kategori-adi'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              placeholder="Kategori hakkında kısa bir açıklama..."
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
          }}>
            <Link
              to="/admin/categories"
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

export default CategoryForm;

