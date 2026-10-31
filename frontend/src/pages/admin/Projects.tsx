import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetProjects, adminDeleteProject, adminToggleProjectVisible, adminGetCategories, type Project, type Category } from '../../services/adminApi';
import ErrorModal from '../../components/ErrorModal';

function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await adminGetCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await adminGetProjects(selectedCategory);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    try {
      await adminDeleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Proje silinirken hata oluştu';
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const handleToggleVisible = async (id: number) => {
    try {
      const response = await adminToggleProjectVisible(id);
      setProjects(projects.map(p => p.id === id ? { ...p, visible: response.data.visible } : p));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Görünürlük değiştirilirken hata oluştu';
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Bilinmeyen';
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <ErrorModal
        isOpen={isErrorModalOpen}
        message={error || 'Bir hata oluştu'}
        onClose={() => {
          setIsErrorModalOpen(false);
          setError(null);
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <Link
          to="/admin/projects/new"
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
          <span className="material-symbols-outlined">add</span> Yeni Proje
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map((project) => (
          <div key={project.id} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            overflow: 'visible',
            position: 'relative',
          }}>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', maxWidth: 'calc(100% - 150px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}>
                  {getCategoryName(project.categoryId)}
                </span>
              </div>
              {project.description && (
                <p style={{ margin: '0.5rem 0', color: 'var(--office-gray)', fontSize: '0.875rem' }}>
                  {project.description}
                </p>
              )}
              {project.location && (
                <p style={{ margin: '0.5rem 0', color: 'var(--office-gray)', fontSize: '0.875rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>
                    location_on
                  </span>
                  {project.location}
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
                onClick={() => handleToggleVisible(project.id!)}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: project.visible !== false ? '#10b981' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                  minWidth: '40px',
                }}
                title={project.visible !== false ? 'Göster (Aktif)' : 'Gizle (Pasif)'}
              >
                <span className="material-symbols-outlined">
                  {project.visible !== false ? 'visibility' : 'visibility_off'}
                </span>
              </button>
              <Link
                to={`/admin/projects/${project.id}/edit`}
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
                onClick={() => handleDelete(project.id!)}
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
        {projects.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--office-gray)',
          }}>
            Henüz proje eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjects;

