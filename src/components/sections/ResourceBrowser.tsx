"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Resource, ResourceCategory } from "@/content/resources";

export function ResourceBrowser({ items, categories }: { items: Resource[]; categories: ResourceCategory[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ResourceCategory | "All">("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (r) =>
        (cat === "All" || r.category === cat) &&
        (!needle || `${r.title} ${r.excerpt} ${r.category}`.toLowerCase().includes(needle)),
    );
  }, [items, q, cat]);

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition ${
                cat === c ? "border-electric-300 bg-cobalt-500/20 text-white" : "border-line-strong text-mist hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <label htmlFor="res-search" className="sr-only">
            Search resources
          </label>
          <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
          <input
            id="res-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guides"
            className="min-h-12 w-full rounded-full border border-line-strong bg-ink-850/70 pl-11 pr-4 text-snow placeholder:text-steel focus:border-electric-300 focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-steel" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-mist">No guides match that search. Try a different word or category.</p>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((r) => (
            <li key={r.slug}>
              <Link href={`/resources/${r.slug}`} className="surface spotlight group flex h-full flex-col justify-between p-7 transition hover:border-electric-300">
                <div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-display tracking-[0.18em] text-electric-300">{r.category.toUpperCase()}</span>
                    {r.status === "draft" && (
                      <span className="rounded-full border border-dashed border-electric-400/50 px-2 py-0.5 text-electric-300">Draft</span>
                    )}
                  </div>
                  <h2 className="mt-4 font-display text-xl leading-snug tracking-[-0.02em]">{r.title}</h2>
                  <p className="mt-3 text-mist">{r.excerpt}</p>
                </div>
                <p className="mt-6 text-sm text-steel">{r.readingMinutes} min read</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
