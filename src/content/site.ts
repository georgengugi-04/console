export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Insurance Products" },
  { href: "/claims", label: "Claims" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

/** Contextual page-transition messages (brief §7). Longest-prefix match wins. */
export const transitionMessages: { prefix: string; message: string }[] = [
  { prefix: "/about", message: "The people and purpose behind CONSOLE." },
  { prefix: "/products", message: "Discover protection for what matters." },
  { prefix: "/claims", message: "We're here to help you move forward." },
  { prefix: "/contact", message: "Let's start a conversation." },
  { prefix: "/quote", message: "A few details, then we take it from there." },
  { prefix: "/resources", message: "Clear answers, in plain language." },
  { prefix: "/privacy", message: "Your information, handled with care." },
  { prefix: "/", message: "A better way to think about protection." },
];

export function messageForPath(pathname: string): string {
  const clean = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const hit = transitionMessages
    .filter((m) => m.prefix !== "/" && (clean === m.prefix || clean.startsWith(m.prefix + "/")))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
  return hit?.message ?? "A better way to think about protection.";
}
