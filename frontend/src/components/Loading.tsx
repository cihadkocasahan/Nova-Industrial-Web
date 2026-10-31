interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div style={{
      position: fullScreen ? 'fixed' : 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: fullScreen ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
    }}>
      {/* Loading Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Logo with Ring Animation */}
        <div className="loading-logo-container" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '140px',
          height: '140px',
        }}>
          {/* Outer Ring */}
          <div className="loading-ring-outer" style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            border: '3px solid transparent',
            borderTopColor: 'var(--office-green)',
            borderRightColor: 'var(--office-green-light)',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite',
          }} />
          
          {/* Middle Ring */}
          <div className="loading-ring-middle" style={{
            position: 'absolute',
            width: '110px',
            height: '110px',
            border: '3px solid transparent',
            borderBottomColor: 'var(--emerald)',
            borderLeftColor: 'var(--office-green)',
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite reverse',
          }} />
          
          {/* Inner Ring */}
          <div className="loading-ring-inner" style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            border: '2px solid transparent',
            borderTopColor: 'var(--office-green-dark)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          
          {/* Logo */}
          <div className="loading-logo-wrapper" style={{
            position: 'relative',
            zIndex: 10,
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            padding: '0.5rem',
          }}>
            <img 
              src="/logo.svg" 
              alt="Nova Agro Logo" 
              className="loading-logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                animation: 'logoPulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;

