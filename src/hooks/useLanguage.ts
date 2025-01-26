'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export type Language = 'en' | 'ru';

export const useLanguageFromUrl = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentLanguage = searchParams.get('lang') as Language || 'en';
  
  const setLanguage = useCallback((newLang: Language) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);
  
  return {
    language: currentLanguage,
    setLanguage,
  };
};
