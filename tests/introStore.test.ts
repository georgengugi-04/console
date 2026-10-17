import { beforeEach, describe, expect, it } from "vitest";
import { INTRO_COOKIE, INTRO_KEY, hasSeenIntro, introHeadScript, markIntroSeen, resetIntro } from "@/lib/introStore";

beforeEach(() => {
  localStorage.clear();
  document.cookie = `${INTRO_COOKIE}=; Max-Age=0; Path=/`;
  document.documentElement.removeAttribute("data-intro");
});

describe("one-time intro persistence", () => {
  it("is eligible on a first visit and not after it has been shown", () => {
    expect(hasSeenIntro()).toBe(false);
    markIntroSeen();
    expect(hasSeenIntro()).toBe(true);
    expect(localStorage.getItem(INTRO_KEY)).toBeTruthy();
    expect(document.cookie).toContain(`${INTRO_COOKIE}=1`);
  });

  it("survives cleared localStorage thanks to the cookie mirror", () => {
    markIntroSeen();
    localStorage.clear();
    expect(hasSeenIntro()).toBe(true);
  });

  it("can be explicitly reset (footer replay)", () => {
    markIntroSeen();
    resetIntro();
    expect(hasSeenIntro()).toBe(false);
  });

  it("head script marks first-time visitors as pending, and returning visitors not", () => {
    new Function(introHeadScript)();
    expect(document.documentElement.getAttribute("data-intro")).toBe("pending");
    document.documentElement.removeAttribute("data-intro");
    markIntroSeen();
    new Function(introHeadScript)();
    expect(document.documentElement.hasAttribute("data-intro")).toBe(false);
  });

  it("head script honours ?nointro=1 (accessible bypass)", () => {
    window.history.replaceState({}, "", "/?nointro=1");
    new Function(introHeadScript)();
    expect(document.documentElement.hasAttribute("data-intro")).toBe(false);
    window.history.replaceState({}, "", "/");
  });
});
