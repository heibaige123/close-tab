import { getTabDomain } from '@/utils/url';
import { addHistorySession, MAX_HISTORY_SESSIONS, type HistorySession } from '../db';

export default defineBackground(() => {
    // 点击扩展图标：保存当前所有 tab 到本地历史 → 先打开管理页 → 再关闭其余 tab
    browser.action.onClicked.addListener(async () => {
        const tabs = await browser.tabs.query({});
        const closedTabsUrl = browser.runtime.getURL('/closed-tabs.html' as '/closed-tabs.html');
        const isClosedTabsPage = (tab: Browser.tabs.Tab) => tab.url?.startsWith(closedTabsUrl) ?? false;
        const targetTabs = tabs.filter((tab) => !isClosedTabsPage(tab));
        const tabIds = tabs.map((tab) => tab.id).filter((id): id is number => id !== undefined);
        if (tabIds.length === 0 || targetTabs.length === 0) return;

        const tabList = targetTabs.map((tab) => ({
            url: tab.url ?? '',
            title: tab.title ?? tab.url ?? '(无标题)'
        }));

        const newSession: HistorySession = {
            tabs: tabList,
            closedAt: Date.now(),
        };

        await addHistorySession(newSession, MAX_HISTORY_SESSIONS);

        // 先打开管理页，再关闭原标签，否则关闭全部 tab 时窗口会一起关闭
        await browser.tabs.create({
            url: closedTabsUrl,
        });
        await browser.tabs.remove(tabIds);
    });
});
