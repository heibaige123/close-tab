import { createRoot } from 'react-dom/client';
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type ThemeId } from './themes';
import App from './App';
import './style.css';

async function bootstrap() {
  const root = document.getElementById('root');
  if (!root) return;

  try {
    const result = await browser.storage.local.get(THEME_STORAGE_KEY);
    const stored = result[THEME_STORAGE_KEY] as ThemeId | undefined;
    const theme = stored && stored in THEMES ? stored : DEFAULT_THEME;
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = DEFAULT_THEME;
  }

  createRoot(root).render(<App />);
}

bootstrap();
