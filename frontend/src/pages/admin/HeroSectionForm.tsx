import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  adminGetHeroSection, 
  adminCreateHeroSection, 
  adminUpdateHeroSection 
} from '../../services/adminApi';
import type { HeroSection } from '../../services/adminApi';
import RichTextEditor from '../../components/RichTextEditor';
import FileUpload from '../../components/FileUpload';
import Toast, { type ToastType } from '../../components/Toast';

function HeroSectionForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    backgroundImage: '',
    active: false,
    order: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    if (id) {
      loadHeroSection(Number(id));
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadHeroSection = async (heroId: number) => {
    try {
      setLoading(true);
      const response = await adminGetHeroSection(heroId);
      if (response.data) {
        setHeroSection(response.data);
        setFormData({
          title: response.data.title || '',
          subtitle: response.data.subtitle || '',
          description: response.data.description || '',
          ctaText: response.data.ctaText || '',
          ctaLink: response.data.ctaLink || '',
          backgroundImage: response.data.backgroundImage || '',
          active: response.data.active || false,
          order: response.data.order || 0,
        });
        setUploadMode(response.data.backgroundImage ? 'url' : 'url');
      }
    } catch (error: any) {
      console.error('Error loading hero section:', error);
      showToast('Slide yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => {
      setToast({ ...toast, isOpen: false });
    }, 3000);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
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
      const heroData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        description: formData.description.trim() || undefined,
        ctaText: formData.ctaText.trim() || undefined,
        ctaLink: formData.ctaLink.trim() || undefined,
        backgroundImage: formData.backgroundImage.trim() || undefined,
        active: formData.active,
        order: formData.order,
      };
      
      if (heroSection && heroSection.id) {
        await adminUpdateHeroSection(heroSection.id, heroData);
        showToast('Slide başarıyla güncellendi', 'success');
      } else {
        await adminCreateHeroSection(heroData);
        showToast('Slide başarıyla oluşturuldu', 'success');
      }
      
      setTimeout(() => {
        navigate('/admin/hero-sections');
      }, 1000);
    } catch (error: any) {
      console.error('Error saving hero section:', error);
      const errorMessage = error.response?.data?.error || 'Slide kaydedilirken hata oluştu';
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value),
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '0.5rem' }}>
          {heroSection ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
        </h1>
        <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-base)' }}>
          Hero section slider için slide bilgilerini düzenleyin
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Başlık */}
          <div>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              Başlık <span style={{ color: 'var(--power-red)' }}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.title ? 'var(--power-red)' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: 'var(--font-size-base)',
                boxSizing: 'border-box',
              }}
              placeholder="Slide başlığı"
            />
            {errors.title && (
              <div style={{ color: 'var(--power-red)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem' }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Alt Başlık - Rich Text Editor */}
          <div>
            <label htmlFor="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              Alt Başlık
            </label>
            <RichTextEditor
              value={formData.subtitle}
              onChange={(content) => setFormData({ ...formData, subtitle: content })}
              placeholder="Slide alt başlığı..."
              height={200}
            />
            <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
              Gelişmiş metin düzenleyici ile zengin içerik ekleyebilirsiniz
            </p>
          </div>

          {/* Açıklama - Rich Text Editor */}
          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              Açıklama
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Slide açıklaması..."
              height={250}
            />
            <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
              Gelişmiş metin düzenleyici ile zengin içerik ekleyebilirsiniz
            </p>
          </div>

          {/* Arka Plan Resmi */}
          <div>
            <label htmlFor="backgroundImage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              Arka Plan Resmi
            </label>
            
            {/* Upload Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: uploadMode === 'url' ? '#16a34a' : 'white',
                  color: uploadMode === 'url' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                URL ile Ekle
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: uploadMode === 'file' ? '#16a34a' : 'white',
                  color: uploadMode === 'file' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Dosya Yükle
              </button>
            </div>

            {/* URL Input Modu */}
            {uploadMode === 'url' && (
              <input
                type="text"
                id="backgroundImage"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: 'var(--font-size-base)',
                  boxSizing: 'border-box',
                }}
                placeholder="https://example.com/image.jpg veya /uploads/projects/image.jpg"
              />
            )}

            {/* File Upload Modu */}
            {uploadMode === 'file' && (
              <FileUpload
                onUpload={(url) => {
                  setFormData(prev => ({ ...prev, backgroundImage: url }));
                }}
                accept="image/*"
                label=""
              />
            )}

            {/* Önizleme */}
            {formData.backgroundImage && (
              <div style={{ marginTop: '0.75rem' }}>
                <img
                  src={formData.backgroundImage}
                  alt="Önizleme"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* CTA Buton Metni */}
          <div>
            <label htmlFor="ctaText" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              CTA Buton Metni
            </label>
            <input
              type="text"
              id="ctaText"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: 'var(--font-size-base)',
                boxSizing: 'border-box',
              }}
              placeholder="Örn: Hemen Başlayın"
            />
          </div>

          {/* CTA Buton Linki */}
          <div>
            <label htmlFor="ctaLink" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              CTA Buton Linki
            </label>
            <input
              type="text"
              id="ctaLink"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: 'var(--font-size-base)',
                boxSizing: 'border-box',
              }}
              placeholder="/#services, /about, veya https://example.com"
            />
            <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem' }}>
              Internal link için /#section, /page şeklinde veya external link için https:// kullanın
            </p>
          </div>

          {/* Sıra */}
          <div>
            <label htmlFor="order" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
              Sıra
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: 'var(--font-size-base)',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--office-gray)', marginTop: '0.25rem', display: 'block' }}>
              Düşük sayılar önce gösterilir
            </span>
          </div>

          {/* Aktif */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>Aktif (Slider'da gösterilsin)</span>
            </label>
            <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
              Birden fazla slide aktif olabilir
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/hero-sections')}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: 'var(--text-color)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: saving ? '#9ca3af' : '#16a34a',
              color: 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {saving ? 'Kaydediliyor...' : heroSection ? 'Güncelle' : 'Oluştur'}
          </button>
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}

export default HeroSectionForm;

