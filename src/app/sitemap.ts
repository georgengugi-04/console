import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/company";
import { availableProducts } from "@/content/products";
import { resources } from "@/content/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/products", "/claims", "/resources", "/contact", "/quote", "/privacy"];
  return [
    ...staticRoutes.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...availableProducts.map((p) => ({ url: `${siteUrl}/products/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...resources.map((r) => ({ url: `${siteUrl}/resources/${r.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
