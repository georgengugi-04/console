"use client";

import { useCallback, useRef, useState } from "react";
import type { ApiResult } from "@/lib/validation";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; result: Extract<ApiResult, { ok: true }> }
  | { status: "error"; result: Extract<ApiResult, { ok: false }> };

/**
 * POSTs JSON to a form endpoint with a synchronous re-entrancy lock (so a double-click or Enter-mash cannot
 * send twice before React re-renders) and maps every failure to an honest, typed result.
 */
export function useSubmit(endpoint: string) {
  const lock = useRef(false);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(
    async (payload: unknown): Promise<ApiResult | null> => {
      if (lock.current) return null;
      lock.current = true;
      setState({ status: "submitting" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as ApiResult;
        setState(json.ok ? { status: "success", result: json } : { status: "error", result: json });
        return json;
      } catch {
        const result = {
          ok: false as const,
          code: "server" as const,
          message: "We couldn't reach the server. Check your connection and try again, or contact us directly.",
        };
        setState({ status: "error", result });
        return result;
      } finally {
        lock.current = false;
      }
    },
    [endpoint],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, submit, reset };
}
