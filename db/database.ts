import Dexie, { type Table } from 'dexie';

export const MAX_HISTORY_SESSIONS = 50;

export interface ClosedTab {
  url: string;
  title: string;
}

export interface HistorySession {
  tabs: ClosedTab[];
  closedAt: number;
  id?: number;
}

/**
 * 已关闭标签页数据库
 * 使用两个独立的表：sessions（历史记录）和 favorites（收藏）
 */
class ClosedTabsDb extends Dexie {
  sessions!: Table<HistorySession, number>;
  favorites!: Table<HistorySession, number>;

  constructor() {
    super('closedTabsDb');
    
    // 版本 3：双表设计（sessions + favorites）
    this.version(3)
      .stores({
        sessions: '++id, closedAt',
        favorites: '++id, closedAt',
      });
  }
}

export const historyDb = new ClosedTabsDb();
