import type { ViewMode } from '../constants';
import { VIEW_CONFIG, VIEW_ORDER } from '../constants';

interface SidebarNavProps {
  view: ViewMode;
  count: number;
  onChange: (view: ViewMode) => void;
}

export function SidebarNav({ view, count, onChange }: SidebarNavProps) {
  return (
    <aside className="top-0 left-0 fixed bg-white/80 shadow-sm backdrop-blur-md p-3 border-slate-200/70 border-r w-24 h-screen">
      <div className="flex flex-col items-stretch gap-2 h-full">
        {VIEW_ORDER.map((key) => {
          const item = VIEW_CONFIG[key];
          const isActive = view === key;
          const activeStyles =
            key === 'favorites'
              ? 'border-amber-200 bg-amber-50 text-amber-700 shadow-md'
              : 'border-slate-200 bg-slate-900 text-white shadow-md';
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex h-20 flex-col items-center justify-center rounded-2xl border text-xs font-semibold tracking-wide transition ${
                isActive
                  ? activeStyles
                  : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
        <div className="bg-white/70 mt-auto px-2 py-3 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 text-center">
          {VIEW_CONFIG[view].label}
          <div className="mt-1 font-semibold text-slate-900 text-base">{count}</div>
        </div>
      </div>
    </aside>
  );
}
