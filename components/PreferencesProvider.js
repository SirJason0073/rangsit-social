'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'rangsit-device-preferences';
const defaults = {
  reduceMotion: false,
  textSize: 'default',
  highContrast: false,
  autoplayVideo: false,
  dataSaver: false
};

const PreferencesContext = createContext(null);

function applyPreferences(preferences) {
  const root = document.documentElement;
  root.dataset.textSize = preferences.textSize;
  root.dataset.contrast = preferences.highContrast ? 'high' : 'standard';
  root.dataset.reduceMotion = preferences.reduceMotion ? 'true' : 'false';
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider.');
  return context;
}

export default function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      const next = { ...defaults, ...stored };
      setPreferences(next);
      applyPreferences(next);
    } catch {
      applyPreferences(defaults);
    }
  }, []);

  function updatePreference(name, value) {
    setPreferences((current) => {
      const next = { ...current, [name]: value };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyPreferences(next);
      return next;
    });
  }

  function resetPreferences() {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    applyPreferences(defaults);
  }

  const value = useMemo(() => ({ preferences, updatePreference, resetPreferences }), [preferences]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
