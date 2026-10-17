/**
 * Customer-education content.
 *
 * ALL entries are `status: "draft"`: general, non-authoritative explainers written as placeholders so the
 * Resources section works end-to-end. They are labelled "Draft" in the UI and must be reviewed by CONSOLE
 * (and checked against current Kenyan regulation and insurer terms) before being published as final.
 * They deliberately avoid legal/regulatory interpretation, prices, limits and statistics.
 */

export type ResourceCategory = "Basics" | "Life" | "Health" | "Motor" | "Property" | "Claims";

export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory;
  excerpt: string;
  readingMinutes: number;
  status: "draft" | "reviewed";
  body: string[]; // paragraphs; lines starting with "## " are subheadings
  related: string[];
};

export const resources: Resource[] = [
  {
    slug: "how-insurance-works",
    title: "How insurance works, in plain language",
    category: "Basics",
    excerpt: "The simple idea behind every policy: sharing risk so one bad event doesn't ruin your finances.",
    readingMinutes: 3,
    status: "draft",
    body: [
      "Insurance is an agreement. You pay the insurer a regular amount, called a premium. In return, the insurer agrees to pay for certain losses described in your policy.",
      "## The three things to understand",
      "The policy is the contract. It says what is covered, what is excluded, and what you must do — before and after a loss.",
      "The premium is what you pay to keep the cover active. How it is worked out depends on the insurer and the type of cover.",
      "A claim is your request for the insurer to pay under the policy. The insurer assesses it against the policy's terms.",
      "## Why read the policy",
      "Two policies with the same name can cover different things. Reading the schedule and exclusions — and asking questions — is the best way to avoid surprises.",
    ],
    related: ["questions-before-you-buy", "making-a-claim-basics"],
  },
  {
    slug: "questions-before-you-buy",
    title: "Questions to ask before you buy any policy",
    category: "Basics",
    excerpt: "A short checklist to bring to any conversation with an adviser.",
    readingMinutes: 2,
    status: "draft",
    body: [
      "A good conversation about insurance starts with questions. Here are some worth asking whoever you speak to.",
      "## About the cover",
      "What exactly is covered, and what is excluded? Are there limits on what the insurer will pay? Is there an excess or waiting period?",
      "## About the process",
      "How do I make a claim, and what will I need to provide? How and when can the policy be changed or cancelled?",
      "## About you",
      "What does the insurer need to know about me? What happens if I give incomplete or inaccurate information?",
    ],
    related: ["how-insurance-works"],
  },
  {
    slug: "thinking-about-life-cover",
    title: "Thinking about life cover: where to start",
    category: "Life",
    excerpt: "Four questions that help you work out who and what you want to protect.",
    readingMinutes: 3,
    status: "draft",
    body: [
      "Life insurance is usually about the people who would be affected if you were no longer around.",
      "## Start with people, not products",
      "List who depends on you — financially or practically — and for how long. That tells you far more than any product brochure.",
      "## Then consider commitments",
      "Think about loans, school fees and recurring obligations that would continue without your income.",
      "## Then talk it through",
      "An adviser can explain the types of life cover available through insurers and what each one requires from you.",
    ],
    related: ["questions-before-you-buy"],
  },
  {
    slug: "choosing-a-health-plan",
    title: "What to compare when choosing a health plan",
    category: "Health",
    excerpt: "Benefits, facilities, waiting periods and renewal — the areas where plans differ most.",
    readingMinutes: 3,
    status: "draft",
    body: [
      "Health plans can look similar on the surface and differ a lot underneath.",
      "## Compare the areas that matter to you",
      "Which facilities can you use? Which services are included — and which are not? Are there waiting periods before some benefits start?",
      "## Look at the whole year",
      "Ask how the plan treats ongoing conditions, and what happens at renewal.",
    ],
    related: ["questions-before-you-buy"],
  },
  {
    slug: "after-a-vehicle-accident",
    title: "After a vehicle accident: general first steps",
    category: "Motor",
    excerpt: "General safety-first guidance. Always follow your policy and local law.",
    readingMinutes: 2,
    status: "draft",
    body: [
      "This is general guidance only. Your policy and local law set the exact requirements.",
      "## Safety first",
      "Check that everyone is safe and call emergency services if anyone is hurt.",
      "## Then document what happened",
      "Where it is safe to do so, note the time and place, and the details of anyone involved. Keep any photographs and reports.",
      "## Contact your adviser or insurer",
      "Tell them as soon as you reasonably can and ask what they need from you. Check your policy for any time limits on reporting.",
    ],
    related: ["making-a-claim-basics"],
  },
  {
    slug: "making-a-claim-basics",
    title: "Making a claim: what to have ready",
    category: "Claims",
    excerpt: "General preparation tips. Your insurer will confirm the exact documents needed.",
    readingMinutes: 2,
    status: "draft",
    body: [
      "Every insurer has its own process, and the documents required depend on the policy and the type of loss.",
      "## Information that is usually helpful",
      "Your policy number, the date and circumstances of the loss, and the contact details of people involved.",
      "## Keep records",
      "Keep copies of everything you send and note who you spoke to and when.",
      "## Ask early",
      "If you are unsure what is needed, ask before you submit. It usually saves time.",
    ],
    related: ["how-insurance-works"],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Does CONSOLE INSURANCE sell insurance directly?",
    a: "CONSOLE is described in its own materials as an insurance agency. Which insurers and products it works with is being confirmed — contact the team for current details.",
  },
  {
    q: "Can I get a price on this website?",
    a: "No. The site does not calculate premiums. Submit a quote request and the team will follow up with you.",
  },
  {
    q: "What happens to the details I submit?",
    a: "They are sent to CONSOLE so the team can respond to your enquiry. See the Privacy page for how long they are kept and your choices.",
  },
  {
    q: "Is anything on this website a guarantee of cover?",
    a: "No. Cover only exists once a policy is issued by an insurer. Nothing on this site is advice or a promise of cover.",
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
