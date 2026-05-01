import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type BackgroundOption = 'floral' | 'floral-colored' | 'dots' | 'grid' | 'stars' | 'waves' | 'blueprint' | 'circuit' | 'none';

const VALID_BACKGROUNDS = new Set<BackgroundOption>([
  'floral',
  'floral-colored',
  'dots',
  'grid',
  'stars',
  'waves',
  'blueprint',
  'circuit',
  'none',
]);

interface Settings {
  background: BackgroundOption;
}

const STORAGE_KEY = 'trinkets-settings';
const DEFAULT_SETTINGS: Settings = { background: 'floral' };

function load(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data) as Partial<Settings>;
    const merged: Settings = { ...DEFAULT_SETTINGS, ...parsed };
    if (!VALID_BACKGROUNDS.has(merged.background)) {
      merged.background = DEFAULT_SETTINGS.background;
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsContextType {
  settings: Settings;
  setBackground: (bg: BackgroundOption) => void;
}

const defaultContext: SettingsContextType = {
  settings: DEFAULT_SETTINGS,
  setBackground: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setBackground = useCallback((bg: BackgroundOption) => {
    setSettings(prev => ({ ...prev, background: bg }));
  }, []);

  return createElement(SettingsContext.Provider, { value: { settings, setBackground } }, children);
}

export function useSettings() {
  return useContext(SettingsContext);
}
