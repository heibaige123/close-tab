import type { ClosedTab } from '../../../db/historyDb';

export function ClosedTabItem({ tab, onDelete }: { tab: ClosedTab; onDelete?: () => void }) {
  return (
    <li className="min-w-0">
      <div className="tab-row">
        <a
          href={tab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tab-link"
          title={tab.url}
        >
          {tab.title && (
            <>
              <span
                className="tab-title"
                title={tab.title}
              >
                {tab.title}
              </span>
              <span className="tab-sep" aria-hidden="true">
                |
              </span>
            </>
          )}
          <span className="tab-url" title={tab.url}>
            {tab.url}
          </span>
        </a>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="btn--ghost-danger"
          >
            删除
          </button>
        )}
      </div>
    </li>
  );
}
