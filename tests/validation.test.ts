import { describe, expect, it } from "vitest";
import { claimEnquirySchema, contactSchema, quoteSchema, quoteStepFields } from "@/lib/validation";

const validQuote = {
  product: "motor",
  fullName: "Amina Wanjiku",
  email: "Amina@Example.com ",
  phone: "0712 345 678",
  preferredContact: "phone",
  details: "Private car, one vehicle.",
  consent: true,
};

describe("quoteSchema", () => {
  it("accepts a valid enquiry and normalises email and phone", () => {
    const r = quoteSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("amina@example.com");
      expect(r.data.phone).toBe("+254712345678");
    }
  });

  it("requires consent", () => {
    const r = quoteSchema.safeParse({ ...validQuote, consent: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === "consent")).toBe(true);
  });

  it("rejects unknown or unavailable categories (business is not confirmed)", () => {
    expect(quoteSchema.safeParse({ ...validQuote, product: "business" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...validQuote, product: "pets" }).success).toBe(false);
  });

  it("rejects a bad email, bad phone and control characters", () => {
    expect(quoteSchema.safeParse({ ...validQuote, email: "nope" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...validQuote, phone: "123" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...validQuote, fullName: "Amina\u0000" }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(quoteSchema.safeParse({ ...validQuote, website: "http://spam" }).success).toBe(false);
  });

  it("step field lists only reference real schema keys", () => {
    const keys = Object.keys(quoteSchema.shape);
    for (const fields of Object.values(quoteStepFields)) for (const f of fields) expect(keys).toContain(f);
  });
});

describe("contactSchema", () => {
  const base = { fullName: "Joe Kamau", email: "joe@example.com", subject: "Question", message: "I would like to know more.", consent: true };
  it("accepts valid input", () => expect(contactSchema.safeParse(base).success).toBe(true));
  it("rejects short messages and missing consent", () => {
    expect(contactSchema.safeParse({ ...base, message: "hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });
});

describe("claimEnquirySchema", () => {
  const base = { fullName: "Joe Kamau", email: "joe@example.com", phone: "0722000111", claimType: "motor", summary: "Minor accident on Monday.", consent: true };
  it("accepts valid input with optional policy number", () => {
    expect(claimEnquirySchema.safeParse(base).success).toBe(true);
    expect(claimEnquirySchema.safeParse({ ...base, policyNumber: "POL-123" }).success).toBe(true);
  });
  it("requires a known claim type", () => {
    expect(claimEnquirySchema.safeParse({ ...base, claimType: "boat" }).success).toBe(false);
  });
});
