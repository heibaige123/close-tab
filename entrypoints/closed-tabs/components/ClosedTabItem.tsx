import type { ClosedTab } from '../../../db/historyDb';

export function ClosedTabItem({ tab, onDelete }: { tab: ClosedTab; onDelete?: () => void }) {
  return (
    <li className="min-w-0">
      <div className="group/tab flex items-start gap-2.5 hover:bg-white/80 px-2 py-1.5 rounded-lg min-w-0 transition">
        <a
          href={tab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-baseline gap-0 min-w-0"
          title={tab.url}
        >
          {tab.title && (
            <>
              <span
                className="font-medium text-slate-900 group-hover/tab:text-blue-700 whitespace-nowrap transition shrink"
                title={tab.title}
              >
                {tab.title}
              </span>
              <span className="px-2 text-slate-300" aria-hidden="true">
                |
              </span>
            </>
          )}
          <span className="text-slate-500 group-hover/tab:text-blue-700 truncate transition" title={tab.url}>
            {tab.url}
          </span>
        </a>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="hover:bg-red-50 px-1.5 py-0.5 border border-transparent hover:border-red-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 text-slate-400 hover:text-red-700 text-xs transition"
          >
            删除
          </button>
        )}
      </div>
    </li>
  );
}
