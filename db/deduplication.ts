import type { Table } from 'dexie';
import { normalizeUrl } from '@/utils/url';
import { historyDb, type ClosedTab, type HistorySession } from './database';

/**
 * 从历史记录表中移除与指定 URL 重复的标签页
 * @param urls 要去重的URL列表
 */
export async function removeDuplicateUrlsFromHistory(urls: string[]): Promise<void> {
  if (!urls.length) return;

  const targetUrls = new Set(urls.map(normalizeUrl));

  await historyDb.transaction('rw', historyDb.sessions, async () => {
    await removeDuplicatesFromTable(historyDb.sessions, targetUrls);
  });
}

/**
 * 从单个表中移除重复的URL
 * @param table 目标表
 * @param targetUrls 要去重的URL集合
 */
async function removeDuplicatesFromTable(
  table: Table<HistorySession, number>,
  targetUrls: Set<string>
): Promise<void> {
  const sessions = await table.toArray();

  for (const session of sessions) {
    if (session.id === undefined || !session.tabs.length) continue;

    const filteredTabs = session.tabs.filter(
      (tab: ClosedTab) => !targetUrls.has(normalizeUrl(tab.url))
    );

    if (filteredTabs.length === session.tabs.length) continue;

    if (!filteredTabs.length) {
      await table.delete(session.id);
      continue;
    }

    await table.update(session.id, { tabs: filteredTabs });
  }
}
