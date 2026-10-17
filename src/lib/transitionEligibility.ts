/**
 * Decides whether a click is a *genuine internal navigation* that should play the branded page transition.
 * Pure (no DOM mutation) so it can be unit-tested; the TransitionProvider calls it from its click listener.
 *
 * Returns the destination URL, or null when the browser / Next.js should handle the click natively:
 * modified clicks, in-page anchors, mailto/tel, external origins, downloads, new-tab targets, file URLs,
 * and links to the page the visitor is already on.
 */
export type ClickLike = {
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
};

export type AnchorLike = {
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
  target: string;
  href: string;
};

export type LocationLike = { href: string; origin: string; pathname: string; search: string };

export function getInternalNavigationTarget(event: ClickLike, anchor: AnchorLike | null, location: LocationLike): URL | null {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return null;
  if (!anchor) return null;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null;
  if (anchor.getAttribute("rel")?.split(" ").includes("external")) return null;

  let url: URL;
  try {
    url = new URL(anchor.href, location.href);
  } catch {
    return null;
  }
  if (url.origin !== location.origin) return null; // external
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !url.pathname.endsWith(".html")) return null; // file download
  if (url.pathname === location.pathname && url.search === location.search) return null; // same page / in-page anchor
  return url;
}
