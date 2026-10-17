"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactData, type ContactInput } from "@/lib/validation";
import { Field, Honeypot, describedBy, inputClass } from "./Field";
import { SubmitResult } from "./SubmitResult";
import { useSubmit } from "./useSubmit";

const NEXT_STEPS = [
  "Your message reaches the CONSOLE team.",
  "A team member reads it and replies to the email address you gave.",
];

export function ContactForm() {
  const [startedAt] = useState(() => Date.now());
  const { state, submit, reset } = useSubmit("/api/contact");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", subject: "", message: "", consent: false, website: "" },
  });


  const onSubmit = handleSubmit(async (data) => {
    const result = await submit({ ...data, startedAt });
    if (result && !result.ok && result.fieldErrors) {
      for (const [k, msgs] of Object.entries(result.fieldErrors)) {
        setError(k as keyof ContactInput, { message: msgs[0] ?? "Invalid" });
      }
    }
  });

  if (state.status === "success" || (state.status === "error" && state.result.code !== "validation")) {
    return <SubmitResult state={state} nextSteps={NEXT_STEPS} onRetry={reset} />;
  }
  const submitting = state.status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="surface space-y-5 p-6 sm:p-10" aria-label="Contact form">
      <Honeypot register={register("website")} />
      <h2 className="h3">Send us a message</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Full name" error={errors.fullName?.message}>
          <input id="c-name" className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("c-name", errors.fullName?.message)} {...register("fullName")} />
        </Field>
        <Field id="c-email" label="Email address" error={errors.email?.message}>
          <input id="c-email" type="email" inputMode="email" className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("c-email", errors.email?.message)} {...register("email")} />
        </Field>
      </div>
      <Field id="c-subject" label="Subject" error={errors.subject?.message}>
        <input id="c-subject" className={inputClass} aria-invalid={Boolean(errors.subject)} aria-describedby={describedBy("c-subject", errors.subject?.message)} {...register("subject")} />
      </Field>
      <Field id="c-message" label="Message" error={errors.message?.message} hint="Please don't include ID numbers or bank/card details.">
        <textarea id="c-message" rows={6} maxLength={2000} className={inputClass} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("c-message", errors.message?.message, "hint")} {...register("message")} />
      </Field>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-2">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "c-consent-error" : undefined} {...register("consent")} />
          <span>
            I agree that CONSOLE INSURANCE may use these details to reply to me, as described in the{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="text-brand underline underline-offset-4">
              privacy notice
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="c-consent-error" role="alert" className="mt-2 text-sm text-danger">
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
            Send message <ArrowRight size={18} aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
