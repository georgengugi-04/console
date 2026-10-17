import Link from "next/link";
import { PhoneText } from "@/components/ui/PhoneText";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/content/company";
import { availableProducts } from "@/content/products";
import { nav } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { ReplayIntroButton } from "./ReplayIntroButton";

export function Footer() {
  const { address, email } = company.contact;
  return (
    <footer className="relative border-t border-line bg-ink-900/60">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" aria-label="CONSOLE INSURANCE, Your Tomorrow, Our Priority — home" className="inline-block rounded-lg">
            <Logo showTagline />
          </Link>
          <p className="mt-6 max-w-sm text-sm text-mist">
            {company.tagline} CONSOLE is an insurance agency based in Subukia, Nakuru — helping you explore life,
            health, motor and property insurance.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="text-mist transition hover:text-white" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-mist transition hover:text-white" href="/quote">
                Get a Quote
              </Link>
            </li>
          </ul>
          <h2 className="eyebrow mt-8">Cover</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {availableProducts.map((p) => (
              <li key={p.slug}>
                <Link className="text-mist transition hover:text-white" href={`/products/${p.slug}`}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow">Reach us</h2>
          <ul className="mt-4 space-y-3 text-sm text-mist">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-electric-300" aria-hidden />
              <span>
                {address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-electric-300" aria-hidden />
              <PhoneText className="transition hover:text-white" />
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-electric-300" aria-hidden />
              <a className="break-all transition hover:text-white" href={`mailto:${email.value}`}>
                {email.value}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline-t">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-steel md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p>
              © {new Date().getFullYear()} {company.name}. Information on this website is general and is not advice,
              an offer, or a guarantee of cover.
            </p>
            <p>
              <Placeholder>licence / regulatory registration details to be supplied by CONSOLE</Placeholder>
            </p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy &amp; data
              </Link>
            </li>
            <li>
              <ReplayIntroButton />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
