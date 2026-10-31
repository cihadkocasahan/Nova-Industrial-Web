import { useState, useEffect } from 'react';
import { adminGetKeywords, adminCreateKeyword, adminUpdateKeyword, adminDeleteKeyword, adminToggleKeywordActive, adminUpdateKeywordsOrder } from '../../services/adminApi';
import type { SeoKeyword } from '../../types';

function AdminKeywords() {
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const response = await adminGetKeywords();
      setKeywords(response.data || []);
    } catch (error: any) {
      console.error('Keywords yüklenirken hata oluştu:', error);
      alert('Keywords yüklenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.keyword.trim()) {
      alert('Keyword gereklidir');
      return;
    }

    try {
      await adminCreateKeyword(formData);
      setFormData({ keyword: '', order: 0, active: true });
      setShowAddForm(false);
      fetchKeywords();
    } catch (error: any) {
      alert('Keyword eklenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (keyword: SeoKeyword) => {
    setEditingId(keyword.id);
    setFormData({
      keyword: keyword.keyword,
      order: keyword.order,
      active: keyword.active,
    });
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.keyword.trim()) {
      alert('Keyword gereklidir');
      return;
    }

    try {
      await adminUpdateKeyword(editingId, formData);
      setEditingId(null);
      setFormData({ keyword: '', order: 0, active: true });
      fetchKeywords();
    } catch (error: any) {
      alert('Keyword güncellenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu keyword\'ü silmek istediğinize emin misiniz?')) return;

    try {
      await adminDeleteKeyword(id);
      fetchKeywords();
    } catch (error: any) {
      alert('Keyword silinirken hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await adminToggleKeywordActive(id);
      fetchKeywords();
    } catch (error: any) {
      alert('Keyword durumu güncellenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleOrderChange = async (id: number, newOrder: number) => {
    try {
      // Tüm keywords'lerin order'ını güncelle
      const updatedKeywords = keywords.map(k => {
        if (k.id === id) {
          return { id: k.id, order: newOrder };
        }
        return { id: k.id, order: k.order };
      });
      
      await adminUpdateKeywordsOrder(updatedKeywords);
      fetchKeywords();
    } catch (error: any) {
      alert('Sıralama güncellenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ keyword: '', order: 0, active: true });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--office-gray)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1d263b' }}>SEO Anahtar Kelimeler (Etiket Bulutu)</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setFormData({ keyword: '', order: 0, active: true });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Keyword Ekle
        </button>
      </div>

      {/* Form (Add/Edit) */}
      {(showAddForm || editingId) && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1d263b' }}>
            {editingId ? 'Keyword Düzenle' : 'Yeni Keyword Ekle'}
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1d263b' }}>
                Keyword *
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                placeholder="Örn: Endüstriyel Otomasyon"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1d263b' }}>
                  Sıra
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '2rem' }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="active" style={{ cursor: 'pointer', fontWeight: 500, color: '#1d263b' }}>
                  Aktif
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelEdit}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e0e0e0',
                  color: '#1d263b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                İptal
              </button>
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keywords List */}
      {keywords.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--office-gray)', marginBottom: '1rem' }}>
            tag
          </span>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--office-dark-gray)' }}>Henüz keyword yok</h3>
          <p style={{ margin: 0, color: 'var(--office-gray)' }}>Yeni bir keyword eklemek için yukarıdaki "Yeni Keyword Ekle" butonuna tıklayın.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Tag Cloud View */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '2px dashed #e0e0e0',
            minHeight: '150px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {keywords
              .filter(k => k.active)
              .sort((a, b) => a.order - b.order)
              .map((keyword) => (
                <div
                  key={keyword.id}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'default',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  title={`Sıra: ${keyword.order}`}
                >
                  {keyword.keyword}
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', opacity: 0.7 }}>
                    {keyword.active ? 'check_circle' : 'cancel'}
                  </span>
                </div>
              ))}
          </div>

          {/* Keywords Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Sıra</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Keyword</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Durum</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {keywords
                .sort((a, b) => a.order - b.order)
                .map((keyword) => (
                  <tr key={keyword.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '1rem' }}>
                      <input
                        type="number"
                        value={keyword.order}
                        onChange={(e) => handleOrderChange(keyword.id, parseInt(e.target.value) || 0)}
                        style={{
                          width: '60px',
                          padding: '0.5rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#1d263b' }}>
                      {keyword.keyword}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleActive(keyword.id)}
                        style={{
                          padding: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: keyword.active ? '#10b981' : '#9ca3af',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          margin: '0 auto',
                        }}
                        title={keyword.active ? 'Aktif' : 'Pasif'}
                      >
                        <span className="material-symbols-outlined">
                          {keyword.active ? 'check_circle' : 'cancel'}
                        </span>
                      </button>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(keyword)}
                          style={{
                            padding: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#16a34a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(keyword.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Sil"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminKeywords;

