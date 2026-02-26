import type { ClosedTab } from '@/db';
import { getTabDomain } from './url';

export interface TabGroup {
  domain: string;
  items: ClosedTab[];
}

/**
 * 按域名分组标签页
 * @param tabs 标签页列表
 * @returns 分组后的标签页
 */
export function groupTabsByDomain(tabs: ClosedTab[]): TabGroup[] {
  const groups = new Map<string, ClosedTab[]>();

  tabs.forEach((tab) => {
    const domain = tab.domain || getTabDomain(tab.url);
    const existing = groups.get(domain);
    
    if (existing) {
      existing.push(tab);
    } else {
      groups.set(domain, [tab]);
    }
  });

  // 转换为数组并排序
  return Array.from(groups, ([domain, items]) => ({ domain, items })).sort((a, b) => {
    // 未知域名排在最后
    if (a.domain === '未知域名' && b.domain !== '未知域名') return 1;
    if (b.domain === '未知域名' && a.domain !== '未知域名') return -1;
    return a.domain.localeCompare(b.domain);
  });
}
