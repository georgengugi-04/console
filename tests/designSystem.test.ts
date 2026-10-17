import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..", "src");
function walk(d: string): string[] {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(root).filter((f) => /\.(tsx?|css)$/.test(f));
const css = readFileSync(join(root, "app/globals.css"), "utf8");

describe("design system guard", () => {
  it("has no legacy blue/navy tokens or classes anywhere in src", () => {
    const legacy = /\b(cobalt|electric|ink)-\d{2,3}\b|\b(text|bg|border|from|to|via|ring|fill|stroke)-(snow|silver|mist|steel)\b|--color-(snow|silver|mist|steel)/;
    const hits = files.filter((f) => legacy.test(readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });
  it("has no old blue hex values outside the scene palette", () => {
    const blue = /#(1747d6|2563ff|2f86ff|7cc0ff|4da3ff|9ed0ff|2a6df0|1d5bff|4f8cff|6aa7ff|8ab4ff|a5c4ff|02050d|0b1530)/i;
    const hits = files.filter((f) => blue.test(readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });
});

/* ── WCAG contrast of the real tokens in globals.css ───────────────────────── */
function tokens(block: string) {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]!] = m[2]!;
  return out;
}
const light = tokens(css.slice(css.indexOf("@theme"), css.indexOf(':root[data-theme="dark"]')));
const dark = { ...light, ...tokens(css.slice(css.indexOf(':root[data-theme="dark"]'), css.indexOf(":root {"))) };

function lum(h: string) {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};

const textPairs: [string, string][] = [
  ["fg", "page"], ["fg", "surface"], ["fg", "sunken"], ["fg", "raised"],
  ["fg-2", "page"], ["fg-2", "surface"], ["fg-2", "sunken"], ["fg-2", "raised"],
  ["fg-muted", "page"], ["fg-muted", "surface"], ["fg-muted", "sunken"], ["fg-muted", "raised"],
  ["brand", "page"], ["brand", "surface"], ["brand", "sunken"], ["brand", "raised"],
  ["brand-fg", "brand"], ["brand-fg", "brand-hover"],
  ["ok", "surface"], ["ok", "sunken"], ["danger", "surface"], ["danger", "sunken"], ["warn", "surface"], ["warn", "sunken"],
  ["danger", "page"], ["danger", "raised"],
];
const uiPairs: [string, string][] = [
  ["field-line", "field"], ["field-line", "page"], ["field-line", "surface"], ["ring", "page"], ["ring", "surface"],
];

for (const [name, t] of [["light", light], ["dark", dark]] as const) {
  describe(`contrast (${name})`, () => {
    it.each(textPairs)("text %s on %s ≥ 4.5:1", (fg, bg) => {
      expect(ratio(t[fg]!, t[bg]!)).toBeGreaterThanOrEqual(4.5);
    });
    it.each(uiPairs)("UI boundary %s against %s ≥ 3:1", (a, b) => {
      expect(ratio(t[a]!, t[b]!)).toBeGreaterThanOrEqual(3);
    });
  });
}
