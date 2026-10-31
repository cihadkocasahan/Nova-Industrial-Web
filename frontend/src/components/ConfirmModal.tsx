interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Evet',
  cancelText = 'İptal',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: '#ef4444', icon: 'delete' },
    warning: { bg: '#f59e0b', icon: 'warning' },
    info: { bg: '#16a34a', icon: 'info' },
  };

  const color = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: color.bg + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: color.bg }}>
              {color.icon}
            </span>
          </div>

          <h3 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1f2937',
            textAlign: 'center',
          }}>
            {title}
          </h3>

          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.5',
          }}>
            {message}
          </p>

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            width: '100%',
            marginTop: '0.5rem',
          }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                backgroundColor: color.bg,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;

