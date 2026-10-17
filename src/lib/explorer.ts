import { explorerStages, getProduct, type Product, type ProductSlug } from "@/content/products";

/**
 * Ranks product categories from the visitor's explorer answers.
 * This is a reading-list helper only — it never produces advice, prices or eligibility.
 * The "worry" stage is weighted ×3 because it states the concern most directly; ties keep the order
 * in which a need lists its products.
 */
export function rankProducts(picks: Record<string, string>, limit = 3): Product[] {
  const score: Partial<Record<ProductSlug, number>> = {};
  for (const stage of explorerStages) {
    const need = stage.needs.find((n) => n.id === picks[stage.id]);
    need?.products.forEach((slug, i) => {
      score[slug] = (score[slug] ?? 0) + (stage.id === "worry" ? 3 : 1) - i * 0.01;
    });
  }
  return (Object.entries(score) as [ProductSlug, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => getProduct(slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, limit);
}
