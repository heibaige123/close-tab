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
  showActions = true,
}: SessionCardProps) {
  const groupedTabs = useMemo(() => groupTabsByDomain(session.tabs), [session.tabs]);

  // 打开所有标签页
  const handleOpenAll = useCallback(() => {
    if (!session.tabs?.length) return;
    session.tabs.forEach((tab) => {
      if (tab.url) browser.tabs.create({ url: tab.url });
    });
  }, [session.tabs]);

  // 删除会话
  const handleRemoveSession = useCallback(() => {
    onDeleteSession(session.id);
  }, [onDeleteSession, session.id]);

  // 切换收藏
  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(session.id);
  }, [onToggleFavorite, session.id]);

  return (
    <section className="bg-white/95 shadow-sm hover:shadow-md backdrop-blur-[2px] backdrop-saturate-[1.2] p-4 border border-slate-200/80 rounded-2xl transition">
      {/* 标题栏 */}
      <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-slate-100 border-b">
        <Button variant="primary" onClick={handleOpenAll}>
          全部还原
        </Button>
        {showActions && (
          <Button variant="danger" onClick={handleRemoveSession}>
            一键删除
          </Button>
        )}
        <p className="flex-1 text-slate-600 text-sm">共 {session.tabs.length} 个标签页</p>
        <span className="text-slate-500 text-xs">{formatTime(session.closedAt)}</span>
        <FavoriteButton isFavorite={Boolean(session.favorite)} onToggle={handleToggleFavorite} />
      </div>

      {/* 标签页列表 */}
      <ul className="space-y-3">
        {groupedTabs.map((group) => (
          <li key={group.domain} className="bg-slate-50/40 px-3 py-2.5 border border-slate-100 rounded-xl">
            {/* 域名分组标题 */}
            <div className="flex items-center gap-1.5 mb-1.5 text-slate-700 text-sm">
              <span className="font-semibold text-slate-900 break-all">{group.domain}</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-500 text-xs">
                {group.items.length}
              </span>
            </div>

            {/* 标签页项列表 */}
            <ul className="space-y-1.5 pl-3.5 border-slate-200 border-l">
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
