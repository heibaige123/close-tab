import { memo, useCallback, useMemo } from 'react';
import type { HistorySession } from '@/db';
import { groupTabsByDomain } from '@/utils/tabUtils';
import { formatTime } from '../utils/formatTime';
import { Button } from './Button';
import { FavoriteButton } from './FavoriteButton';
import { ClosedTabItem } from './ClosedTabItem';

type SessionCardProps = {
  session: HistorySession;
  onDeleteSession: (sessionId: number | undefined) => void;
  onDeleteTab: (sessionId: number | undefined, tabUrl: string) => void;
  onToggleFavorite: (sessionId: number | undefined) => void;
  isFavorite?: boolean;
  showActions?: boolean;
};

/**
 * 单个会话卡片组件
 * 展示一个已关闭的标签页会话
 */
export const SessionCard = memo(function SessionCard({
  session,
  onDeleteSession,
  onDeleteTab,
  onToggleFavorite,
  isFavorite = false,
  showActions = true,
}: SessionCardProps) {
  const groupedTabs = useMemo(() => groupTabsByDomain(session.tabs), [session.tabs]);

  const handleOpenAll = useCallback(() => {
    if (!session.tabs.length) return;
    session.tabs.forEach((tab) => {
      if (tab.url) browser.tabs.create({ url: tab.url });
    });
  }, [session.tabs]);

  const handleRemoveSession = useCallback(() => {
    onDeleteSession(session.id);
  }, [onDeleteSession, session.id]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(session.id);
  }, [onToggleFavorite, session.id]);

  return (
    <section className="card-shell">
      <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-line">
        <Button variant="primary" onClick={handleOpenAll}>
          全部还原
        </Button>
        {showActions && (
          <Button variant="danger" onClick={handleRemoveSession}>
            一键删除
          </Button>
        )}
        <p className="session-tab-count flex-1 text-label text-ink-muted text-sm">
          共 <span className="session-tab-count-num">{session.tabs.length}</span> 个标签页
        </p>
        <span className="text-metric text-ink-faint text-xs">{formatTime(session.closedAt)}</span>
        <FavoriteButton isFavorite={isFavorite} onToggle={handleToggleFavorite} />
      </div>

      <ul className="space-y-3">
        {groupedTabs.map((group) => (
          <li key={group.domain} className="group-shell">
            <div className="flex items-center gap-1.5 mb-1.5 text-ink-muted text-sm">
              <span className="font-semibold text-label text-ink break-all">{group.domain}</span>
              <span className="text-metric domain-count">{group.items.length}</span>
            </div>

            <ul className="space-y-1.5 pl-3.5 border-l border-line">
              {group.items.map((tab, index) => (
                <ClosedTabItem
                  key={`${tab.url}-${index}`}
                  tab={tab}
                  onDelete={showActions ? () => onDeleteTab(session.id, tab.url) : undefined}
                />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
});
