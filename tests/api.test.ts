// @vitest-environment node
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as claimsPost } from "@/app/api/claims/route";
import { POST as contactPost } from "@/app/api/contact/route";
import { POST as quotePost } from "@/app/api/quote/route";
import { __resetRateLimitForTests } from "@/lib/rateLimit";

const validQuote = () => ({
  product: "health",
  fullName: "Amina Wanjiku",
  email: "amina@example.com",
  phone: "0712345678",
  preferredContact: "email",
  details: "Family of four.",
  consent: true,
  website: "",
  startedAt: Date.now() - 15_000,
});

let n = 0;
function req(body: unknown, headers: Record<string, string> = {}, raw?: string) {
  return new Request("http://localhost:3000/api/quote", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost:3000", "x-forwarded-for": `198.51.100.${++n % 250}`, ...headers },
    body: raw ?? JSON.stringify(body),
  });
}

beforeEach(() => {
  __resetRateLimitForTests();
  vi.stubEnv("SUBMISSION_WEBHOOK_URL", "");
  vi.stubEnv("ALLOW_LOCAL_SUBMISSION_STORE", "false");
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("honest delivery", () => {
  it("returns 503 not_configured — never a fake success — when no delivery channel exists", async () => {
    const res = await quotePost(req(validQuote()));
    const json = await res.json();
    expect(res.status).toBe(503);
    expect(json).toMatchObject({ ok: false, code: "not_configured" });
  });

  it("reports delivered only when the webhook answers 2xx, and strips abuse-only fields", async () => {
    vi.stubEnv("SUBMISSION_WEBHOOK_URL", "https://hooks.example.test/in");
    vi.stubEnv("SUBMISSION_WEBHOOK_TOKEN", "secret-token");
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await quotePost(req(validQuote()));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ ok: true, mode: "delivered" });
    expect(json.reference).toMatch(/^Q-[0-9A-F]{8}$/);

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init.headers.authorization).toBe("Bearer secret-token");
    const sent = JSON.parse(init.body);
    expect(sent.type).toBe("quote");
    expect(sent.data.phone).toBe("+254712345678");
    expect(sent.data).not.toHaveProperty("website");
    expect(sent.data).not.toHaveProperty("startedAt");
  });

  it("reports failure (502) when the webhook rejects", async () => {
    vi.stubEnv("SUBMISSION_WEBHOOK_URL", "https://hooks.example.test/in");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    const res = await quotePost(req(validQuote()));
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  it("reports failure (502) when the webhook is unreachable", async () => {
    vi.stubEnv("SUBMISSION_WEBHOOK_URL", "https://hooks.example.test/in");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    const res = await quotePost(req(validQuote()));
    expect(res.status).toBe(502);
  });

  it("uses an explicitly-labelled development store only when enabled outside production", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "console-"));
    vi.spyOn(process, "cwd").mockReturnValue(dir);
    vi.stubEnv("ALLOW_LOCAL_SUBMISSION_STORE", "true");
    try {
      const res = await contactPost(
        req({ fullName: "Joe Kamau", email: "joe@example.com", subject: "Hello", message: "A real question here.", consent: true, startedAt: Date.now() - 9000 }),
      );
      const json = await res.json();
      expect(json).toMatchObject({ ok: true, mode: "development" });
      const line = (await readFile(path.join(dir, ".data", "submissions.jsonl"), "utf8")).trim();
      expect(JSON.parse(line).type).toBe("contact");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("never uses the development store in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_LOCAL_SUBMISSION_STORE", "true");
    const res = await quotePost(req(validQuote(), { origin: "http://localhost:3000" }));
    expect(res.status).toBe(503);
  });
});

describe("validation and abuse protection", () => {
  it("returns 422 with field errors for invalid input", async () => {
    const res = await quotePost(req({ ...validQuote(), email: "bad", phone: "123" }));
    const json = await res.json();
    expect(res.status).toBe(422);
    expect(json.code).toBe("validation");
    expect(Object.keys(json.fieldErrors)).toEqual(expect.arrayContaining(["email", "phone"]));
  });

  it("rejects bot-fast submissions", async () => {
    const res = await quotePost(req({ ...validQuote(), startedAt: Date.now() - 200 }));
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON and oversize bodies", async () => {
    expect((await quotePost(req(null, {}, "{not json"))).status).toBe(400);
    expect((await quotePost(req(validQuote(), { "content-length": "999999" }))).status).toBe(413);
  });

  it("rejects cross-origin posts", async () => {
    const res = await quotePost(req(validQuote(), { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("rate-limits repeated submissions from one client with Retry-After", async () => {
    const headers = { "x-forwarded-for": "203.0.113.77" };
    const statuses: number[] = [];
    let last: Response | undefined;
    for (let i = 0; i < 7; i++) {
      last = await quotePost(req({ ...validQuote(), email: "bad" }, headers));
      statuses.push(last.status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 422)).toBe(true);
    expect(statuses[5]).toBe(429);
    expect(last!.headers.get("retry-after")).toBeTruthy();
  });

  it("claims endpoint validates claim type", async () => {
    const res = await claimsPost(
      req({ fullName: "Joe Kamau", email: "joe@example.com", phone: "0722000111", claimType: "boat", summary: "Something happened.", consent: true, startedAt: Date.now() - 9000 }),
    );
    expect(res.status).toBe(422);
  });
});
