"use client";

import { useSearchParams } from "next/navigation";
import { productChoices, type QuoteProductChoice } from "@/lib/validation";
import { QuoteForm } from "./QuoteForm";

/**
 * Reads the optional `?product=` preselection on the client so the /quote page itself can be prerendered
 * and cached (and stay eligible for the browser back/forward cache). Must be rendered inside <Suspense>.
 */
export function QuoteFormLoader() {
  const raw = useSearchParams().get("product");
  const initialProduct = productChoices.includes(raw as QuoteProductChoice) ? (raw as QuoteProductChoice) : undefined;
  return <QuoteForm key={initialProduct ?? "none"} {...(initialProduct ? { initialProduct } : {})} />;
}
