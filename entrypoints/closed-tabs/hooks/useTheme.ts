import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type ThemeId } from '../themes';

export function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    browser.storage.local.get(THEME_STORAGE_KEY).then((result) => {
      const stored = result[THEME_STORAGE_KEY] as ThemeId | undefined;
      const next = stored && stored in THEMES ? stored : DEFAULT_THEME;
      applyTheme(next);
      setThemeState(next);
      setReady(true);
    });
  }, []);

  const setTheme = useCallback(async (next: ThemeId) => {
    applyTheme(next);
    setThemeState(next);
    await browser.storage.local.set({ [THEME_STORAGE_KEY]: next });
  }, []);

  const cycleTheme = useCallback(async () => {
    const ids = Object.keys(THEMES) as ThemeId[];
    const index = ids.indexOf(theme);
    const next = ids[(index + 1) % ids.length] ?? DEFAULT_THEME;
    await setTheme(next);
  }, [setTheme, theme]);

  return { theme, setTheme, cycleTheme, ready, themes: THEMES };
}
