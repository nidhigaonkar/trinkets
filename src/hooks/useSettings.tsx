import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

export type BackgroundOption = 'floral' | 'floral-colored' | 'dots' | 'grid' | 'none';

interface Settings {
  background: BackgroundOption;
}

const STORAGE_KEY = 'trinkets-settings';
const DEFAULT_SETTINGS: Settings = { background: 'floral' };

function load(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsContextType {
  settings: Settings;
  setBackground: (bg: BackgroundOption) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setBackground = useCallback((bg: BackgroundOption) => {
    setSettings(prev => ({ ...prev, background: bg }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setBackground }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
