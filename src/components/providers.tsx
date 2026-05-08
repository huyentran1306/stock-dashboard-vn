'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';

// ──────────────────────────── THEME ────────────────────────────
type Theme = 'dark' | 'light';

interface ThemeCtxType {
  theme: Theme;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxType>({ theme: 'dark', toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

// ──────────────────────────── LANG ─────────────────────────────
interface LangCtxType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangCtxType>({ lang: 'vi', setLang: () => {} });
export const useLang = () => useContext(LangCtx);

// ──────────────────────────── PROVIDERS ────────────────────────
export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLangState] = useState<Lang>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    const savedLang = (localStorage.getItem('lang') as Lang) || 'vi';
    setTheme(savedTheme);
    setLangState(savedLang);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setMounted(true);
  }, []);

  function toggle() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('theme', next);
      return next;
    });
  }

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('lang', l);
  }

  // Avoid flash: render children even before mount, theme is set via script in layout
  if (!mounted) {
    return (
      <ThemeCtx.Provider value={{ theme, toggle }}>
        <LangCtx.Provider value={{ lang, setLang }}>
          {children}
        </LangCtx.Provider>
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <LangCtx.Provider value={{ lang, setLang }}>
        {children}
      </LangCtx.Provider>
    </ThemeCtx.Provider>
  );
}
