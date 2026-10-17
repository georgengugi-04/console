import { describe, expect, it } from "vitest";
import { isValidKenyanPhone, normaliseKenyanPhone } from "@/lib/phone";

describe("Kenyan phone numbers", () => {
  it.each([
    ["0712 345 678", "+254712345678"],
    ["0712345678", "+254712345678"],
    ["+254 712 345 678", "+254712345678"],
    ["254712345678", "+254712345678"],
    ["0722-000-111", "+254722000111"],
    ["0112345678", "+254112345678"],
    ["0102345678", "+254102345678"],
    ["(0712) 345.678", "+254712345678"],
  ])("normalises %s", (input, expected) => {
    expect(normaliseKenyanPhone(input)).toBe(expected);
  });

  it.each(["", "abc", "0712", "+254 12701222", "12701222", "0912345678", "07123456789", "+1 415 555 0100", "0712 345 67x"])(
    "rejects %j",
    (input) => {
      expect(isValidKenyanPhone(input)).toBe(false);
    },
  );

  it("flags the number supplied in the legacy files as invalid (it is one digit short)", () => {
    expect(isValidKenyanPhone("+254 12701222")).toBe(false);
  });
});
