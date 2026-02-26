import { ClosedTab } from "@/db";

export function normalizeUrl(url: string) {
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

export function dedupeTabsByNormalizedUrl(tabs: ClosedTab[]) {
    const seen = new Set<string>();
    return tabs.filter((tab) => {
        const normalizedUrl = normalizeUrl(tab.url);
        if (seen.has(normalizedUrl)) return false;
        seen.add(normalizedUrl);
        return true;
    });
}

export function getTabDomain(url: string | undefined) {
    if (!url) return '未知域名';
    try {
        return new URL(url).hostname || '未知域名';
    } catch {
        return '未知域名';
    }
}