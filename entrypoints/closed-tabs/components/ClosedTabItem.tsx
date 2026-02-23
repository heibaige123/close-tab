import type { ClosedTab } from '../state/atoms';

export function ClosedTabItem({ tab, onDelete }: { tab: ClosedTab; onDelete?: () => void }) {
  return (
    <li className="min-w-0">
      <div className="group/tab flex min-w-0 items-start gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/80">
        <a
          href={tab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-baseline gap-0"
          title={tab.url}
        >
          {tab.title && (
            <>
              <span
                className="shrink whitespace-nowrap font-medium text-slate-900 transition group-hover/tab:text-blue-700"
                title={tab.title}
              >
                {tab.title}
              </span>
              <span className="px-2 text-slate-300" aria-hidden="true">
                |
              </span>
            </>
          )}
          <span className="truncate text-slate-500 transition group-hover/tab:text-blue-700" title={tab.url}>
            {tab.url}
          </span>
        </a>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-transparent px-1.5 py-0.5 text-xs text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            删除
          </button>
        )}
      </div>
    </li>
  );
}
