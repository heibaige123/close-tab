import { dedupeTabsByNormalizedUrl } from '@/utils/url';
import { historyDb, type HistorySession, MAX_HISTORY_SESSIONS } from './database';
import { removeDuplicateUrlsFromHistory } from './deduplication';

/**
 * 添加历史会话
 * @param session 要添加的会话
 * @param maxSessions 保留的最大会话数
 */
export async function addHistorySession(
  session: HistorySession,
  maxSessions = MAX_HISTORY_SESSIONS
): Promise<void> {
  const dedupedTabs = dedupeTabsByNormalizedUrl(session.tabs);
  await removeDuplicateUrlsFromHistory(dedupedTabs.map((tab) => tab.url));

  await historyDb.sessions.add({ ...session, tabs: dedupedTabs });
  await cleanupOldHistorySessions(maxSessions);
}

/**
 * 清理超出限制的旧历史会话
 * @param maxSessions 保留的最大会话数
 */
async function cleanupOldHistorySessions(maxSessions: number): Promise<void> {
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

/**
 * 获取历史会话列表
 * @param limit 限制数量
 * @returns 历史会话数组
 */
export async function getHistorySessions(limit = MAX_HISTORY_SESSIONS): Promise<HistorySession[]> {
  if (limit <= 0) return [];
  return historyDb.sessions.orderBy('closedAt').reverse().limit(limit).toArray();
}

/**
 * 删除指定的历史会话
 * @param sessionId 会话ID
 */
export async function deleteHistorySession(sessionId: number): Promise<void> {
  const inHistory = await historyDb.sessions.get(sessionId);
  if (inHistory) {
    await historyDb.sessions.delete(sessionId);
    return;
  }

  const inFavorite = await historyDb.favorites.get(sessionId);
  if (inFavorite) {
    await historyDb.favorites.delete(sessionId);
  }
}

/**
 * 删除所有历史会话和收藏
 */
export async function deleteAllHistorySessions(): Promise<void> {
  await historyDb.sessions.clear();
  await historyDb.favorites.clear();
}

/**
 * 更新会话的标签页
 * @param sessionId 会话ID
 * @param tabs 新的标签页列表
 */
export async function updateHistorySessionTabs(
  sessionId: number,
  tabs: HistorySession['tabs']
): Promise<void> {
  if (!tabs.length) {
    await deleteHistorySession(sessionId);
    return;
  }

  const inHistory = await historyDb.sessions.get(sessionId);
  if (inHistory) {
    await historyDb.sessions.update(sessionId, { tabs });
    return;
  }

  const inFavorite = await historyDb.favorites.get(sessionId);
  if (inFavorite) {
    await historyDb.favorites.update(sessionId, { tabs });
  }
}
