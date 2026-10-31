import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { SiteInfoProvider } from './contexts/SiteInfoContext.tsx';
import './i18n/config'; // i18n yapılandırması
import './styles/design-system.css';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <SiteInfoProvider>
        <App />
      </SiteInfoProvider>
    </HelmetProvider>
  </StrictMode>,
);

