import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Lazy load translations to avoid import errors
import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';

try {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        tr: {
          translation: trTranslation,
        },
        en: {
          translation: enTranslation,
        },
      },
      fallbackLng: 'tr',
      debug: false,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      detection: {
        order: ['navigator', 'localStorage', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
      },
    });
} catch (error) {
  console.error('i18n initialization failed:', error);
  // Fallback initialization without translations
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'tr',
      lng: 'tr',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;

