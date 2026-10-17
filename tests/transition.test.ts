import { describe, expect, it } from "vitest";
import { messageForPath } from "@/content/site";
import { getInternalNavigationTarget, type AnchorLike, type ClickLike } from "@/lib/transitionEligibility";

const loc = { href: "https://console.ke/about", origin: "https://console.ke", pathname: "/about", search: "" };
const click = (o: Partial<ClickLike> = {}): ClickLike => ({ defaultPrevented: false, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, button: 0, ...o });
const a = (href: string, o: Partial<{ target: string; download: boolean; rel: string }> = {}): AnchorLike => ({
  getAttribute: (n) => (n === "href" ? href : n === "rel" ? (o.rel ?? null) : null),
  hasAttribute: (n) => n === "download" && Boolean(o.download),
  target: o.target ?? "",
  href: new URL(href, loc.href).href,
});

describe("getInternalNavigationTarget", () => {
  it("accepts a genuine internal link", () => {
    expect(getInternalNavigationTarget(click(), a("/claims"), loc)?.pathname).toBe("/claims");
  });
  it.each([
    ["external origin", a("https://example.org/x")],
    ["mailto", a("mailto:hi@x.ke")],
    ["tel", a("tel:+254712345678")],
    ["in-page anchor", a("#faq")],
    ["same page", a("/about")],
    ["download attribute", a("/claims", { download: true })],
    ["new tab", a("/claims", { target: "_blank" })],
    ["rel=external", a("/claims", { rel: "external noopener" })],
    ["file link", a("/brochure.pdf")],
  ])("ignores %s", (_n, anchor) => {
    expect(getInternalNavigationTarget(click(), anchor, loc)).toBeNull();
  });
  it("ignores modified, non-primary and already-handled clicks", () => {
    for (const e of [click({ metaKey: true }), click({ ctrlKey: true }), click({ shiftKey: true }), click({ altKey: true }), click({ button: 1 }), click({ defaultPrevented: true })]) {
      expect(getInternalNavigationTarget(e, a("/claims"), loc)).toBeNull();
    }
  });
  it("treats a different query string on the same path as a navigation", () => {
    expect(getInternalNavigationTarget(click(), a("/about?x=1"), loc)).not.toBeNull();
  });
  it("returns null when there is no anchor", () => {
    expect(getInternalNavigationTarget(click(), null, loc)).toBeNull();
  });
});

describe("messageForPath (contextual transition copy)", () => {
  it.each([
    ["/", "A better way to think about protection."],
    ["/about", "The people and purpose behind CONSOLE."],
    ["/products", "Discover protection for what matters."],
    ["/products/motor", "Discover protection for what matters."],
    ["/claims", "We're here to help you move forward."],
    ["/contact", "Let's start a conversation."],
  ])("%s", (path, msg) => expect(messageForPath(path)).toBe(msg));
  it("falls back to the home message for unknown routes", () => {
    expect(messageForPath("/nope")).toBe("A better way to think about protection.");
  });
});
