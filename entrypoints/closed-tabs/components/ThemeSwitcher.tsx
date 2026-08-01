import { memo } from 'react';
import { THEMES, type ThemeId } from '../themes';

type ThemeSwitcherProps = {
  theme: ThemeId;
  onChange: (theme: ThemeId) => void;
};

export const ThemeSwitcher = memo(function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
  return (
    <div className="theme-switcher" role="group" aria-label="界面主题">
      {(Object.keys(THEMES) as ThemeId[]).map((id) => {
        const item = THEMES[id];
        const isActive = id === theme;
        return (
          <button
            key={id}
            type="button"
            className={`theme-option ${isActive ? 'theme-option-active' : ''}`}
            aria-pressed={isActive}
            title={item.description}
            onClick={() => onChange(id)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
});
