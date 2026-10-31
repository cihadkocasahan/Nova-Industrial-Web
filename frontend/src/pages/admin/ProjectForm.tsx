import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetProject, adminCreateProject, adminUpdateProject, adminGetCategories, adminGetProjectImages, adminCreateProjectImage, adminDeleteProjectImage, adminGetKeywordsActive } from '../../services/adminApi';
import FileUpload from '../../components/FileUpload';
import RichTextEditor from '../../components/RichTextEditor';
import TagInput from '../../components/TagInput';
import type { Project, Category, ProjectImage, SeoKeyword } from '../../types';

function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    location: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    order: '0',
  });

  // SEO için default placeholder'lar
  const defaultSeoPlaceholders = {
    title: (title: string) => `${title} | Nova Industrial Mühendislik Çözümleri`,
    description: 'Endüstriyel otomasyon, SCADA, robotik entegrasyon ve akıllı güç sistemleri alanında anahtar teslim mühendislik çözümleri.',
  };
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageOrder, setNewImageOrder] = useState('0');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  useEffect(() => {
    loadCategories();
    loadSuggestedKeywords();
    if (isEdit && id) {
      loadProject();
    }
  }, [id, isEdit]);

  const loadSuggestedKeywords = async () => {
    try {
      const response = await adminGetKeywordsActive();
      const keywords = response.data || [];
      setSuggestedKeywords(keywords.map((k: SeoKeyword) => k.keyword));
    } catch (error) {
      console.error('Error loading suggested keywords:', error);
      // Fallback to default keywords if API fails
      setSuggestedKeywords([
        'Endüstriyel Otomasyon',
        'PLC Programlama',
        'SCADA Sistemleri',
        'Robotik Entegrasyon',
        'Akıllı Güç Dağıtımı',
        'Trafo Merkezi',
        'Endüstri 4.0',
        'Pano İmalatı',
        'Proses Kontrol',
        'NOVA INDUSTRIAL',
      ]);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await adminGetCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProject = async () => {
    try {
      const response = await adminGetProject(parseInt(id!));
      const project = response.data;
      // seoKeywords string'den array'e çevir
      const keywordsArray = project.seoKeywords 
        ? project.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];
      
      setFormData({
        categoryId: project.categoryId?.toString() || '',
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        content: project.content || '',
        image: project.image || '',
        location: project.location || '',
        seoTitle: project.seoTitle || '',
        seoDescription: project.seoDescription || '',
        seoKeywords: keywordsArray,
        order: project.order?.toString() || '0',
      });
      
      // Proje resimlerini yükle
      if (project.images) {
        setProjectImages(project.images);
      } else {
        const imagesResponse = await adminGetProjectImages(parseInt(id!));
        setProjectImages(imagesResponse.data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Proje yüklenirken hata oluştu');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      alert('Resim URL\'si gerekli');
      return;
    }
    
    if (!isEdit || !id) {
      // Yeni proje, geçici olarak ekle
      const tempImage: ProjectImage = {
        id: Date.now(), // Geçici ID
        projectId: 0,
        imageUrl: newImageUrl.trim(),
        order: parseInt(newImageOrder) || projectImages.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjectImages([...projectImages, tempImage]);
      setNewImageUrl('');
      setNewImageOrder((projectImages.length + 1).toString());
    } else {
      // Mevcut proje, API'ye kaydet
      try {
        const response = await adminCreateProjectImage(parseInt(id), {
          imageUrl: newImageUrl.trim(),
          order: parseInt(newImageOrder) || projectImages.length,
        });
        setProjectImages([...projectImages, response.data]);
        setNewImageUrl('');
        setNewImageOrder((projectImages.length + 1).toString());
      } catch (error) {
        console.error('Error adding image:', error);
        alert('Resim eklenirken hata oluştu');
      }
    }
  };
  
  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Bu resmi silmek istediğinize emin misiniz?')) return;
    
    if (!isEdit || !id) {
      // Yeni proje, geçici listeden sil
      setProjectImages(projectImages.filter(img => img.id !== imageId));
    } else {
      // Mevcut proje, API'den sil
      try {
        await adminDeleteProjectImage(imageId);
        setProjectImages(projectImages.filter(img => img.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Resim silinirken hata oluştu');
      }
    }
  };

  const generateSlug = (text: string): string => {
    const turkishChars: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U',
    };

    const turkishToEnglish = (str: string) => {
      return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => turkishChars[char] || char);
    };

    return turkishToEnglish(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Title değiştiyse slug'ı otomatik oluştur (slug boşsa veya title'dan oluşturulmuşsa)
      if (name === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updated.slug = generateSlug(value);
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
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçimi zorunludur';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Proje başlığı zorunludur';
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
      const projectData = {
        categoryId: parseInt(formData.categoryId),
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title.trim()),
        description: formData.description.trim() || null,
        content: formData.content.trim(),
        image: formData.image.trim() || null,
        location: formData.location.trim() || null,
        seoTitle: formData.seoTitle.trim() || null,
        seoDescription: formData.seoDescription.trim() || null,
        seoKeywords: formData.seoKeywords.length > 0 ? formData.seoKeywords.join(', ') : null,
        order: parseInt(formData.order) || 0,
      };

      let projectId: number;
      
      if (isEdit) {
        await adminUpdateProject(parseInt(id!), projectData);
        projectId = parseInt(id!);
        alert('Proje güncellendi');
      } else {
        const response = await adminCreateProject(projectData);
        projectId = response.data.id;
        alert('Proje oluşturuldu');
        
        // Yeni projede geçici resimleri kaydet
        for (const image of projectImages) {
          try {
            await adminCreateProjectImage(projectId, {
              imageUrl: image.imageUrl,
              order: image.order,
            });
          } catch (error) {
            console.error('Error saving image:', error);
          }
        }
      }
      
      // Geçici resimleri kaydet (eğer varsa ve düzenleme modunda değilse)
      if (!isEdit && projectImages.length > 0) {
        // Yukarıda yapıldı
      }
      
      navigate('/admin/projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.error || 'Proje kaydedilirken hata oluştu';
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
          to="/admin/projects"
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
          Projelere Dön
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1d263b' }}>
          {isEdit ? 'Proje Düzenle' : 'Yeni Proje'}
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
              Kategori *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.categoryId ? '2px solid #EF4444' : '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.categoryId}
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
              Proje Başlığı *
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
              placeholder="Örn: Endüstriyel Elektrik Projesi"
            />
            {errors.title && (
              <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              URL Slug (Otomatik oluşturulur)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: '#f9fafb',
              }}
              placeholder="ornek-proje-slug"
            />
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              URL'de görünecek kısa adres. Türkçe karakterler otomatik dönüştürülür.
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Kısa Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
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
              placeholder="Proje hakkında kısa bir açıklama..."
            />
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
              placeholder="Proje detayları ve içeriği..."
              error={errors.content}
              height={400}
            />
          </div>

          {/* Ana Resim - URL veya Upload */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Ana Resim (Kartta gösterilecek)
            </label>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <button
                type="button"
                onClick={() => {
                  const mainImageMode = formData.image ? 'url' : 'file';
                  // Burada state ile toggle yapabiliriz
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                  link
                </span>
                URL
              </button>
            </div>

            {/* URL Input */}
            <div style={{ marginBottom: '0.5rem' }}>
              <input
                type="url"
                name="image"
                value={formData.image}
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

            {/* File Upload Alternatifi */}
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              veya
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <FileUpload
                onUpload={(url) => {
                  setFormData({ ...formData, image: url });
                }}
                accept="image/*"
                label=""
              />
            </div>
          </div>

          {/* Çoklu Resim Yönetimi */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Ek Resimler (Carousel için)
            </label>
            
            {/* Upload Mode Seçimi */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: `2px solid ${uploadMode === 'url' ? '#16a34a' : '#e0e0e0'}`,
                  background: uploadMode === 'url' ? '#16a34a' : 'white',
                  color: uploadMode === 'url' ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  link
                </span>
                URL ile Ekle
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: `2px solid ${uploadMode === 'file' ? '#16a34a' : '#e0e0e0'}`,
                  background: uploadMode === 'file' ? '#16a34a' : 'white',
                  color: uploadMode === 'file' ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  cloud_upload
                </span>
                Dosya Yükle
              </button>
            </div>

            {/* URL Modu */}
            {uploadMode === 'url' && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="number"
                  value={newImageOrder}
                  onChange={(e) => setNewImageOrder(e.target.value)}
                  placeholder="Sıra"
                  style={{
                    width: '80px',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16a34a',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                  Ekle
                </button>
              </div>
            )}

            {/* File Upload Modu */}
            {uploadMode === 'file' && (
              <div style={{ marginBottom: '1rem' }}>
                <FileUpload
                  onUpload={(url) => {
                    setNewImageUrl(url);
                    // Otomatik olarak ekle
                    const tempImage: ProjectImage = {
                      id: Date.now(),
                      projectId: 0,
                      imageUrl: url,
                      order: parseInt(newImageOrder) || projectImages.length,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    if (isEdit && id) {
                      // Mevcut proje, hemen kaydet
                      adminCreateProjectImage(parseInt(id), {
                        imageUrl: url,
                        order: parseInt(newImageOrder) || projectImages.length,
                      }).then((response) => {
                        setProjectImages([...projectImages, response.data]);
                        setNewImageOrder((projectImages.length + 1).toString());
                      }).catch((error) => {
                        console.error('Error adding image:', error);
                        alert('Resim eklenirken hata oluştu');
                      });
                    } else {
                      // Yeni proje, geçici olarak ekle
                      setProjectImages([...projectImages, tempImage]);
                      setNewImageOrder((projectImages.length + 1).toString());
                    }
                  }}
                  accept="image/*"
                  label=""
                />
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                  }}>
                    Sıralama (opsiyonel)
                  </label>
                  <input
                    type="number"
                    value={newImageOrder}
                    onChange={(e) => setNewImageOrder(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100px',
                      padding: '0.5rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Resim Listesi */}
            {projectImages.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                {projectImages
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div
                      key={image.id}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #e0e0e0',
                      }}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`Project image ${image.id}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Image+Not+Found';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}>
                        Sıra: {image.order}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                        }}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
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
              Yer Bilgisi
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="Örn: İstanbul, Ankara"
            />
          </div>

          {/* SEO Alanları */}
          <div style={{
            marginTop: '3rem',
            marginBottom: '2rem',
            paddingTop: '2rem',
            borderTop: '2px solid #e5e7eb',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1d263b',
              marginBottom: '1.5rem',
            }}>
              SEO Ayarları
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1d263b',
              }}>
                SEO Başlık (Opsiyonel)
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                onFocus={(e) => {
                  if (!formData.seoTitle && formData.title) {
                    setFormData(prev => ({ ...prev, seoTitle: defaultSeoPlaceholders.title(formData.title) }));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
                placeholder={formData.title ? defaultSeoPlaceholders.title(formData.title) : "Proje Başlığı | Nova Industrial Mühendislik Çözümleri"}
              />
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Arama motorlarında görünecek başlık. Boş bırakılırsa proje başlığı kullanılır. Önerilen format: "Proje Başlığı | Nova Industrial Mühendislik Çözümleri"
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1d263b',
              }}>
                SEO Açıklaması (Opsiyonel)
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                onFocus={(e) => {
                  if (!formData.seoDescription) {
                    setFormData(prev => ({ ...prev, seoDescription: defaultSeoPlaceholders.description }));
                  }
                }}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
                placeholder={defaultSeoPlaceholders.description}
              />
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Arama motorlarında görünecek açıklama (150-160 karakter önerilir). Karakter sayısı: {formData.seoDescription.length}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1d263b',
              }}>
                SEO Anahtar Kelimeler (Opsiyonel)
              </label>
              <TagInput
                value={formData.seoKeywords}
                onChange={(tags) => setFormData(prev => ({ ...prev, seoKeywords: tags }))}
                placeholder="Anahtar kelime ekleyin ve Enter'a basın..."
                maxTags={20}
              />
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                }}>
                  Önerilen Kelimeler (Tıklayarak ekleyin):
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  {suggestedKeywords
                    .filter(keyword => !formData.seoKeywords.includes(keyword.toLowerCase()))
                    .map((keyword, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (formData.seoKeywords.length < 20) {
                            setFormData(prev => ({
                              ...prev,
                              seoKeywords: [...prev.seoKeywords, keyword.toLowerCase()],
                            }));
                          }
                        }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #e5e7eb',
                          borderRadius: '16px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#16a34a';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = '#16a34a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                      >
                        + {keyword}
                      </button>
                    ))}
                </div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Enter veya virgül ile kelime ekleyebilirsiniz. Kelime sayısı: {formData.seoKeywords.length}/20
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1d263b',
            }}>
              Sıralama
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
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
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
          }}>
            <Link
              to="/admin/projects"
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

export default ProjectForm;

