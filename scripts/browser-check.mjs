import { chromium } from "playwright-core";
/**
 * End-to-end browser check (Playwright + Chromium) for the production build.
 *   npm run build && npm start -- -p 3100        # in one terminal
 *   BASE_URL=http://localhost:3100 CHROMIUM_PATH=/path/to/chromium npm run check:browser
 * Screenshots land in .verify/shots. In headless/CI machines with ≤2 cores the hero deliberately falls back to
 * the static poster (low-power rule); this script overrides hardwareConcurrency so the 3D path is exercised.
 */
import { mkdirSync } from "node:fs";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
mkdirSync(".verify/shots", { recursive: true });
const results = [];
const ok = (name, pass, extra = "") => { results.push({ name, pass }); console.log((pass ? "PASS " : "FAIL ") + name + (extra ? "  — " + extra : "")); };
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"],
});

async function session(label, ctxOpts) {
  const { cores = 8, ...rest } = ctxOpts;
  const ctx = await browser.newContext(rest);
  await ctx.addInitScript((n) => Object.defineProperty(navigator, "hardwareConcurrency", { get: () => n }), cores);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/status of 503/.test(m.text())) errors.push("console: " + m.text()); });
  // Next.js aborts in-flight RSC prefetches when navigation supersedes them — expected, not an error.
  page.on("requestfailed", (r) => { if (!/_rsc=|icon\.svg/.test(r.url())) errors.push("requestfailed: " + r.url() + " " + r.failure()?.errorText); });
  return { ctx, page, errors, label };
}

