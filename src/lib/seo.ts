/**
 * Production site URL, supplied at build time via the VITE_SITE_URL
 * environment variable (Cloudflare Pages -> Settings -> Variables).
 *
 * While it is unset we deliberately emit NO canonical / og:url tags rather
 * than publishing an incorrect absolute URL.
 */
const raw = (import.meta.env.VITE_SITE_URL ?? "").trim();

export const SITE_URL = raw.replace(/\/+$/, "");

export function absoluteUrl(path: string): string | null {
  if (!SITE_URL) return null;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type MetaTag = Record<string, string>;

/** Canonical + og:url + og:image, omitted entirely when no site URL is configured. */
export function seoUrlTags(path: string): { meta: MetaTag[]; links: MetaTag[] } {
  const url = absoluteUrl(path);
  const image = absoluteUrl("/images/og-image.jpg");
  if (!url || !image) return { meta: [], links: [] };
  return {
    meta: [
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
