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
  favorite?: boolean; // 前端用于UI状态，不存储在数据库
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
      })
      .upgrade(async (tx) => {
        // 从旧版本迁移：将 favorite=true 的会话移到 favorites 表
        const favoriteSessions: any[] = [];
        await tx.table('sessions').toCollection().each((session: any) => {
          if (session.favorite === true) {
            const { favorite, ...sessionData } = session;
            favoriteSessions.push(sessionData);
          }
        });

        if (favoriteSessions.length > 0) {
          await tx.table('favorites').bulkAdd(favoriteSessions);
        }

        // 清理 sessions 表中的 favorite 字段
        await tx.table('sessions').toCollection().modify((session: any) => {
          delete session.favorite;
        });
      });
  }
}

export const historyDb = new ClosedTabsDb();
