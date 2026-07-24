'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import ThemeProvider from './ThemeProvider';
import PreferencesProvider from './PreferencesProvider';
import { ToastProvider } from './ui/Toast';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const res = await fetch('/api/auth/me', {
        cache: 'no-store',
        credentials: 'include'
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  const value = useMemo(() => ({ user, setUser, loading, refresh: loadMe }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
