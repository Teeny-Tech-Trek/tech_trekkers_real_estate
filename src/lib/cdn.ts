const CDN_BASE = (import.meta.env.VITE_ASSET_CDN_URL || "").replace(/\/+$/, "");

const isAbsoluteUrl = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://");

export const toCdnUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (!CDN_BASE || !isAbsoluteUrl(url)) return url;

  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\/+/, "");
    return `${CDN_BASE}/${path}`;
  } catch {
    return url;
  }
};
