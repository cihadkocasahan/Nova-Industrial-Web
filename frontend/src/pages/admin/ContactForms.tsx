import { useEffect, useState } from 'react';
import { adminGetContactForms, adminDeleteContactForm, adminMarkContactFormAsRead, type ContactForm } from '../../services/adminApi';

function AdminContactForms() {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactForms();
  }, []);

  const fetchContactForms = async () => {
    try {
      const response = await adminGetContactForms(50, 0);
      setContactForms(response.data);
    } catch (error) {
      console.error('Error fetching contact forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu iletişim formunu silmek istediğinize emin misiniz?')) return;
    try {
      await adminDeleteContactForm(id);
      setContactForms(contactForms.filter(c => c.id !== id));
    } catch (error) {
      alert('İletişim formu silinirken hata oluştu');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await adminMarkContactFormAsRead(id);
      setContactForms(contactForms.map(c => c.id === id ? { ...c, read: true } : c));
    } catch (error) {
      alert('Okundu olarak işaretlenirken hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {contactForms.map((form) => (
          <div key={form.id} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: form.read ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1), 0 0 0 2px var(--power-blue)',
            borderLeft: form.read ? 'none' : '4px solid var(--power-blue)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{form.name}</h3>
                <p style={{ margin: 0, color: 'var(--office-gray)' }}>{form.email}</p>
                {form.phone && <p style={{ margin: 0, color: 'var(--office-gray)' }}>{form.phone}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!form.read && (
                  <button
                    onClick={() => handleMarkAsRead(form.id!)}
                    style={{
                      padding: '0.5rem',
                      background: 'var(--office-green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    title="Okundu olarak işaretle"
                  >
                    <span className="material-symbols-outlined">done</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(form.id!)}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--power-red)',
                    cursor: 'pointer',
                  }}
                  title="Sil"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            {form.subject && (
              <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>{form.subject}</p>
            )}
            <p style={{ margin: 0, color: 'var(--office-dark-gray)' }}>{form.message}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--office-gray)' }}>
              {new Date(form.createdAt!).toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContactForms;

