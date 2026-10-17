"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { claimEnquirySchema, type ClaimData, type ClaimInput } from "@/lib/validation";
import { Field, Honeypot, describedBy, inputClass } from "./Field";
import { SubmitResult } from "./SubmitResult";
import { useSubmit } from "./useSubmit";

const NEXT_STEPS = [
  "Your claims enquiry reaches the CONSOLE team.",
  "A team member contacts you to confirm what is needed and how to proceed.",
];

const TYPES = [
  { v: "life", l: "Life" },
  { v: "health", l: "Health" },
  { v: "motor", l: "Motor" },
  { v: "property", l: "Property" },
  { v: "other", l: "Something else" },
] as const;

export function ClaimForm() {
  const [startedAt] = useState(() => Date.now());
  const { state, submit, reset } = useSubmit("/api/claims");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ClaimInput, unknown, ClaimData>({
    resolver: zodResolver(claimEnquirySchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", phone: "", policyNumber: "", summary: "", consent: false, website: "" },
  });


  const onSubmit = handleSubmit(async (data) => {
    const result = await submit({ ...data, startedAt });
    if (result && !result.ok && result.fieldErrors) {
      for (const [k, msgs] of Object.entries(result.fieldErrors)) {
        setError(k as keyof ClaimInput, { message: msgs[0] ?? "Invalid" });
      }
    }
  });

  if (state.status === "success" || (state.status === "error" && state.result.code !== "validation")) {
    return <SubmitResult state={state} nextSteps={NEXT_STEPS} onRetry={reset} />;
  }
  const submitting = state.status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="surface space-y-5 p-6 sm:p-10" aria-label="Claims enquiry">
      <Honeypot register={register("website")} />
      <h2 className="h3">Start a claims enquiry</h2>
      <p className="text-sm text-mist">
        This is an enquiry, not a formal claim submission. The team will tell you what happens next.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cl-name" label="Full name" error={errors.fullName?.message}>
          <input id="cl-name" className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("cl-name", errors.fullName?.message)} {...register("fullName")} />
        </Field>
        <Field id="cl-phone" label="Phone number" error={errors.phone?.message} hint="e.g. 0712 345 678">
          <input id="cl-phone" type="tel" inputMode="tel" className={inputClass} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("cl-phone", errors.phone?.message, "hint")} {...register("phone")} />
        </Field>
      </div>
      <Field id="cl-email" label="Email address" error={errors.email?.message}>
        <input id="cl-email" type="email" inputMode="email" className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("cl-email", errors.email?.message)} {...register("email")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cl-type" label="Type of claim" error={errors.claimType?.message}>
          <select id="cl-type" defaultValue="" className={inputClass} aria-invalid={Boolean(errors.claimType)} aria-describedby={describedBy("cl-type", errors.claimType?.message)} {...register("claimType")}>
            <option value="" disabled>
              Choose…
            </option>
            {TYPES.map((t) => (
              <option key={t.v} value={t.v}>
                {t.l}
              </option>
            ))}
          </select>
        </Field>
        <Field id="cl-policy" label="Policy number" optional error={errors.policyNumber?.message}>
          <input id="cl-policy" className={inputClass} autoComplete="off" aria-invalid={Boolean(errors.policyNumber)} aria-describedby={describedBy("cl-policy", errors.policyNumber?.message)} {...register("policyNumber")} />
        </Field>
      </div>
      <Field id="cl-summary" label="What happened?" error={errors.summary?.message} hint="A short summary is enough. Please don't include ID numbers or bank/card details.">
        <textarea id="cl-summary" rows={5} maxLength={1500} className={inputClass} aria-invalid={Boolean(errors.summary)} aria-describedby={describedBy("cl-summary", errors.summary?.message, "hint")} {...register("summary")} />
      </Field>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#4da3ff]" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "cl-consent-error" : undefined} {...register("consent")} />
          <span>
            I agree that CONSOLE INSURANCE may use these details to follow up on my enquiry, as described in the{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="text-electric-300 underline underline-offset-4">
              privacy notice
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="cl-consent-error" role="alert" className="mt-2 text-sm text-danger">
            {errors.consent.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={submitting} aria-busy={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            Send enquiry <ArrowRight size={18} aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