// ───────────── DESKTOP ─────────────
{
  const { ctx, page, errors } = await session("desktop", { viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "load" });
  const dlg = page.getByRole("dialog");
  await dlg.waitFor({ timeout: 5000 }).catch(() => {});
  ok("intro shows on first visit", await dlg.isVisible());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: ".verify/shots/d-intro-1.png" });
  const enter = page.getByRole("button", { name: /enter experience/i });
  await enter.waitFor({ timeout: 8000 }).catch(() => {});
  ok("Enter Experience button appears", await enter.isVisible());
  await page.screenshot({ path: ".verify/shots/d-intro-2.png" });
  await enter.click();
  ok("intro closes after Enter", await dlg.waitFor({ state: "hidden", timeout: 6000 }).then(() => true).catch(() => false));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: ".verify/shots/d-home-hero.png" });
  const canvas = await page.locator("canvas").count();
  ok("WebGL hero canvas mounted", canvas > 0, `canvases=${canvas}`);

  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1200);
  ok("intro does NOT replay on refresh", !(await dlg.isVisible().catch(() => false)));

  // transition
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await page.waitForTimeout(450);
  await page.screenshot({ path: ".verify/shots/d-transition.png" });
  const msgVisible = await page.getByText("The people and purpose behind CONSOLE.").first().isVisible().catch(() => false);
  ok("transition message shown for About", msgVisible);
  await page.waitForURL("**/about", { timeout: 6000 });
  await page.waitForTimeout(1800);
  ok("navigated to /about and overlay released", (await page.locator("main").isVisible()) && !(await dlg.isVisible().catch(() => false)));
  await page.screenshot({ path: ".verify/shots/d-about.png", fullPage: true });

  // no intro replay on navigation
  ok("intro did not replay on navigation", !(await dlg.isVisible().catch(() => false)));

  // Back / forward
  await page.goBack(); await page.waitForTimeout(900);
  ok("Back returns to home", new URL(page.url()).pathname === "/");
  await page.goForward(); await page.waitForTimeout(900);
  ok("Forward returns to /about", new URL(page.url()).pathname === "/about");

  // rapid clicks — run on a low-power profile (poster hero) so software-rendered WebGL cannot starve the main thread
  {
    const r = await session("rapid", { viewport: { width: 1440, height: 900 }, cores: 2 });
    await r.page.goto(BASE + "/?nointro=1", { waitUntil: "load" });
    await r.page.waitForTimeout(800);
    await r.page.getByRole("link", { name: "Claims", exact: true }).first().click({ noWaitAfter: true });
    await r.page.getByRole("link", { name: "Contact", exact: true }).first().click({ noWaitAfter: true, force: true, timeout: 1500 }).catch(() => {});
    await r.page.waitForTimeout(3500);
    const path = new URL(r.page.url()).pathname;
    ok("rapid clicks end on a single route, page usable", path === "/claims" && (await r.page.locator("main").isVisible()), path);
    await r.ctx.close();
  }

  // pages
  for (const p of ["/", "/products", "/products/motor", "/claims", "/contact", "/quote", "/resources", "/resources/how-insurance-works", "/privacy"]) {
    const r = await page.goto(BASE + p, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const h1 = await page.locator("h1").count();
    ok(`page ${p} 200 + single h1`, r.status() === 200 && h1 === 1, `status=${r.status()} h1=${h1}`);
    await page.screenshot({ path: `.verify/shots/d${p.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
  }

  // quote flow (production, no delivery configured → honest failure)
  await page.goto(BASE + "/quote", { waitUntil: "load" }); await page.waitForTimeout(1000);
  await page.getByRole("radio", { name: /motor insurance/i }).check({ force: true });
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel(/full name/i).fill("Test Visitor");
  await page.getByLabel(/email address/i).fill("test@example.com");
  await page.getByLabel(/phone number/i).fill("0712 345 678");
  await page.getByRole("radio", { name: /email/i }).check({ force: true });
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3000); // min-fill-time bot check
  await page.getByRole("button", { name: /send/i }).click();
  await page.waitForTimeout(1500);
  const honest = await page.getByRole("heading", { name: /aren't connected yet/i }).isVisible().catch(() => false);
  ok("quote submit is honest when delivery is not configured", honest);
  await page.screenshot({ path: ".verify/shots/d-quote-result.png" });

  // replay intro from footer
  await page.goto(BASE + "/", { waitUntil: "load" }); await page.waitForTimeout(1000);
  await page.getByRole("button", { name: /replay introduction/i }).click();
  await page.waitForTimeout(800);
  ok("footer replay re-shows intro on explicit request", await dlg.isVisible().catch(() => false));
  await page.keyboard.press("Escape");
  ok("Escape skips the intro", await dlg.waitFor({ state: "hidden", timeout: 6000 }).then(() => true).catch(() => false));

  console.log("DESKTOP console/page errors:", errors.length ? errors : "none");
  ok("no console or network errors (desktop)", errors.length === 0);
  await ctx.close();
}

// ───────────── MOBILE ─────────────
{
  const { ctx, page, errors } = await session("mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(BASE + "/", { waitUntil: "load" });
  const dlg = page.getByRole("dialog");
  await dlg.waitFor({ timeout: 5000 }).catch(() => {});
  await page.screenshot({ path: ".verify/shots/m-intro.png" });
  await page.getByRole("button", { name: /skip/i }).click();
  ok("mobile: intro skippable", await dlg.waitFor({ state: "hidden", timeout: 6000 }).then(() => true).catch(() => false));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: ".verify/shots/m-home.png" });
  await page.getByRole("button", { name: /menu/i }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: ".verify/shots/m-menu.png" });
  ok("mobile: menu opens (aria-expanded)", (await page.getByRole("button", { name: /close|menu/i }).first().getAttribute("aria-expanded")) === "true");
  await page.keyboard.press("Escape"); await page.waitForTimeout(500);
  for (const p of ["/", "/products", "/products/health", "/claims", "/contact", "/quote", "/about", "/resources"]) {
    await page.goto(BASE + p, { waitUntil: "load" }); await page.waitForTimeout(1200);
    const { sw, bad } = await page.evaluate(() => {
      const W = 390;
      const bad = [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > W + 1 && getComputedStyle(e).position !== "fixed"; }).slice(0, 4).map((e) => e.tagName + "." + String(e.className).slice(0, 60) + " right=" + Math.round(e.getBoundingClientRect().right));
      return { sw: document.documentElement.scrollWidth, bad };
    });
    ok(`mobile ${p} no horizontal overflow`, sw <= 390, `scrollWidth=${sw}` + (sw > 390 ? " offenders: " + JSON.stringify(bad) : ""));
    await page.screenshot({ path: `.verify/shots/m${p.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
  }
  console.log("MOBILE console/page errors:", errors.length ? errors : "none");
  ok("no console or network errors (mobile)", errors.length === 0);
  await ctx.close();
}

// reduced motion
{
  const { ctx, page } = await session("reduced", { viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: /enter experience/i }).waitFor({ timeout: 3000 }).then(() => ok("reduced motion: Enter available immediately", true)).catch(() => ok("reduced motion: Enter available immediately", false));
  await page.getByRole("button", { name: /enter experience/i }).click().catch(() => {});
  await page.waitForTimeout(800);
  await page.getByRole("link", { name: "Contact", exact: true }).first().click();
  await page.waitForURL("**/contact", { timeout: 4000 }).then(() => ok("reduced motion: navigation is immediate/native", true)).catch(() => ok("reduced motion: navigation is immediate/native", false));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
