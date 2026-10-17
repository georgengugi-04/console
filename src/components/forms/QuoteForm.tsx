"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { ease } from "@/components/motion/tokens";
import { Button } from "@/components/ui/Button";
import { availableProducts } from "@/content/products";
import {
  quoteSchema,
  quoteStepFields,
  type QuoteData,
  type QuoteInput,
  type QuoteProductChoice,
} from "@/lib/validation";
import { Field, Honeypot, describedBy, inputClass } from "./Field";
import { SubmitResult } from "./SubmitResult";
import { useSubmit } from "./useSubmit";

const STEPS = [
  { n: 1, label: "Cover" },
  { n: 2, label: "You" },
  { n: 3, label: "Details" },
] as const;

const NEXT_STEPS = [
  "Your details reach the CONSOLE team.",
  "A team member reviews your enquiry and contacts you using the method you chose.",
  "They explain the options available and what the insurer will need from you.",
];

export function QuoteForm({ initialProduct }: { initialProduct?: QuoteProductChoice }) {
  const [step, setStep] = useState<1 | 2 | 3>(initialProduct ? 2 : 1);
  const [startedAt] = useState(() => Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { state, submit, reset } = useSubmit("/api/quote");

  const form = useForm<QuoteInput, unknown, QuoteData>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      ...(initialProduct ? { product: initialProduct } : {}),
      fullName: "",
      email: "",
      phone: "",
      preferredContact: "phone",
      details: "",
      consent: false,
      website: "",
    },
  });
  const {
    register,
    handleSubmit,
    trigger,
    control,
    setError,
    formState: { errors },
  } = form;


  // Move focus to the step heading on step change (keyboard + screen-reader users)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const product = useWatch({ control, name: "product" });
  const values = useWatch({ control });

  const next = async () => {
    const ok = await trigger([...quoteStepFields[step]] as (keyof QuoteInput)[]);
    if (ok) setStep((s) => (s < 3 ? ((s + 1) as 2 | 3) : s));
  };

  const submitFinal = handleSubmit(async (data) => {
    const result = await submit({ ...data, startedAt });
    if (result && !result.ok && result.fieldErrors) {
      for (const [k, msgs] of Object.entries(result.fieldErrors)) {
        setError(k as keyof QuoteInput, { message: msgs[0] ?? "Invalid" });
      }
      // jump back to the earliest step that has an error
      const bad = Object.keys(result.fieldErrors);
      if (bad.some((k) => (quoteStepFields[1] as readonly string[]).includes(k))) setStep(1);
      else if (bad.some((k) => (quoteStepFields[2] as readonly string[]).includes(k))) setStep(2);
    }
  });

  // "Continue" is a submit button so Enter advances the wizard on steps 1–2; only step 3 really submits.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step < 3) {
      e.preventDefault();
      void next();
      return;
    }
    return submitFinal(e);
  };

  if (state.status === "success" || (state.status === "error" && state.result.code !== "validation")) {
    return <SubmitResult state={state} nextSteps={NEXT_STEPS} onRetry={reset} />;
  }

  const submitting = state.status === "submitting";
  const selected = availableProducts.find((p) => p.slug === product);

  return (
    <form onSubmit={onSubmit} noValidate className="surface relative p-6 sm:p-10" aria-label="Quote request">
      <Honeypot register={register("website")} />

      {/* progress */}
      <nav aria-label="Progress" className="mb-10">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = step > s.n;
            const current = step === s.n;
            return (
              <li key={s.n} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                    done
                      ? "border-brand bg-brand text-brand-fg"
                      : current
                        ? "border-brand text-fg"
                        : "border-line-strong text-fg-muted"
                  }`}
                >
                  {done ? <Check size={14} aria-hidden /> : s.n}
                </span>
                <span className={`hidden text-sm sm:block ${current ? "text-fg" : "text-fg-muted"}`}>{s.label}</span>
                {i < STEPS.length - 1 && (
                  <span className="relative ml-1 h-px flex-1 overflow-hidden bg-line">
                    <motion.span
                      className="absolute inset-0 origin-left bg-brand"
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: ease.out }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="sr-only" aria-live="polite">
          Step {step} of 3
        </p>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: ease.out }}
        >
          {step === 1 && (
            <fieldset>
              <legend className="sr-only">Choose an insurance category</legend>
              <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
                What would you like cover for?
              </h2>
              <p className="mt-2 text-sm text-fg-2">Pick one for now — you can mention others later.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={errors.product ? "product-error" : undefined}>
                {availableProducts.map((p) => {
                  const checked = product === p.slug;
                  return (
                    <label
                      key={p.slug}
                      className={`relative flex min-h-24 cursor-pointer flex-col justify-center rounded-2xl border p-5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring ${
                        checked ? "border-brand bg-brand-soft" : "border-line bg-page hover:border-line-strong"
                      }`}
                    >
                      <input
                        type="radio"
                        value={p.slug}
                        className="sr-only"
                        {...register("product")}
                      />
                      <span className="font-display text-xs tracking-[0.2em] text-brand">
                        {p.code}
                      </span>
                      <span className="mt-1 font-semibold">{p.name}</span>
                      <span className="mt-0.5 text-sm text-fg-muted">{p.short}</span>
                      {checked && <Check size={18} aria-hidden className="absolute right-4 top-4 text-brand" />}
                    </label>
                  );
                })}
              </div>
              {errors.product && (
                <p id="product-error" role="alert" className="mt-3 text-sm text-danger">
                  {errors.product.message}
                </p>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-5">
              <legend className="sr-only">Your contact details</legend>
              <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
                How can we reach you?
              </h2>
              <Field id="fullName" label="Full name" error={errors.fullName?.message}>
                <input
                  id="fullName"
                  className={inputClass}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={describedBy("fullName", errors.fullName?.message)}
                  {...register("fullName")}
                />
              </Field>
              <Field id="email" label="Email address" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  className={inputClass}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email", errors.email?.message)}
                  {...register("email")}
                />
              </Field>
              <Field id="phone" label="Phone number" error={errors.phone?.message} hint="e.g. 0712 345 678 or +254 712 345 678">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  className={inputClass}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("phone", errors.phone?.message, "hint")}
                  {...register("phone")}
                />
              </Field>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-fg-2">Preferred way to be contacted</legend>
                <div className="flex gap-3">
                  {(["phone", "email"] as const).map((c) => (
                    <label
                      key={c}
                      className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-field-line bg-field px-4 has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                    >
                      <input type="radio" value={c} className="accent-brand" {...register("preferredContact")} />
                      <span className="capitalize">{c === "phone" ? "Phone call" : "Email"}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredContact && (
                  <p role="alert" className="mt-1.5 text-sm text-danger">
                    {errors.preferredContact.message}
                  </p>
                )}
              </fieldset>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-5">
              <legend className="sr-only">Enquiry details and consent</legend>
              <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
                Anything we should know?
              </h2>
              <Field
                id="details"
                label={`About your ${selected ? selected.name.toLowerCase() : "enquiry"}`}
                optional
                error={errors.details?.message}
                hint="Keep it short. Please don't include ID numbers, bank or card details, or medical records."
              >
                <textarea
                  id="details"
                  rows={5}
                  maxLength={1000}
                  className={inputClass}
                  aria-invalid={Boolean(errors.details)}
                  aria-describedby={describedBy("details", errors.details?.message, "hint")}
                  {...register("details")}
                />
              </Field>

              <div className="rounded-2xl border border-line bg-page p-5 text-sm">
                <p className="font-semibold text-fg-2">Please check your details</p>
                <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
                  <dt className="text-fg-muted">Cover</dt>
                  <dd>{selected?.name ?? "—"}</dd>
                  <dt className="text-fg-muted">Name</dt>
                  <dd>{values.fullName || "—"}</dd>
                  <dt className="text-fg-muted">Email</dt>
                  <dd className="break-all">{values.email || "—"}</dd>
                  <dt className="text-fg-muted">Phone</dt>
                  <dd>{values.phone || "—"}</dd>
                  <dt className="text-fg-muted">Contact by</dt>
                  <dd>{values.preferredContact === "email" ? "Email" : "Phone call"}</dd>
                </dl>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    {...register("consent")}
                  />
                  <span>
                    I agree that CONSOLE INSURANCE may use these details to contact me about this enquiry, as described
                    in the{" "}
                    <a href="/privacy" className="text-brand underline underline-offset-4" target="_blank" rel="noopener">
                      privacy notice
                    </a>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p id="consent-error" role="alert" className="mt-2 text-sm text-danger">
                    {errors.consent.message}
                  </p>
                )}
              </div>

              {state.status === "error" && state.result.code === "validation" && (
                <p role="alert" className="text-sm text-danger">
                  {state.result.message}
                </p>
              )}
            </fieldset>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-4">
        {step > 1 ? (
          <Button type="button" variant="quiet" onClick={() => setStep((s) => (s - 1) as 1 | 2)} disabled={submitting}>
            <ArrowLeft size={16} aria-hidden /> Back
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button type="submit">
            Continue <ArrowRight size={18} aria-hidden />
          </Button>
        ) : (
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
        )}
      </div>
    </form>
  );
}
