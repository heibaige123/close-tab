import type { ClosedTab, HistorySession } from '../../../db/historyDb';
import { getTabDomain } from '../../../utils/url';
import { ClosedTabItem } from './ClosedTabItem';
import { formatTime } from '../utils/formatTime';

function groupTabsByDomain(tabs: ClosedTab[]) {
    const groups = new Map<string, ClosedTab[]>();

    tabs.forEach((tab) => {
        const domain = tab.domain || getTabDomain(tab.url);

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
        <section className="bg-white/95 shadow-sm hover:shadow-md p-4 border border-slate-200/80 rounded-2xl transition session-card">
            <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-slate-100 border-b">
                <button
                    type="button"
                    onClick={openAll}
                    className="bg-white px-2.5 py-1 border border-slate-200 hover:border-blue-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 font-medium text-slate-700 hover:text-blue-700 text-sm transition"
                >
                    全部还原
                </button>
                <button
                    type="button"
                    onClick={removeSession}
                    className="bg-white px-2.5 py-1 border border-slate-200 hover:border-red-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 font-medium text-slate-600 hover:text-red-700 text-sm transition"
                >
                    一键删除
                </button>
                <p className="flex-1 text-slate-600 text-sm">共 {session.tabs.length} 个标签页</p>
                <span className="text-slate-500 text-xs">{formatTime(session.closedAt)}</span>
            </div>
            <ul className="space-y-3">
                {groupedTabs.map((group) => (
                    <li
                        key={group.domain}
                        className="bg-slate-50/40 px-3 py-2.5 border border-slate-100 rounded-xl"
                    >
                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-700 text-sm">
                            <span className="font-semibold text-slate-900 break-all">{group.domain}</span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-500 text-xs">{group.items.length}</span>
                        </div>
                        <ul className="space-y-1.5 pl-3.5 border-slate-200 border-l">
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
