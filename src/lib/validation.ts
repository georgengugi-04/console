import { z } from "zod";
import { normaliseKenyanPhone } from "./phone";

// Our Content-Security-Policy forbids eval. Zod 4 probes `new Function()` to JIT-compile validators; with the
// CSP that probe is blocked (harmlessly, but it shows up as a CSP issue). Run in interpreted mode instead —
// the cost is negligible for forms this small.
z.config({ jitless: true });

/**
 * Shared Zod schemas — imported by BOTH the browser forms (via react-hook-form) and the API routes,
 * so client and server validate exactly the same rules.
 */

const text = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`)
    // reject ASCII control characters (keeps logs and downstream systems clean)
    .refine((v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v), `${label} contains invalid characters`);

export const fullName = text("Full name", 2, 80).refine((v) => /\p{L}/u.test(v), "Please enter your name");

export const email = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .pipe(z.email("Enter a valid email address"));

export const kenyanPhone = z
  .string({ error: "Phone number is required" })
  .trim()
  .refine((v) => normaliseKenyanPhone(v) !== null, "Enter a valid Kenyan number, e.g. 0712 345 678")
  .transform((v) => normaliseKenyanPhone(v) as string);

const consent = z
  .boolean({ error: "Please confirm you agree so we can contact you" })
  .refine((v) => v === true, "Please confirm you agree so we can contact you");

/** Honeypot + render timestamp: cheap, invisible abuse signals (see lib/abuse.ts) */
const abuse = {
  website: z.string().max(0).optional(), // honeypot — real users never fill this
  startedAt: z.number().int().optional(),
};

export const productChoices = ["life", "health", "motor", "property"] as const;
export type QuoteProductChoice = (typeof productChoices)[number];

export const quoteSchema = z.object({
  product: z.enum(productChoices, { error: "Choose an insurance category" }),
  fullName,
  email,
  phone: kenyanPhone,
  preferredContact: z.enum(["phone", "email"],{ error: "Choose how we should reach you" }),
  details: text("Details", 0, 1000).optional().or(z.literal("")),
  consent,
  ...abuse,
});
export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;

/** Step-level schemas so the multi-step form can validate one step at a time. */
export const quoteStepFields = {
  1: ["product"],
  2: ["fullName", "email", "phone", "preferredContact"],
  3: ["details", "consent"],
} as const satisfies Record<number, readonly (keyof QuoteInput)[]>;

export const contactSchema = z.object({
  fullName,
  email,
  subject: text("Subject", 3, 120),
  message: text("Message", 10, 2000),
  consent,
  ...abuse,
});
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const claimEnquirySchema = z.object({
  fullName,
  email,
  phone: kenyanPhone,
  policyNumber: text("Policy number", 0, 40).optional().or(z.literal("")),
  claimType: z.enum(["life", "health", "motor", "property", "other"], { error: "Choose the type of claim" }),
  summary: text("Summary", 10, 1500),
  consent,
  ...abuse,
});
export type ClaimInput = z.input<typeof claimEnquirySchema>;
export type ClaimData = z.output<typeof claimEnquirySchema>;

export type SubmissionKind = "quote" | "contact" | "claim";

export type ApiResult =
  | { ok: true; mode: "delivered" | "development"; reference: string }
  | { ok: false; code: "validation" | "rate_limited" | "not_configured" | "bad_request" | "server"; message: string; fieldErrors?: Record<string, string[]> };
