/**
 * Kenyan telephone-number handling.
 *
 * Accepts the formats people actually type:
 *   0712 345 678 · 0112345678 · +254 712 345 678 · 254712345678 · 0722-000-111
 * Mobile numbers: 07xx / 01xx (Safaricom, Airtel, Telkom, etc.). Landlines: 0 + area code 2–6 + 7–8 digits.
 * Returns an E.164-style string (+2547XXXXXXXX) or null if invalid.
 */
const MOBILE = /^(?:\+?254|0)((?:7\d{8})|(?:1[01]\d{7}))$/;
const LANDLINE = /^(?:\+?254|0)([2-6]\d{7,8})$/;

export function normaliseKenyanPhone(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;
  const m = MOBILE.exec(compact) ?? LANDLINE.exec(compact);
  return m?.[1] ? `+254${m[1]}` : null;
}

export function isValidKenyanPhone(input: string): boolean {
  return normaliseKenyanPhone(input) !== null;
}
