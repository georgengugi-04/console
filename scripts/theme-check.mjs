/**
 * Theme verification (Playwright + Chromium) against a running production build.
 *   BASE_URL=http://localhost:3100 CHROMIUM_PATH=… node scripts/theme-check.mjs
 * Checks: first-paint theme (no flash), OS preference, explicit choice + persistence across reload and
 * navigation, toggle state/keyboard, and a computed text-contrast scan of every route in both themes at
 * mobile / tablet / desktop widths. Screenshots → .verify/theme/.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
mkdirSync(".verify/theme", { recursive: true });
const results = [];
const ok = (n, p, x = "") => { results.push(p); console.log((p ? "PASS " : "FAIL ") + n + (x ? "  — " + x : "")); };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
const ROUTES = ["/", "/products", "/products/motor", "/quote", "/claims", "/about", "/resources", "/resources/how-insurance-works", "/contact", "/privacy", "/does-not-exist"];
const BG = { light: "rgb(247, 246, 242)", dark: "rgb(20, 27, 24)" };
const ctxFor = async (opts) => {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript(() => { try { localStorage.setItem("console.intro.v1", "x"); } catch {} document.addEventListener("DOMContentLoaded", () => { window.__first = { theme: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor }; }); });
  return ctx;
};

// 1 · first paint + OS preference
for (const scheme of ["light", "dark"]) {
  const ctx = await ctxFor({ colorScheme: scheme, viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "load" });
  const first = await page.evaluate(() => window.__first);
  ok(`OS ${scheme}: theme and background correct at DOMContentLoaded (no flash)`, first.theme === scheme && first.bg === BG[scheme], JSON.stringify(first));
  const meta = await page.getAttribute("#theme-color", "content");
  ok(`OS ${scheme}: theme-color meta follows`, meta === (scheme === "dark" ? "#141B18" : "#F7F6F2"), meta);
  ok(`OS ${scheme}: color-scheme applied`, (await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)) === scheme);
  await ctx.close();
}

// 2 · explicit choice, persistence, keyboard, state
{
  const ctx = await ctxFor({ colorScheme: "light", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/503/.test(m.text())) errors.push(m.text()); });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(800);
  const btn = page.getByRole("button", { name: "Dark mode" });
  ok("toggle pressed=false in light", (await btn.getAttribute("aria-pressed")) === "false");
  await btn.focus(); await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  ok("keyboard Enter switches to dark", (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark");
  ok("toggle pressed=true in dark", (await btn.getAttribute("aria-pressed")) === "true");
  ok("body background actually changed", (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === BG.dark);
  ok("choice stored in localStorage", (await page.evaluate(() => localStorage.getItem("console.theme"))) === "dark");
  await page.screenshot({ path: ".verify/theme/home-dark-desktop.png" });
  await page.reload({ waitUntil: "load" });
  ok("dark persists across reload with no flash", (await page.evaluate(() => window.__first.theme)) === "dark");
  await page.getByRole("link", { name: "Contact", exact: true }).first().click();
  await page.waitForURL("**/contact", { timeout: 8000 });
  await page.waitForTimeout(1500);
  ok("dark persists across client navigation", (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark");
  await page.getByRole("button", { name: "Dark mode" }).click(); await page.waitForTimeout(400);
  ok("toggles back to light", (await page.evaluate(() => document.documentElement.dataset.theme)) === "light" && (await page.evaluate(() => localStorage.getItem("console.theme"))) === "light");
  await ctx.close();
  // an explicit light choice beats an OS dark preference
  const ctx2 = await ctxFor({ colorScheme: "dark", viewport: { width: 1280, height: 800 } });
  await ctx2.addInitScript(() => localStorage.setItem("console.theme", "light"));
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + "/", { waitUntil: "load" });
  ok("explicit light beats OS dark", (await p2.evaluate(() => window.__first.theme)) === "light");
  await ctx2.close();
  ok("no console errors while toggling", errors.length === 0, errors.join(" | "));
}

// 3 · contrast scan + screenshots, both themes, three widths
const scan = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); const c = parse(cs.backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } if (cs.backgroundImage !== "none" && !/^linear-gradient\(to bottom, rgba\(0, 0, 0, 0\)/.test(cs.backgroundImage)) stack.push({ gradient: true }); } let base = parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 }; base.a = 1; for (const c of stack.reverse()) if (!c.gradient) base = over(c, base); return base; };
  const bad = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
    if (el.closest("[aria-hidden='true'], .sr-only, .sr-only-focusable, script, style, noscript")) continue;
    let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); if (o < 0.99) continue; // mid-animation
    const bg = bgOf(el); const fgc = parse(cs.color); if (!fgc || fgc.a === 0) continue; const fg = over(fgc, bg);
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize), weight = Number(cs.fontWeight); const large = size >= 24 || (size >= 18.66 && weight >= 700);
    if (ratio < (large ? 3 : 4.5)) bad.push(`${el.tagName.toLowerCase()} "${t.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)} (${cs.color} on rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}))`);
  }
  return bad;
};
const sizes = [["mobile", 390, 844], ["tablet", 820, 1100], ["desktop", 1440, 900]];
for (const theme of ["light", "dark"]) for (const [sz, w, h] of sizes) {
  const ctx = await ctxFor({ colorScheme: theme, viewport: { width: w, height: h }, isMobile: sz === "mobile", hasTouch: sz === "mobile" });
  const page = await ctx.newPage();
  let contrastBad = 0, overflow = 0; const notes = [];
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "load" }); await page.waitForTimeout(r === "/" ? 2500 : 1600);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1200);
    const bad = await page.evaluate(scan); if (bad.length) { contrastBad += bad.length; notes.push(r + ": " + bad.slice(0, 3).join("; ")); }
    const sw = await page.evaluate(() => document.documentElement.scrollWidth); if (sw > w) { overflow++; notes.push(`${r}: overflow ${sw}>${w}`); }
    if (["/", "/products", "/quote", "/contact", "/about"].includes(r)) await page.screenshot({ path: `.verify/theme/${theme}-${sz}${r.replace(/\//g, "_") || "_home"}.png`, fullPage: r !== "/" });
  }
  ok(`${theme}/${sz}: ${ROUTES.length} routes — text contrast and no horizontal overflow`, contrastBad === 0 && overflow === 0, notes.join(" | "));
  await ctx.close();
}
await browser.close();
const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} theme checks passed`);
process.exit(failed ? 1 : 0);
