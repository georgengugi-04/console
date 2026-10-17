import { createHmac } from "node:crypto";

/** Minimum time (ms) a human needs to fill a form; faster submissions are treated as bots. */
export const MIN_FILL_MS = 2500;
export const MAX_BODY_BYTES = 16 * 1024;

export function looksAutomated(input: { website?: string | undefined; startedAt?: number | undefined }, now = Date.now()) {
  if (input.website && input.website.length > 0) return true; // honeypot filled
  if (typeof input.startedAt === "number") {
    const elapsed = now - input.startedAt;
    if (elapsed < MIN_FILL_MS) return true;
    if (elapsed > 1000 * 60 * 60 * 24) return true; // stale/forged
  }
  return false;
}

/** Hash IPs before using them as rate-limit keys or writing them to logs (data-minimisation). */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "dev-only-salt";
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 24);
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  const first = fwd?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}

/** Same-origin check for state-changing requests (CSRF defence in depth). */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production"; // tolerate tools like curl in dev only
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
