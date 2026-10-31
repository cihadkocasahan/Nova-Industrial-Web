import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSiteInfo, SiteInfo } from '../services/api';

const DEFAULTS: SiteInfo = {
  site_name: 'Nova Agro',
  site_slogan: 'İleri AgTech & Ziraat Mühendisliği Çözümleri',
  site_email: 'demo@nova-agro.example',
  site_phone: '+90 (555) 000 00 00',
  site_address: 'Lorem Ipsum Mah. Teknoloji Cad. No: 123/A, Kadıköy / İstanbul',
  site_whatsapp: '905550000000',
  site_primary_color: '#16a34a',
  site_cta_text: 'Teklif Al',
  site_meta_title: 'Nova Agro | İleri AgTech & Ziraat Mühendisliği Çözümleri',
  site_meta_description: 'Zirai drone ilaçlama, hassas tarım, toprak analizi ve modern sera otomasyonunda öncü AgTech çözümleri.',
  site_meta_keywords: 'zirai drone, agtech, hassas tarım, ziraat mühendisliği, sera otomasyonu, toprak analizi, Nova Agro',
};

interface SiteInfoContextValue {
  siteInfo: SiteInfo;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteInfoContext = createContext<SiteInfoContextValue>({
  siteInfo: DEFAULTS,
  loading: true,
  refresh: async () => {},
});

export function SiteInfoProvider({ children }: { children: ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSiteInfo = async () => {
    try {
      const res = await getSiteInfo();
      if (res.data) {
        setSiteInfo({ ...DEFAULTS, ...res.data });
      }
    } catch {
      // default değerler geçerli kalır
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  return (
    <SiteInfoContext.Provider value={{ siteInfo, loading, refresh: fetchSiteInfo }}>
      {children}
    </SiteInfoContext.Provider>
  );
}

export function useSiteInfo() {
  return useContext(SiteInfoContext);
}
