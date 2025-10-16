import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '../locales/en';
import fr from '../locales/fr';
import mg from '../locales/mg';

type Locale = 'en' | 'fr' | 'es' | 'ja' | 'zh' | 'mg';
type Translations = typeof en;

const translations: Record<Locale, Translations> = {
  en,
  fr,
  mg,
  es: en, // Placeholder
  ja: en, // Placeholder
  zh: en, // Placeholder
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
};