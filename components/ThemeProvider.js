'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider.');
  return context;
}

export default function ThemeProvider({ children }) {
  const [preference, setPreference] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const stored = window.localStorage.getItem('rangsit-theme');
    const initialPreference = stored === 'light' || stored === 'dark' ? stored : 'system';
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (nextPreference) => {
      const resolved = nextPreference === 'system' ? getSystemTheme() : nextPreference;
      document.documentElement.dataset.theme = resolved;
      setResolvedTheme(resolved);
    };
    const handleSystemChange = () => {
      if (window.localStorage.getItem('rangsit-theme')) return;
      applyTheme('system');
    };
    setPreference(initialPreference);
    applyTheme(initialPreference);
    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, []);

  function setTheme(nextPreference) {
    const safePreference = nextPreference === 'dark' ? 'dark' : 'light';
    setPreference(safePreference);
    setResolvedTheme(safePreference);
    window.localStorage.setItem('rangsit-theme', safePreference);
    document.documentElement.dataset.theme = safePreference;
  }

  const value = useMemo(() => ({ theme: resolvedTheme, preference, setTheme }), [preference, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
