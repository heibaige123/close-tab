import type { ViewMode } from '../constants';
import { VIEW_CONFIG, VIEW_ORDER } from '../constants';

interface SidebarNavProps {
  view: ViewMode;
  count: number;
  onChange: (view: ViewMode) => void;
}

export function SidebarNav({ view, count, onChange }: SidebarNavProps) {
  return (
    <aside className="sidebar-shell">
      <div className="flex flex-col items-stretch gap-2 h-full">
        {VIEW_ORDER.map((key) => {
          const item = VIEW_CONFIG[key];
          const isActive = view === key;
          const activeStyles =
            key === 'favorites'
              ? 'nav-item-favorites-active'
              : 'nav-item-history-active';
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`nav-item ${isActive ? activeStyles : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1 text-label">{item.label}</span>
            </button>
          );
        })}
        <div className="counter-card">
          <span className="text-label">{VIEW_CONFIG[view].label}</span>
          <div className="mt-1 font-semibold text-metric text-slate-900 text-base">{count}</div>
        </div>
      </div>
    </aside>
  );
}
