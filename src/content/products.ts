/**
 * Insurance categories.
 *
 * `available` reflects the supplied source files:
 *   - Motor / vehicle, Health, Property / home : listed on the legacy services page      → true
 *   - Life                                      : named in the legacy home-page copy       → true
 *   - Business                                  : requested in the brief, NOT in any file  → false
 *
 * Unavailable categories are filtered out everywhere by `availableProducts`, so the site never
 * implies a product that the company has not confirmed. Flip the flag once CONSOLE confirms it.
 *
 * Copy is intentionally general: no premiums, limits, benefits or insurer names are stated,
 * because none were supplied. Policy terms always come from the issuing insurer.
 */

export type ProductSlug = "life" | "health" | "motor" | "property" | "business";

export type Product = {
  slug: ProductSlug;
  name: string;
  short: string;
  /** Hero line on the product page */
  headline: string;
  summary: string;
  whoItsFor: string;
  /** General, definitional points about this type of cover — not promises about a specific policy. */
  considerations: string[];
  /** Questions worth asking an adviser before choosing a policy. */
  askUs: string[];
  /** Accent hue used for the product's visual identity (CSS color) */
  accent: string;
  accentSoft: string;
  /** Short mono code for editorial numbering */
  code: string;
  available: boolean;
};

export const products: Product[] = [
  {
    slug: "life",
    name: "Life Insurance",
    short: "Financial protection for the people who rely on you.",
    headline: "Plan for the people who depend on you.",
    summary:
      "Life insurance is designed to provide a financial benefit to your chosen beneficiaries if the unexpected happens. Speak to us about the types of life cover available and how they fit your family's circumstances.",
    whoItsFor:
      "Parents, partners, and anyone whose income or care supports others — now or in the future.",
    considerations: [
      "Who depends on your income, and for how long?",
      "Whether you want cover for a fixed term or a longer horizon.",
      "Existing debts, school fees or commitments someone else would inherit.",
      "How cover can be reviewed as your life changes.",
    ],
    askUs: [
      "Which life-cover options are available through CONSOLE?",
      "What does the insurer need to know about my health and lifestyle?",
      "How are beneficiaries named and updated?",
    ],
    accent: "#4f8cff",
    accentSoft: "rgba(79,140,255,0.16)",
    code: "01",
    available: true,
  },
  {
    slug: "health",
    name: "Health Insurance",
    short: "Cover for medical costs, for individuals and families.",
    headline: "Care shouldn't wait on a bill.",
    summary:
      "Health insurance helps with the cost of medical care. Cover differs widely between insurers and plans, so we help you compare what matters to you before you decide.",
    whoItsFor: "Individuals and families who want a plan for medical expenses.",
    considerations: [
      "Which hospitals and clinics you want access to.",
      "Inpatient, outpatient and other benefit areas a plan includes or excludes.",
      "Waiting periods and pre-existing conditions rules set by the insurer.",
      "Whether cover is for you alone or for your family.",
    ],
    askUs: [
      "Which health plans can CONSOLE arrange?",
      "How do I check that my preferred facilities are covered?",
      "What happens to my cover at renewal?",
    ],
    accent: "#38d6c4",
    accentSoft: "rgba(56,214,196,0.14)",
    code: "02",
    available: true,
  },
  {
    slug: "motor",
    name: "Motor Insurance",
    short: "Cover for your car, matatu, motorbike or commercial vehicle.",
    headline: "Keep moving, whatever the road does.",
    summary:
      "Motor insurance covers vehicles on the road. The level of protection depends on the policy type and the insurer, so we help you understand the options before you buy.",
    whoItsFor: "Private vehicle owners and anyone who relies on a vehicle for work.",
    considerations: [
      "The difference between the cover types offered for vehicles.",
      "What the vehicle is used for (private or commercial use).",
      "Documents the insurer will ask for when you apply.",
      "How the vehicle's value and condition affect cover.",
    ],
    askUs: [
      "Which motor cover types are available through CONSOLE?",
      "What do I need to provide to get a quote?",
      "What should I do first if my vehicle is in an accident?",
    ],
    accent: "#6aa7ff",
    accentSoft: "rgba(106,167,255,0.16)",
    code: "03",
    available: true,
  },
  {
    slug: "property",
    name: "Property Insurance",
    short: "Protection for your home and belongings.",
    headline: "The place you built deserves a safety net.",
    summary:
      "Property insurance helps protect your home and the belongings inside it against the risks named in your policy. We help you understand what is — and isn't — included.",
    whoItsFor: "Homeowners, landlords and tenants who want to protect what they own.",
    considerations: [
      "What you're insuring: the building, its contents, or both.",
      "Which events the policy names, and which it excludes.",
      "How the value of your property and belongings is assessed.",
      "Whether you rent out all or part of the property.",
    ],
    askUs: [
      "Which property covers can CONSOLE arrange?",
      "How should I list and value my belongings?",
      "What documents do I need to start?",
    ],
    accent: "#8ab4ff",
    accentSoft: "rgba(138,180,255,0.14)",
    code: "04",
    available: true,
  },
  {
    slug: "business",
    name: "Business Insurance",
    short: "Protection for premises, assets and operations.",
    headline: "Built to protect what you've built.",
    summary:
      "Business insurance helps protect a company's premises, equipment and operations. Availability through CONSOLE is still to be confirmed.",
    whoItsFor: "Business owners and managers.",
    considerations: ["Awaiting confirmation from CONSOLE."],
    askUs: ["Awaiting confirmation from CONSOLE."],
    accent: "#a5c4ff",
    accentSoft: "rgba(165,196,255,0.14)",
    code: "05",
    available: false, // ← not in any supplied file. Set to true once CONSOLE confirms.
  },
];

export const availableProducts = products.filter((p) => p.available);

export function getProduct(slug: string): Product | undefined {
  return availableProducts.find((p) => p.slug === slug);
}

/** Explorer: protection needs → which (available) product categories to look at first. */
export type ExplorerNeed = {
  id: string;
  label: string;
  hint: string;
  products: ProductSlug[];
};

export const explorerStages: { id: string; label: string; hint: string; needs: ExplorerNeed[] }[] = [
  {
    id: "stage",
    label: "Where are you in life right now?",
    hint: "Pick the closest fit. You can change it any time.",
    needs: [
      { id: "starting", label: "Starting out", hint: "First job, first car, first place", products: ["health", "motor", "property"] },
      { id: "family", label: "Building a family", hint: "People now rely on me", products: ["life", "health", "property"] },
      { id: "established", label: "Established & growing", hint: "Assets to look after", products: ["property", "motor", "life", "health"] },
      { id: "planning", label: "Planning ahead", hint: "Thinking about the long term", products: ["life", "health"] },
    ],
  },
  {
    id: "worry",
    label: "What would you most like to be prepared for?",
    hint: "Choose the one that comes to mind first.",
    needs: [
      { id: "income", label: "A sudden loss of income", hint: "Or someone depending on mine", products: ["life"] },
      { id: "medical", label: "Medical costs", hint: "Hospital stays, treatment", products: ["health"] },
      { id: "road", label: "Something happening on the road", hint: "Accident, damage, third parties", products: ["motor"] },
      { id: "home", label: "Damage to my home or belongings", hint: "Things I can't easily replace", products: ["property"] },
    ],
  },
];
