"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { ease } from "@/components/motion/tokens";
import { explorerStages } from "@/content/products";
import { rankProducts } from "@/lib/explorer";
import { buttonClass } from "@/components/ui/Button";

/**
 * Insurance Explorer — a guided way to decide which category to read about first.
 * It deliberately gives NO advice, price, premium or eligibility; it only points to general product
 * information and to the team. State is local; leaving at any point is one click (Contact / Quote).
 */
export function Explorer() {
  const [step, setStep] = useState(0); // 0..stages.length ; last index = results
  const [picks, setPicks] = useState<Record<string, string>>({});
  const stages = explorerStages;
  const total = stages.length;
  const done = step >= total;

  const choose = (stageId: string, needId: string) => {
    setPicks((p) => ({ ...p, [stageId]: needId }));
    setStep((s) => s + 1);
  };

  const results = rankProducts(picks);

  const reset = () => {
    setPicks({});
    setStep(0);
  };

  return (
    <div className="surface relative overflow-hidden p-6 sm:p-10" aria-live="polite">

      {/* progress */}
      <div className="relative mb-8 flex items-center gap-3" role="group" aria-label={`Step ${Math.min(step + 1, total)} of ${total}`}>
        {stages.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
            <motion.div
              className="h-full bg-brand"
              initial={false}
              animate={{ width: i < step ? "100%" : i === step ? "35%" : "0%" }}
              transition={{ duration: 0.6, ease: ease.out }}
            />
          </div>
        ))}
        <span className="text-xs tabular-nums text-fg-muted">
          {done ? "Done" : `${step + 1}/${total}`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={stages[step]!.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: ease.out }}
            className="relative"
          >
            <h3 className="h3">{stages[step]!.label}</h3>
            <p className="mt-2 text-sm text-fg-2">{stages[step]!.hint}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {stages[step]!.needs.map((need) => {
                const selected = picks[stages[step]!.id] === need.id;
                return (
                  <li key={need.id}>
                    <button
                      type="button"
                      onClick={() => choose(stages[step]!.id, need.id)}
                      aria-pressed={selected}
                      className="group flex min-h-20 w-full flex-col items-start justify-center rounded-2xl border border-line bg-page p-5 text-left transition hover:border-line-strong hover:bg-sunken"
                    >
                      <span className="font-semibold text-fg">{need.label}</span>
                      <span className="mt-1 text-sm text-fg-muted group-hover:text-fg-2">{need.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-fg-2 transition hover:text-fg"
              >
                <ArrowLeft size={16} aria-hidden /> Back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className="relative"
          >
            <h3 className="h3">Good places to start reading</h3>
            <p className="mt-2 max-w-xl text-sm text-fg-2">
              This isn&apos;t advice or a recommendation of cover — it&apos;s a starting point. Our team can explain the
              options and what each would need from you.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex h-full min-h-32 flex-col justify-between rounded-2xl border border-line bg-page p-5 transition hover:border-line-strong"
                  >
                    <span className="font-display text-xs tracking-[0.2em] text-brand">
                      {p.code}
                    </span>
                    <span>
                      <span className="block font-semibold">{p.name}</span>
                      <span className="mt-1 block text-sm text-fg-muted">{p.short}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/quote" className={buttonClass("primary")}>
                Request a quote <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/contact" className={buttonClass("ghost")}>
                Talk to the team
              </Link>
              <button type="button" onClick={reset} className={buttonClass("quiet", "min-h-11")}>
                <RotateCcw size={16} aria-hidden /> Start again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
