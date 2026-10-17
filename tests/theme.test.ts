import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_KEY, applyTheme, currentTheme, resolveTheme, setTheme, themeHeadScript } from "@/lib/theme";

function mockSystem(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: q.includes("prefers-color-scheme") ? dark : false,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.head.innerHTML = '<meta id="theme-color" name="theme-color" content="#F7F6F2">';
});
afterEach(() => vi.restoreAllMocks());

describe("theme policy", () => {
  it("falls back to light when nothing is stored and the OS has no dark preference", () => {
    mockSystem(false);
    expect(resolveTheme()).toBe("light");
  });
  it("follows the OS when the visitor has not chosen", () => {
    mockSystem(true);
    expect(resolveTheme()).toBe("dark");
  });
  it("an explicit choice beats the OS preference", () => {
    mockSystem(true);
    localStorage.setItem(THEME_KEY, "light");
    expect(resolveTheme()).toBe("light");
  });
  it("ignores corrupt stored values", () => {
    mockSystem(false);
    localStorage.setItem(THEME_KEY, "purple");
    expect(resolveTheme()).toBe("light");
  });
  it("setTheme applies, persists, and updates color-scheme and theme-color", () => {
    mockSystem(false);
    setTheme("dark");
    expect(currentTheme()).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(document.getElementById("theme-color")?.getAttribute("content")).toBe("#141B18");
    applyTheme("light");
    expect(document.getElementById("theme-color")?.getAttribute("content")).toBe("#F7F6F2");
  });
  it("still applies the theme when storage is blocked", () => {
    mockSystem(false);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => setTheme("dark")).not.toThrow();
    expect(currentTheme()).toBe("dark");
  });
});

describe("no-flash head script", () => {
  const run = () => new Function(themeHeadScript)();
  it("sets data-theme from storage before paint", () => {
    mockSystem(false);
    localStorage.setItem(THEME_KEY, "dark");
    run();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.getElementById("theme-color")?.getAttribute("content")).toBe("#141B18");
  });
  it("uses the OS preference when nothing is stored", () => {
    mockSystem(true);
    run();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
  it("defaults to light", () => {
    mockSystem(false);
    run();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
