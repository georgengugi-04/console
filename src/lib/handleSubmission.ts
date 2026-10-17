import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { flattenError } from "zod";
import { MAX_BODY_BYTES, clientIp, hashIp, isSameOrigin, looksAutomated } from "./abuse";
import { deliverSubmission } from "./deliver";
import { rateLimit } from "./rateLimit";
import type { ApiResult, SubmissionKind } from "./validation";

const LIMIT = 5; // submissions …
const WINDOW_MS = 10 * 60 * 1000; // … per 10 minutes per client

function json(body: ApiResult, status: number, extra?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

/**
 * Shared pipeline for every form endpoint:
 * same-origin → size cap → rate limit → JSON parse → Zod validation → bot signals → delivery.
 * Personal data is never logged; only a salted hash of the IP and the outcome.
 */
export async function handleSubmission<T extends { website?: string | undefined; startedAt?: number | undefined }>(
  request: Request,
  kind: SubmissionKind,
  schema: ZodType<T>,
): Promise<NextResponse> {
  if (!isSameOrigin(request.headers)) {
    return json({ ok: false, code: "bad_request", message: "Request origin not allowed." }, 403);
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return json({ ok: false, code: "bad_request", message: "Request too large." }, 413);
  }

  const who = hashIp(clientIp(request.headers));
  const rl = rateLimit(`${kind}:${who}`, LIMIT, WINDOW_MS);
  if (!rl.allowed) {
    return json(
      { ok: false, code: "rate_limited", message: "Too many submissions. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(rl.retryAfterSeconds) },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, code: "bad_request", message: "Request too large." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, code: "bad_request", message: "Invalid request." }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "validation",
        message: "Please check the highlighted fields.",
        fieldErrors: flattenError(parsed.error).fieldErrors as Record<string, string[]>,
      },
      422,
    );
  }

  if (looksAutomated(parsed.data)) {
    // Respond like a normal rejection without telling a bot which signal tripped.
    console.warn(`[submission] ${kind} flagged automated client=${who}`);
    return json({ ok: false, code: "bad_request", message: "We couldn't accept this submission. Please try again." }, 400);
  }

  // Strip abuse-only fields before the data leaves this process.
  const { website: _website, startedAt: _startedAt, ...clean } = parsed.data;
  void _website;
  void _startedAt;

  const outcome = await deliverSubmission(kind, clean);
  console.info(`[submission] ${kind} outcome=${outcome.status} client=${who}`);

  switch (outcome.status) {
    case "delivered":
      return json({ ok: true, mode: "delivered", reference: outcome.reference }, 200);
    case "development":
      return json({ ok: true, mode: "development", reference: outcome.reference }, 200);
    case "not_configured":
      return json(
        {
          ok: false,
          code: "not_configured",
          message:
            "Online enquiries aren't connected yet, so we haven't received your details. Please contact CONSOLE directly using the phone or email below.",
        },
        503,
      );
    default:
      return json({ ok: false, code: "server", message: "We couldn't send your enquiry just now. Please try again or contact us directly." }, 502);
  }
}
