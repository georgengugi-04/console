"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { company } from "@/content/company";
import { buttonClass } from "@/components/ui/Button";
import type { SubmitState } from "./useSubmit";

const SuccessAnimation = dynamic(() => import("./SuccessAnimation"), { ssr: false });

/** Honest outcome panel. Success only ever shows after the server confirmed delivery (or labelled dev mode). */
export function SubmitResult({
  state,
  nextSteps,
  onRetry,
}: {
  state: Extract<SubmitState, { status: "success" | "error" }>;
  nextSteps: string[];
  onRetry: () => void;
}) {
  if (state.status === "success") {
    const dev = state.result.mode === "development";
    return (
      <div role="status" className="surface p-8 text-center sm:p-12">
        <div className="mx-auto h-28 w-28" aria-hidden>
          <SuccessAnimation />
        </div>
        {dev ? (
          <>
            <h2 className="h3 mt-4">Saved in development mode</h2>
            <p className="mx-auto mt-3 max-w-md text-fg-2">
              This copy of the site isn&apos;t connected to CONSOLE yet, so your details were stored only on this
              server and have <strong className="text-fg">not</strong> been sent to the team.
            </p>
          </>
        ) : (
          <>
            <h2 className="h3 mt-4">We&apos;ve received your enquiry</h2>
            <p className="mx-auto mt-3 max-w-md text-fg-2">Thank you. Here&apos;s what happens next:</p>
            <ol className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm text-fg-2">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-[0.7rem] text-brand">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </>
        )}
        <p className="mt-8 text-xs text-fg-muted">
          Reference <span className="font-mono text-fg-2">{state.result.reference}</span>
        </p>
        <Link href="/" className={buttonClass("ghost", "mt-6")}>
          Back to home
        </Link>
      </div>
    );
  }

  const { result } = state;
  return (
    <div role="alert" className="surface border-danger/40 p-8 sm:p-10">
      <div className="flex items-start gap-4">
        <AlertTriangle className="mt-1 shrink-0 text-danger" aria-hidden />
        <div>
          <h2 className="h3">
            {result.code === "not_configured" ? "Online enquiries aren't connected yet" : "We couldn't send that"}
          </h2>
          <p className="mt-3 text-fg-2">{result.message}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {company.contact.phone.status === "supplied" ? (
              <a href={`tel:${company.contact.phone.tel}`} className={buttonClass("ghost", "min-h-11")}>
                <Phone size={16} aria-hidden /> {company.contact.phone.display}
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-fg-2">
                <Phone size={16} aria-hidden /> {company.contact.phone.display}
              </span>
            )}
            <a href={`mailto:${company.contact.email.value}`} className={buttonClass("ghost", "min-h-11")}>
              <Mail size={16} aria-hidden /> Email us
            </a>
            {result.code !== "not_configured" && (
              <button type="button" onClick={onRetry} className={buttonClass("primary", "min-h-11")}>
                Back to the form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
