import { memo } from 'react';
import type { ClosedTab } from '../../../db';

type ClosedTabItemProps = {
  tab: ClosedTab;
  onDelete?: () => void;
};

export const ClosedTabItem = memo(function ClosedTabItem({ tab, onDelete }: ClosedTabItemProps) {
  return (
    <li className="min-w-0">
      <div className="tab-row group">
        <a
          href={tab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-baseline gap-0 min-w-0 text-left"
          title={tab.url}
        >
          {tab.title && (
            <span className="flex items-center min-w-0 max-w-1/2">
              <span className="tab-title" title={tab.title}>
                {tab.title}
              </span>
              <span className="px-2 font-extrabold text-ink-faint/50" aria-hidden="true">
                |
              </span>
            </span>
          )}
          <span
            className={`tab-url text-url ${tab.title ? 'flex-1 basis-1/2 max-w-1/2' : 'basis-full'}`}
            title={tab.url}
          >
            {tab.url}
          </span>
        </a>
        {onDelete && (
          <button type="button" onClick={onDelete} className="tab-delete">
            删除
          </button>
        )}
      </div>
    </li>
  );
});
