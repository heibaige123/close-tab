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
  const groupsMap = new Map<string, ClosedTab[]>();

  tabs.forEach((tab) => {
    const domain = getTabDomain(tab.url);
    const existing = groupsMap.get(domain);
    
    if (existing) {
      existing.push(tab);
    } else {
      groupsMap.set(domain, [tab]);
    }
  });

  // 转换为数组并排序
  return Array.from(groupsMap, ([domain, items]) => ({ domain, items })).sort((a, b) => {
    return a.domain.localeCompare(b.domain);
  });
}
