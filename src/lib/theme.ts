/**
 * Theme policy
 * ────────────
 *  • Order of precedence: the visitor's explicit choice (localStorage `console.theme`) →
 *    the operating system's `prefers-color-scheme` → light.
 *  • The decision is applied by an inline <head> script BEFORE first paint (no flash), as
 *    `data-theme` on <html>; `color-scheme` and <meta name="theme-color"> follow it.
 *  • If storage is blocked the toggle still works for the current page view; it just isn't remembered.
 *  • The inline script and the functions below implement the same rules — keep them in sync.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "console.theme";
export const THEME_COLORS: Record<Theme, string> = { light: "#F7F6F2", dark: "#141B18" };
const EVENT = "console:theme";

export const themeHeadScript = `try{var d=document.documentElement,t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);d.style.colorScheme=t;var m=document.getElementById('theme-color');if(m)m.setAttribute('content',t==='dark'?'${THEME_COLORS.dark}':'${THEME_COLORS.light}')}catch(e){}`;

export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

/** The theme currently painted (what the page actually looks like). */
export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme, { animate = false }: { animate?: boolean } = {}) {
  const root = document.documentElement;
  const reduce = (() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  })();
  if (animate && !reduce) {
    root.classList.add("theme-fade");
    window.setTimeout(() => root.classList.remove("theme-fade"), 320);
  }
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document.getElementById("theme-color")?.setAttribute("content", THEME_COLORS[theme]);
  window.dispatchEvent(new Event(EVENT));
}

/** Explicit visitor choice: apply and remember. */
export function setTheme(theme: Theme) {
  applyTheme(theme, { animate: true });
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* not remembered — still applied for this page view */
  }
}

export function subscribeTheme(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    // Follow the OS live only while the visitor has not chosen
    if (!readStoredTheme()) applyTheme(systemTheme());
    cb();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_KEY) {
      applyTheme(resolveTheme());
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  mq.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
    mq.removeEventListener("change", onSystem);
  };
}
