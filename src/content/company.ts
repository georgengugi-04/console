/**
 * Single source of truth for CONSOLE INSURANCE business facts.
 *
 * Every value here comes from the supplied `koo.zip` (insurance-contact.html, modern-insurance.html,
 * koo.html) or the build brief. `status` records how far each fact can be trusted:
 *   - "supplied"   : taken verbatim from the company's own files
 *   - "needs-confirmation" : supplied, but looks incomplete / inconsistent — confirm before launch
 * Anything that was NOT supplied (opening hours, social profiles, licence number, coordinates)
 * is deliberately absent so the UI cannot display invented details.
 */

export type FactStatus = "supplied" | "needs-confirmation";

export const company = {
  name: "CONSOLE INSURANCE",
  shortName: "CONSOLE",
  legalDescriptor: "Insurance Agency", // legacy pages: "CONSOLE Insurance Agency"
  tagline: "Your Tomorrow, Our Priority.",
  founder: "Malcolm Njoroge",

  contact: {
    address: {
      value: "20109 Subukia, Nakuru",
      lines: ["20109 Subukia", "Nakuru, Kenya"],
      status: "supplied" as FactStatus,
    },
    phone: {
      // Supplied exactly as written in insurance-contact.html. Only 8 digits follow +254,
      // so it is probably missing a digit. Shown as supplied; flagged in docs/HANDOVER.md.
      display: "+254 12701222",
      tel: "+25412701222",
      status: "needs-confirmation" as FactStatus,
    },
    email: {
      value: "mainamalcolm@consoleinsurance.com",
      status: "supplied" as FactStatus,
    },
  },

  /** Facts that were NOT supplied. Kept here so the handover doc and UI logic share one list. */
  notSupplied: [
    "Regulatory / licence status (e.g. IRA registration number)",
    "Underwriters and insurer partners",
    "Opening hours",
    "Social-media profile URLs",
    "Map coordinates / exact street address",
    "Founding date and years in operation",
    "Claims process, forms and required documents",
    "Whether business insurance is offered",
    "Approved founder photograph",
    "Privacy-policy owner / data-protection registration details",
  ],
} as const;

export const mapsSearchUrl =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Subukia, Nakuru, Kenya");

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
