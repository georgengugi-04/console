import { afterEach, describe, expect, it, vi } from "vitest";
import { MIN_FILL_MS, clientIp, hashIp, isSameOrigin, looksAutomated } from "@/lib/abuse";

afterEach(() => vi.unstubAllEnvs());

describe("looksAutomated", () => {
  const now = 10_000_000;
  it("flags a filled honeypot", () => expect(looksAutomated({ website: "x" }, now)).toBe(true));
  it("flags forms submitted faster than a human can", () => {
    expect(looksAutomated({ startedAt: now - (MIN_FILL_MS - 100) }, now)).toBe(true);
  });
  it("flags stale or forged timestamps", () => {
    expect(looksAutomated({ startedAt: now - 1000 * 60 * 60 * 25 }, now)).toBe(true);
  });
  it("passes a normal submission", () => {
    expect(looksAutomated({ website: "", startedAt: now - 20_000 }, now)).toBe(false);
  });
});

describe("hashIp / clientIp", () => {
  it("is stable, salted and does not contain the address", () => {
    vi.stubEnv("IP_HASH_SALT", "salt-1");
    const a = hashIp("203.0.113.9");
    expect(a).toBe(hashIp("203.0.113.9"));
    expect(a).not.toContain("203");
    vi.stubEnv("IP_HASH_SALT", "salt-2");
    expect(hashIp("203.0.113.9")).not.toBe(a);
  });
  it("reads the first forwarded address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" }))).toBe("198.51.100.4");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("isSameOrigin", () => {
  it("accepts matching origin/host and rejects others", () => {
    expect(isSameOrigin(new Headers({ origin: "https://site.ke", host: "site.ke" }))).toBe(true);
    expect(isSameOrigin(new Headers({ origin: "https://evil.example", host: "site.ke" }))).toBe(false);
    expect(isSameOrigin(new Headers({ origin: "not a url", host: "site.ke" }))).toBe(false);
  });
  it("requires an Origin header in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isSameOrigin(new Headers({ host: "site.ke" }))).toBe(false);
  });
});
