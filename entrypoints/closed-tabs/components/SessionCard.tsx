import type { ClosedTab, HistorySession } from '../state/atoms';
import { ClosedTabItem } from './ClosedTabItem';
import { formatTime } from '../utils/formatTime';

function groupTabsByDomain(tabs: ClosedTab[]) {
    const groups = new Map<string, ClosedTab[]>();

    tabs.forEach((tab) => {
        let domain = tab.domain || '未知域名';
        if (!tab.domain && tab.url) {
            try {
                domain = new URL(tab.url).hostname || domain;
            } catch {
                domain = '未知域名';
            }
        }

        const existing = groups.get(domain);
        if (existing) {
            existing.push(tab);
        } else {
            groups.set(domain, [tab]);
        }
    });

    return Array.from(groups, ([domain, items]) => ({ domain, items })).sort((a, b) => {
        if (a.domain === '未知域名' && b.domain !== '未知域名') return 1;
        if (b.domain === '未知域名' && a.domain !== '未知域名') return -1;
        return a.domain.localeCompare(b.domain);
    });
}

export function SessionCard({
    session,
    onDeleteSession,
    onDeleteTab,
}: {
    session: HistorySession;
    onDeleteSession?: (sessionId: number | undefined) => void;
    onDeleteTab?: (sessionId: number | undefined, tabUrl: string) => void;
}) {
    const openAll = () => {
        if (!session.tabs?.length) return;
        session.tabs.forEach((tab: ClosedTab) => {
            if (tab.url) browser.tabs.create({ url: tab.url });
        });
    };

    const removeSession = () => {
        onDeleteSession?.(session.id);
    };

    const groupedTabs = groupTabsByDomain(session.tabs);

    return (
        <section className="session-card rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                <button
                    type="button"
                    onClick={openAll}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                    全部还原
                </button>
                <button
                    type="button"
                    onClick={removeSession}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                    一键删除
                </button>
                <p className="flex-1 text-sm text-slate-600">共 {session.tabs.length} 个标签页</p>
                <span className="text-xs text-slate-500">{formatTime(session.closedAt)}</span>
            </div>
            <ul className="space-y-3">
                {groupedTabs.map((group) => (
                    <li
                        key={group.domain}
                        className="rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-2.5"
                    >
                        <div className="mb-1.5 flex items-center gap-1.5 text-sm text-slate-700">
                            <span className="break-all font-semibold text-slate-900">{group.domain}</span>
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{group.items.length}</span>
                        </div>
                        <ul className="space-y-1.5 border-l border-slate-200 pl-3.5">
                            {group.items.map((tab: ClosedTab, i: number) => (
                                <ClosedTabItem
                                    key={`${tab.url}-${i}`}
                                    tab={tab}
                                    onDelete={() => onDeleteTab?.(session.id, tab.url)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    );
}
