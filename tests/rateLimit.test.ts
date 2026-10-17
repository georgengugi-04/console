import { beforeEach, describe, expect, it } from "vitest";
import { __resetRateLimitForTests, rateLimit } from "@/lib/rateLimit";

beforeEach(() => __resetRateLimitForTests());

describe("rateLimit", () => {
  it("allows up to the limit then blocks with a Retry-After", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 60_000, t + i).allowed).toBe(true);
    const blocked = rateLimit("k", 3, 60_000, t + 10);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("frees capacity once the window slides past old hits", () => {
    const t = 5_000_000;
    for (let i = 0; i < 3; i++) rateLimit("k", 3, 60_000, t);
    expect(rateLimit("k", 3, 60_000, t + 1000).allowed).toBe(false);
    expect(rateLimit("k", 3, 60_000, t + 61_000).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    for (let i = 0; i < 3; i++) rateLimit("a", 3, 60_000, 1);
    expect(rateLimit("a", 3, 60_000, 2).allowed).toBe(false);
    expect(rateLimit("b", 3, 60_000, 2).allowed).toBe(true);
  });
});
