import type { ClosedTab } from '@/db';

/**
 * 规范化 URL，去除多余的斜杠和哈希参数，确保同一页面的不同 URL 形式被识别为同一页面
 * @param url 要规范化的 URL 字符串
 * @returns 规范化后的 URL，如果输入无效则返回原字符串
 */
export function normalizeUrl(url: string): string {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

  try {
    const parsed = new URL(trimmedUrl);
    parsed.hash = '';
    const normalizedPath = parsed.pathname.replace(/\/+$/, '');
    parsed.pathname = normalizedPath || '/';
    return parsed.toString();
  } catch {
    return trimmedUrl;
  }
}

/**
 * 根据规范化后的 URL 去重标签页，避免同一页面的多个标签被重复保存
 * @param tabs 要去重的标签页数组
 * @returns 去重后的标签页数组
 */
export function dedupeTabsByNormalizedUrl(tabs: ClosedTab[]): ClosedTab[] {
  const seen = new Set<string>();
  return tabs.filter((tab) => {
    const normalizedUrl = normalizeUrl(tab.url);
    if (seen.has(normalizedUrl)) return false;
    seen.add(normalizedUrl);
    return true;
  });
}

/**
 * 从 URL 中提取域名，作为标签页的简要信息显示
 * @param url 标签页 URL
 * @returns 域名字符串，如果 URL 无效则返回 '未知域名'
 */
export function getTabDomain(url: string | undefined): string {
  if (!url) return '未知域名';
  try {
    return new URL(url).hostname || '未知域名';
  } catch {
    return '未知域名';
  }
}