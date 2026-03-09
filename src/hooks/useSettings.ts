import { useState, useEffect, useCallback } from 'react';

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

function save(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => { save(settings); }, [settings]);

  const setBackground = useCallback((bg: BackgroundOption) => {
    setSettings(prev => ({ ...prev, background: bg }));
  }, []);

  return { settings, setBackground };
}
