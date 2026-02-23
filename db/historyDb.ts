import { dedupeTabsByNormalizedUrl, normalizeUrl } from '@/utils/url';
import Dexie, { type Table } from 'dexie';

export const MAX_HISTORY_SESSIONS = 50;

export interface ClosedTab {
  url: string;
  title: string;
  domain: string;
}

export interface HistorySession {
  tabs: ClosedTab[];
  closedAt: number;
  id?: number;
}

class ClosedTabsDb extends Dexie {
  sessions!: Table<HistorySession, number>;

  constructor() {
    super('closedTabsDb');
    this.version(1).stores({
      sessions: '++id, closedAt',
    });
  }
}

export const historyDb = new ClosedTabsDb();

async function removeDuplicateUrlsFromHistory(urls: string[]) {
  if (!urls.length) return;

  const targetUrls = new Set(urls.map(normalizeUrl));

  await historyDb.transaction('rw', historyDb.sessions, async () => {
    const sessions = await historyDb.sessions.toArray();

    for (const session of sessions) {
      if (session.id === undefined || !session.tabs?.length) continue;

      const filteredTabs = session.tabs.filter((tab) => !targetUrls.has(normalizeUrl(tab.url)));

      if (filteredTabs.length === session.tabs.length) continue;

      if (!filteredTabs.length) {
        await historyDb.sessions.delete(session.id);
        continue;
      }

      await historyDb.sessions.update(session.id, { tabs: filteredTabs });
    }
  });
}

export async function addHistorySession(session: HistorySession, maxSessions = MAX_HISTORY_SESSIONS) {
  const dedupedTabs = dedupeTabsByNormalizedUrl(session.tabs);
  await removeDuplicateUrlsFromHistory(dedupedTabs.map((tab) => tab.url));

  await historyDb.sessions.add({ ...session, tabs: dedupedTabs });
  if (maxSessions <= 0) return;

  const extra = await historyDb.sessions
    .orderBy('closedAt')
    .reverse()
    .offset(maxSessions)
    .toArray();

  if (!extra.length) return;

  const extraIds = extra.map((record) => record.id).filter((id): id is number => id !== undefined);
  if (extraIds.length) await historyDb.sessions.bulkDelete(extraIds);
}

export async function getHistorySessions(limit = MAX_HISTORY_SESSIONS) {
  if (limit <= 0) return [];
  return historyDb.sessions.orderBy('closedAt').reverse().limit(limit).toArray();
}

export async function deleteHistorySession(sessionId: number) {
  await historyDb.sessions.delete(sessionId);
}

export async function deleteAllHistorySessions() {
  await historyDb.sessions.clear();
}

export async function updateHistorySessionTabs(sessionId: number, tabs: ClosedTab[]) {
  if (!tabs.length) {
    await historyDb.sessions.delete(sessionId);
    return;
  }

  await historyDb.sessions.update(sessionId, { tabs });
}
