import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetArticle, adminCreateArticle, adminUpdateArticle, adminGetCategories } from '../../services/adminApi';
import RichTextEditor from '../../components/RichTextEditor';
import type { Article, Category } from '../../types';

function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    publishedAt: '',
    visible: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategories();
    if (isEdit && id) {
      loadArticle();
    }
  }, [id, isEdit]);

  const loadCategories = async () => {
    try {
      const response = await adminGetCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadArticle = async () => {
    try {
      const response = await adminGetArticle(parseInt(id!));
      const article = response.data;
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        featuredImage: article.featuredImage || '',
        categoryId: article.categoryId?.toString() || '',
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : '',
        visible: article.visible !== undefined ? article.visible : true,
      });
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Makale yüklenirken hata oluştu');
      navigate('/admin/articles');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from title if title changed and slug is empty or matches previous name-based slug
      if (name === 'title') {
        const currentSlug = prev.slug;
        const nameBasedSlug = generateSlug(value);
        
        // Only auto-generate if slug is empty or matches the previous name-based slug
        if (!currentSlug || currentSlug === generateSlug(prev.title)) {
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug zorunludur';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug sadece küçük harf, rakam ve tire içerebilir';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'İçerik zorunludur';
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
      const articleData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        featuredImage: formData.featuredImage.trim() || null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        visible: formData.visible,
      };
      
      if (isEdit) {
        await adminUpdateArticle(parseInt(id!), articleData);
        alert('Makale güncellendi');
      } else {
        await adminCreateArticle(articleData);
        alert('Makale oluşturuldu');
      }
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      const errorMessage = error.response?.data?.error || 'Makale kaydedilirken hata oluştu';
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
          to="/admin/articles"
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
          Makalelere Dön
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1d263b' }}>
          {isEdit ? 'Makale Düzenle' : 'Yeni Makale'}
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
              Başlık *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.title ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="Makale başlığı..."
            />
            {errors.title && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.title}
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
              placeholder="ornek-makale-basligi"
            />
            {errors.slug && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.slug}
              </div>
            )}
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              URL'de kullanılacak: /article/{formData.slug || 'ornek-makale-basligi'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Kategori
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Özet
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
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
              placeholder="Makale özeti (kısa açıklama)..."
            />
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Makale listesinde gösterilecek kısa özet
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              İçerik *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, content: value }));
                if (errors.content) {
                  setErrors(prev => ({ ...prev, content: '' }));
                }
              }}
              placeholder="Makale içeriği..."
              error={errors.content}
              height={500}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Öne Çıkan Resim URL
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Yayın Tarihi
            </label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Boş bırakılırsa taslak olarak kalır
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
                name="visible"
                checked={formData.visible}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, visible: e.target.checked }));
                }}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontWeight: '600', color: '#1d263b' }}>
                Görünür
              </span>
            </label>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
              Aktif olan makaleler frontend'de gösterilir
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
          }}>
            <Link
              to="/admin/articles"
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

export default ArticleForm;

