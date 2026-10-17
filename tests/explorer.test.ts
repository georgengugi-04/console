import { describe, expect, it } from "vitest";
import { availableProducts, explorerStages, getProduct, products } from "@/content/products";
import { rankProducts } from "@/lib/explorer";

describe("product catalogue honesty", () => {
  it("never exposes a category the company has not confirmed", () => {
    expect(getProduct("business")).toBeUndefined();
    expect(availableProducts.every((p) => p.available)).toBe(true);
    expect(products.find((p) => p.slug === "business")?.available).toBe(false);
  });
  it("states no prices or premiums", () => {
    const text = JSON.stringify(products);
    expect(text).not.toMatch(/KSh|Ksh|KES|\bpremium of\b|\bfrom \d/);
  });
  it("explorer needs only point at available products", () => {
    for (const stage of explorerStages) for (const need of stage.needs) for (const s of need.products) expect(getProduct(s)).toBeDefined();
  });
});

describe("rankProducts", () => {
  it("puts the stated worry first", () => {
    expect(rankProducts({ stage: "family", worry: "road" })[0]?.slug).toBe("motor");
    expect(rankProducts({ stage: "starting", worry: "medical" })[0]?.slug).toBe("health");
  });
  it("returns at most three results and none when nothing is chosen", () => {
    expect(rankProducts({ stage: "established", worry: "home" }).length).toBeLessThanOrEqual(3);
    expect(rankProducts({})).toEqual([]);
  });
});
