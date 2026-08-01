import { zaodongTheme } from './zaodong/meta';
import { nuanyunTheme } from './nuanyun/meta';

export const THEMES = {
  zaodong: zaodongTheme,
  nuanyun: nuanyunTheme,
} as const;

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME: ThemeId = 'zaodong';
export const THEME_STORAGE_KEY = 'ui-theme';
