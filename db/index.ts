/**
 * 历史记录数据库导出
 * 提供统一的API接口
 */

// 导出所有功能
export { historyDb, MAX_HISTORY_SESSIONS, type ClosedTab, type HistorySession } from './database';
export { removeDuplicateUrlsFromHistory } from './deduplication';
export {
  addHistorySession,
  getHistorySessions,
  deleteHistorySession,
  deleteAllHistorySessions,
  updateHistorySessionTabs,
} from './sessionOperations';
export {
  getFavoriteSessions,
  addToFavorite,
  removeFromFavorite,
  toggleHistorySessionFavorite,
} from './favoriteOperations';
