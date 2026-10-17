import { randomBytes } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { SubmissionKind } from "./validation";

export type DeliveryOutcome =
  | { status: "delivered"; reference: string }
  | { status: "development"; reference: string }
  | { status: "not_configured" }
  | { status: "failed" };

function makeReference(kind: SubmissionKind) {
  const prefix = { quote: "Q", contact: "C", claim: "CL" }[kind];
  return `${prefix}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/**
 * Deliver a validated enquiry. Honest by construction:
 *   1. SUBMISSION_WEBHOOK_URL set → POST it; success only if the receiver answers 2xx.
 *   2. Otherwise, if (and only if) ALLOW_LOCAL_SUBMISSION_STORE=true and NODE_ENV != production
 *      → append to .data/submissions.jsonl and report mode "development" (the UI says so).
 *   3. Otherwise → "not_configured": the API returns 503 and the UI tells the visitor to contact CONSOLE directly.
 * It never reports delivered when nothing was delivered.
 */
export async function deliverSubmission(kind: SubmissionKind, data: unknown): Promise<DeliveryOutcome> {
  const reference = makeReference(kind);
  const record = { reference, type: kind, receivedAt: new Date().toISOString(), data };

  const url = process.env.SUBMISSION_WEBHOOK_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.SUBMISSION_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.SUBMISSION_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error(`[submission] webhook responded ${res.status} for ${reference}`);
        return { status: "failed" };
      }
      return { status: "delivered", reference };
    } catch (err) {
      console.error(`[submission] webhook error for ${reference}:`, err instanceof Error ? err.name : "unknown");
      return { status: "failed" };
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.ALLOW_LOCAL_SUBMISSION_STORE === "true") {
    try {
      const dir = path.join(process.cwd(), ".data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "submissions.jsonl"), JSON.stringify(record) + "\n", { mode: 0o600 });
      return { status: "development", reference };
    } catch (err) {
      console.error("[submission] local store failed:", err instanceof Error ? err.name : "unknown");
      return { status: "failed" };
    }
  }

  return { status: "not_configured" };
}
