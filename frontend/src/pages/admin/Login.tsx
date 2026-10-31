import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminApi';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adminLogin(email, password);
      if (response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        const path = window.location.pathname;
        const currentPrefix = path.startsWith('/kokpit') ? '/kokpit' : path.startsWith('/agro-kokpit') ? '/agro-kokpit' : '/admin';
        navigate(`${currentPrefix}/dashboard`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: 'var(--office-dark-gray)',
        }}>
          Nova Agro Admin
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--office-gray)',
          marginBottom: '2rem',
        }}>
          Yönetim paneline giriş yapın
        </p>

        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'var(--power-red)',
            color: 'white',
            borderRadius: '8px',
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px dashed #16a34a',
          borderRadius: '8px',
          padding: '0.85rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧪</span> Portföy / Demo Giriş Bilgileri:
          </div>
          <div style={{ color: '#334155', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.5' }}>
            E-posta: <strong>admin@nova-agro.demo</strong><br />
            Şifre: <strong>DemoAdmin2026!</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@nova-agro.demo');
              setPassword('DemoAdmin2026!');
            }}
            style={{
              marginTop: '0.6rem',
              width: '100%',
              padding: '0.45rem',
              backgroundColor: '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#0f172a',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
          >
            Formu Demo Bilgileriyle Doldur
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--office-dark-gray)',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--office-gray)',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="admin@nova-agro.demo"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--office-dark-gray)',
            }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--office-gray)',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#94a3b8' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

