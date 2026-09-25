'use client';
import { useState, useEffect } from 'react';

export function useLanguage() {
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('hpdc_lang');
    if (stored) {
      setLang(stored);
    }
  }, []);

  const changeLang = (newLang) => {
    localStorage.setItem('hpdc_lang', newLang);
    setLang(newLang);
  };

  return { lang, changeLang, mounted };
}
