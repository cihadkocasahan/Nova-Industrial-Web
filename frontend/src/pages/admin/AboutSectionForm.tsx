import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetAboutSection, adminCreateAboutSection, adminUpdateAboutSection } from '../../services/adminApi';
import RichTextEditor from '../../components/RichTextEditor';
import Toast, { type ToastType } from '../../components/Toast';

function AboutSectionForm() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutSection, setAboutSection] = useState<{ id?: number; title: string; content: string; visible: boolean } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visible: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadAboutSection();
  }, []);

  const loadAboutSection = async () => {
    try {
      setLoading(true);
      const response = await adminGetAboutSection();
      if (response.data) {
        setAboutSection(response.data);
        setFormData({
          title: response.data.title || '',
          content: response.data.content || '',
          visible: response.data.visible !== false,
        });
      }
    } catch (error: any) {
      console.error('Error loading about section:', error);
      // Eğer kayıt yoksa, yeni kayıt oluşturma modunda kal
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
    
    if (!formData.content.trim()) {
      newErrors.content = 'İçerik gereklidir (en az 3 paragraf)';
    } else {
      // İçerikte en az 3 paragraf olup olmadığını kontrol et (basit kontrol)
      const paragraphCount = (formData.content.match(/<p>/g) || []).length;
      if (paragraphCount < 3) {
        newErrors.content = 'İçerik en az 3 paragraf içermelidir';
      }
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
      const aboutData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        visible: formData.visible,
      };
      
      if (aboutSection && aboutSection.id) {
        await adminUpdateAboutSection(aboutSection.id, aboutData);
        showToast('Hakkımızda bölümü başarıyla güncellendi', 'success');
      } else {
        await adminCreateAboutSection(aboutData);
        showToast('Hakkımızda bölümü başarıyla oluşturuldu', 'success');
      }
      
      setTimeout(() => {
        navigate('/admin/about-section');
      }, 1000);
    } catch (error: any) {
      console.error('Error saving about section:', error);
      const errorMessage = error.response?.data?.error || 'Hakkımızda bölümü kaydedilirken hata oluştu';
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
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
          {aboutSection ? 'Hakkımızda Bölümünü Düzenle' : 'Hakkımızda Bölümü Oluştur'}
        </h1>
        <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-base)' }}>
          Anasayfa için Hakkımızda bölümünü düzenleyin. En az 3 paragraf içerik ekleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
            Başlık <span style={{ color: 'var(--power-red)' }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.title ? 'var(--power-red)' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: 'var(--font-size-base)',
            }}
            placeholder="Örn: Hakkımızda"
          />
          {errors.title && (
            <div style={{ color: 'var(--power-red)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem' }}>
              {errors.title}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-semibold)' }}>
            İçerik (En az 3 paragraf) <span style={{ color: 'var(--power-red)' }}>*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
          {errors.content && (
            <div style={{ color: 'var(--power-red)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem' }}>
              {errors.content}
            </div>
          )}
          <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
            20+ yıllık sanayi tesislerindeki komple elektrik çözümlerini vurgulayan en az 3 paragraf ekleyin.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>Görünür</span>
          </label>
          <p style={{ color: 'var(--office-gray)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
            İşaretli ise anasayfada gösterilir
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/about-section')}
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
            {saving ? 'Kaydediliyor...' : aboutSection ? 'Güncelle' : 'Oluştur'}
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

export default AboutSectionForm;

