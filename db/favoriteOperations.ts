import { historyDb, type HistorySession } from './database';

/**
 * 获取所有收藏的会话
 * @returns 收藏会话数组
 */
export async function getFavoriteSessions(): Promise<HistorySession[]> {
  return historyDb.favorites.orderBy('closedAt').reverse().toArray();
}

/**
 * 将会话收藏（从历史表移到收藏表）
 * @param sessionId 会话ID
 * @returns 成功返回true
 */
export async function addToFavorite(sessionId: number): Promise<boolean> {
  try {
    const historySession = await historyDb.sessions.get(sessionId);
    if (!historySession) {
      console.error('Session not found in history:', sessionId);
      return false;
    }

    await historyDb.favorites.add(historySession);
    await historyDb.sessions.delete(sessionId);
    return true;
  } catch (error) {
    console.error('Error adding to favorite:', error);
    return false;
  }
}

/**
 * 取消收藏（直接删除，不移到历史表）
 * @param sessionId 会话ID
 * @returns 成功返回true
 */
export async function removeFromFavorite(sessionId: number): Promise<boolean> {
  try {
    const exists = await historyDb.favorites.get(sessionId);
    if (!exists) {
      console.error('Session not found in favorites:', sessionId);
      return false;
    }
    await historyDb.favorites.delete(sessionId);
    return true;
  } catch (error) {
    console.error('Error removing from favorite:', error);
    return false;
  }
}

/**
 * 切换收藏状态
 * @param sessionId 会话ID
 * @returns 切换后的收藏状态，null表示操作失败
 */
export async function toggleHistorySessionFavorite(sessionId: number): Promise<boolean | null> {
  const historySession = await historyDb.sessions.get(sessionId);
  if (historySession) {
    return (await addToFavorite(sessionId)) ? true : null;
  }

  const favoriteSession = await historyDb.favorites.get(sessionId);
  if (favoriteSession) {
    return (await removeFromFavorite(sessionId)) ? false : null;
  }

  console.error('Session not found:', sessionId);
  return null;
}
