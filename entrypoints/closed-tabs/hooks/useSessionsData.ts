import { useCallback, useEffect, useState } from 'react';
import type { HistorySession } from '@/db';
import {
  deleteAllHistorySessions,
  deleteHistorySession,
  getFavoriteSessions,
  getHistorySessions,
  MAX_HISTORY_SESSIONS,
  toggleHistorySessionFavorite,
  updateHistorySessionTabs,
} from '@/db';

interface UseSessionsDataReturn {
  historyList: HistorySession[];
  favoriteList: HistorySession[];
  isLoading: boolean;
  
  // Data loading functions
  loadHistory: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  reloadAll: () => Promise<void>;
  
  // Data mutation functions
  deleteSession: (sessionId: number | undefined) => Promise<void>;
  deleteTab: (sessionId: number | undefined, tabUrl: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
  toggleFavorite: (sessionId: number | undefined) => Promise<void>;
}

/**
 * 管理会话数据的加载和操作
 * 分离数据逻辑和UI逻辑
 */
export function useSessionsData(): UseSessionsDataReturn {
  const [historyList, setHistoryList] = useState<HistorySession[]>([]);
  const [favoriteList, setFavoriteList] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 加载历史记录
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await getHistorySessions(MAX_HISTORY_SESSIONS);
      setHistoryList(list);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 加载收藏记录
  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await getFavoriteSessions();
      // 添加 favorite: true 标记用于UI显示
      const favoritesWithFlag = list.map((session) => ({ ...session, favorite: true }));
      setFavoriteList(favoritesWithFlag);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 重新加载所有数据
  const reloadAll = useCallback(async () => {
    await Promise.all([loadHistory(), loadFavorites()]);
  }, [loadHistory, loadFavorites]);

  // 删除会话
  const deleteSession = useCallback(
    async (sessionId: number | undefined) => {
      if (!sessionId) return;
      try {
        await deleteHistorySession(sessionId);
        await reloadAll();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    },
    [reloadAll]
  );

  // 删除标签页
  const deleteTab = useCallback(
    async (sessionId: number | undefined, tabUrl: string) => {
      if (!sessionId) return;

      let nextTabs: HistorySession['tabs'] | null = null;
      let shouldDeleteSession = false;

      // 同时更新两个列表
      setHistoryList((current) => {
        const session = current.find((item) => item.id === sessionId);
        if (!session) return current;

        nextTabs = session.tabs.filter((tab) => tab.url !== tabUrl);
        if (!nextTabs.length) {
          shouldDeleteSession = true;
          return current.filter((item) => item.id !== sessionId);
        }

        return current.map((item) =>
          item.id === sessionId ? { ...item, tabs: nextTabs ?? item.tabs } : item
        );
      });

      setFavoriteList((current) => {
        const session = current.find((item) => item.id === sessionId);
        if (!session) return current;

        nextTabs = session.tabs.filter((tab) => tab.url !== tabUrl);
        if (!nextTabs.length) {
          shouldDeleteSession = true;
          return current.filter((item) => item.id !== sessionId);
        }

        return current.map((item) =>
          item.id === sessionId ? { ...item, tabs: nextTabs ?? item.tabs } : item
        );
      });

      if (!nextTabs) return;

      try {
        if (shouldDeleteSession) {
          await deleteHistorySession(sessionId);
        } else {
          await updateHistorySessionTabs(sessionId, nextTabs);
        }
      } catch (error) {
        console.error('Failed to delete tab:', error);
        await reloadAll();
      }
    },
    [reloadAll]
  );

  // 清空所有会话
  const clearAllSessions = useCallback(async () => {
    try {
      await deleteAllHistorySessions();
      setHistoryList([]);
      setFavoriteList([]);
    } catch (error) {
      console.error('Failed to clear all sessions:', error);
    }
  }, []);

  // 切换收藏状态
  const toggleFavorite = useCallback(
    async (sessionId: number | undefined) => {
      if (!sessionId) return;

      try {
        const result = await toggleHistorySessionFavorite(sessionId);
        if (result !== null) {
          await reloadAll();
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
      }
    },
    [reloadAll]
  );

  // 挂载时加载数据
  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  return {
    historyList,
    favoriteList,
    isLoading,
    loadHistory,
    loadFavorites,
    reloadAll,
    deleteSession,
    deleteTab,
    clearAllSessions,
    toggleFavorite,
  };
}
