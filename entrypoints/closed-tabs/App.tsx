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
        <div className="p-5 min-h-screen">
            <main className="mx-auto w-full max-w-4xl">
                <header className={hasHistory ? 'flex justify-between items-end gap-3 mb-5' : 'mb-5'}>
                    <div>
                        <h1 className="font-semibold text-slate-900 text-2xl tracking-tight">已关闭的标签页</h1>
                        <p className="mt-1 text-slate-500 text-sm">{subtitle}</p>
                    </div>
                    {hasHistory && (
                        <div className="flex items-center gap-2">
                            <span className="bg-white px-3 py-1 border border-slate-200 rounded-full font-medium text-slate-600 text-xs">
                                共 {history.length} 组
                            </span>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="bg-white px-2.5 py-1 border border-slate-200 hover:border-red-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 font-medium text-slate-600 hover:text-red-700 text-sm transition"
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
                    <section className="backdrop-blur-[2px] backdrop-saturate-[1.2] px-6 py-10 border border-slate-200/80 rounded-2xl text-center">
                        <p className="font-medium text-slate-700 text-sm">暂无关闭记录</p>
                        <p className="mt-1 text-slate-500 text-xs">点击扩展图标后，当前标签页会出现在这里</p>
                    </section>
                )}
            </main>
        </div>
    );
}
