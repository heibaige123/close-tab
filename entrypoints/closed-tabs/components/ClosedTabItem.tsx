import { memo } from 'react';
import type { ClosedTab } from '../../../db';

type ClosedTabItemProps = {
  tab: ClosedTab;
  onDelete?: () => void;
};

export const ClosedTabItem = memo(function ClosedTabItem({ tab, onDelete }: ClosedTabItemProps) {
  return (
    <li className="min-w-0">
      <div className="group flex items-start gap-2.5 hover:bg-white/70 pr-2 rounded-lg min-w-0 transition">
        <a
          href={tab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-baseline gap-0 min-w-0 text-left"
          title={tab.url}
        >
          {tab.title && (
            <span className="flex items-center min-w-0 max-w-1/2">
              <span
                className="block min-w-0 font-medium text-label text-slate-900 group-hover:text-blue-700 truncate whitespace-nowrap transition"
                title={tab.title}
              >
                {tab.title}
              </span>
              <span className="px-2 font-extrabold text-slate-300" aria-hidden="true">
                |
              </span>
            </span>
          )}
          <span
            className={`block min-w-0 truncate text-slate-500 text-url group-hover:text-blue-700 transition ${
              tab.title ? 'flex-1 basis-1/2 max-w-1/2' : 'basis-full'
            }`}
            title={tab.url}
          >
            {tab.url}
          </span>
        </a>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex-none hover:bg-red-50 px-1.5 py-0.5 border border-transparent hover:border-red-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 text-slate-400 hover:text-red-700 text-xs transition"
          >
            删除
          </button>
        )}
      </div>
    </li>
  );
});
