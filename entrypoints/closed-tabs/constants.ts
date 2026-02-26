type ViewConfig = {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  label: string;
  icon: string;
};

export const VIEW_CONFIG = {
  history: {
    title: '已关闭的标签页',
    subtitle: '按会话分组，支持全部还原与逐条管理',
    emptyTitle: '暂无记录',
    emptyDescription: '点击扩展图标后，当前标签页会出现在这里',
    label: '历史',
    icon: 'H',
  },
  favorites: {
    title: '收藏的历史',
    subtitle: '只保留你标星的会话，随时可取消收藏',
    emptyTitle: '暂无记录',
    emptyDescription: '去历史页点星星收藏你想保留的会话',
    label: '收藏',
    icon: '★',
  },
} as const satisfies Record<'history' | 'favorites', ViewConfig>;

export type ViewMode = keyof typeof VIEW_CONFIG;

export const VIEW_ORDER: ViewMode[] = ['history', 'favorites'];
