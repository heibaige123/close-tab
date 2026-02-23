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
        <section className="card session-card">
            <div className="card-header">
                <button
                    type="button"
                    onClick={openAll}
                    className="btn btn--primary"
                >
                    全部还原
                </button>
                <button
                    type="button"
                    onClick={removeSession}
                    className="btn btn--danger"
                >
                    一键删除
                </button>
                <p className="flex-1 meta">共 {session.tabs.length} 个标签页</p>
                <span className="meta-small">{formatTime(session.closedAt)}</span>
            </div>
            <ul className="space-y-3">
                {groupedTabs.map((group) => (
                    <li key={group.domain} className="group-card">
                        <div className="group-header">
                            <span className="group-title">{group.domain}</span>
                            <span className="group-count">{group.items.length}</span>
                        </div>
                        <ul className="group-list">
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
