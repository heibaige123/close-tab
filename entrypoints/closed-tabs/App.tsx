import { useEffect, useState } from 'react';
import type { HistorySession } from '../../db/historyDb';
import {
    deleteAllHistorySessions,
    deleteHistorySession,
    getHistorySessions,
    MAX_HISTORY_SESSIONS,
    updateHistorySessionTabs,
} from '../../db/historyDb';
import { SessionCard } from './components/SessionCard';

export default function App() {
    const [history, setHistory] = useState<HistorySession[]>([]);
    const hasHistory = history.length > 0;
    const subtitle = hasHistory
        ? '按会话分组，支持全部还原与逐条管理'
        : '可快速恢复浏览上下文，也可按条目清理历史';

    useEffect(() => {
        getHistorySessions(MAX_HISTORY_SESSIONS).then((list) => {
            setHistory(list);
        });
    }, []);

    const handleDeleteSession = async (sessionId: number | undefined) => {
        if (!sessionId) return;
        await deleteHistorySession(sessionId);
        setHistory((current) => current.filter((session) => session.id !== sessionId));
    };

    const handleDeleteTab = async (sessionId: number | undefined, tabUrl: string) => {
        if (!sessionId) return;
        const session = history.find((item) => item.id === sessionId);
        if (!session) return;

        const nextTabs = session.tabs.filter((tab) => tab.url !== tabUrl);
        if (!nextTabs.length) {
            await deleteHistorySession(sessionId);
            setHistory((current) => current.filter((item) => item.id !== sessionId));
            return;
        }

        await updateHistorySessionTabs(sessionId, nextTabs);
        setHistory((current) =>
            current.map((item) => (item.id === sessionId ? { ...item, tabs: nextTabs } : item))
        );
    };

    const handleClearAll = async () => {
        await deleteAllHistorySessions();
        setHistory([]);
    };

    return (
        <div className="app-shell app-surface">
            <main className="page-inner">
                <header className={`page-header ${hasHistory ? 'page-header--actions' : ''}`.trim()}>
                    <div>
                        <h1 className="page-title">已关闭的标签页</h1>
                        <p className="page-subtitle">{subtitle}</p>
                    </div>
                    {hasHistory && (
                        <div className="header-actions">
                            <span className="badge">
                                共 {history.length} 组
                            </span>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="btn btn--danger"
                            >
                                清空全部记录
                            </button>
                        </div>
                    )}
                </header>
                {hasHistory ? (
                    <div className="space-y-4">
                        {history.map((session, index) => (
                            <SessionCard
                                key={`${session.closedAt}-${index}`}
                                session={session}
                                onDeleteSession={handleDeleteSession}
                                onDeleteTab={handleDeleteTab}
                            />
                        ))}
                    </div>
                ) : (
                    <section className="empty-state">
                        <p className="font-medium text-slate-700 text-sm">暂无关闭记录</p>
                        <p className="mt-1 text-slate-500 text-xs">点击扩展图标后，当前标签页会出现在这里</p>
                    </section>
                )}
            </main>
        </div>
    );
}
