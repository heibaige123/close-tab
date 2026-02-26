import { useCallback, useState } from 'react';
import { useSessionsData } from './hooks/useSessionsData';
import { VIEW_CONFIG, type ViewMode } from './constants';
import { EmptyState } from './components/EmptyState';
import { PageHeader } from './components/PageHeader';
import { SessionCard } from './components/SessionCard';
import { SidebarNav } from './components/SidebarNav';
import { Button } from './components/Button';

/**
 * 主应用组件
 * 管理页面布局和视图切换
 */
export default function App() {
  const [view, setView] = useState<ViewMode>('history');
  const { historyList, favoriteList, deleteSession, deleteTab, clearAllSessions, toggleFavorite } =
    useSessionsData();

  // 根据当前视图选择数据
  const visibleSessions = view === 'history' ? historyList : favoriteList;
  const sessionCount = visibleSessions.length;
  const hasSessions = sessionCount > 0;
  const viewConfig = VIEW_CONFIG[view];
  const subtitle = hasSessions ? viewConfig.subtitle : viewConfig.emptyDescription;

  // 处理视图变更
  const handleChangeView = useCallback((nextView: ViewMode) => {
    setView(nextView);
  }, []);

  return (
    <div className="bg-[radial-gradient(circle_at_12%_8%,rgb(248_250_252)_0%,rgb(226_232_240)_42%),linear-gradient(120deg,rgba(15,23,42,0.06)_0%,transparent_60%)] min-h-screen overflow-x-hidden">
      <SidebarNav view={view} count={sessionCount} onChange={handleChangeView} />
      <div className="py-6 pr-5 pl-28">
        <main className="mx-auto w-full min-w-0 max-w-6xl">
          <PageHeader
            title={viewConfig.title}
            subtitle={subtitle}
            actions={
              hasSessions && view === 'history' ? (
                <div className="flex items-center gap-2">
                  <span className="badge">共 {sessionCount} 组</span>
                  <Button variant="danger" onClick={clearAllSessions}>
                    清空全部记录
                  </Button>
                </div>
              ) : null
            }
          />
          {hasSessions ? (
            <div className="space-y-4">
              {visibleSessions.map((session) => (
                <SessionCard
                  key={session.id ?? session.closedAt}
                  session={session}
                  onDeleteSession={deleteSession}
                  onDeleteTab={deleteTab}
                  onToggleFavorite={toggleFavorite}
                  showActions={view === 'history'}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={viewConfig.emptyTitle} description={viewConfig.emptyDescription} />
          )}
        </main>
      </div>
    </div>
  );
}
