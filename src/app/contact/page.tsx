import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { company, mapsSearchUrl } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CONSOLE INSURANCE in Subukia, Nakuru by phone, email or enquiry form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { address, phone, email } = company.contact;
  const cards = [
    { icon: MapPin, label: "Visit", value: address.lines.join(", "), href: undefined as string | undefined },
    { icon: Phone, label: "Call", value: phone.display, href: phone.status === "supplied" ? `tel:${phone.tel}` : undefined },
    { icon: Mail, label: "Email", value: email.value, href: `mailto:${email.value}` },
  ];

  return (
    <>
      <PageHero scene="home"
        eyebrow="Contact"
        title="Let's start a conversation."
        lead="Call, email or send a message. We'll reply to the details you give us."
      />
      <section className="section pt-4">
        <div className="container-x grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.07} className="surface flex items-start gap-5 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <c.icon size={20} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block break-all text-lg font-semibold hover:text-brand sm:break-words">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-lg font-semibold">{c.value}</p>
                  )}
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.25} className="surface overflow-hidden">
              <div className="relative grid h-40 place-items-center bg-sunken">
                <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
                <MapPin size={34} className="relative text-brand" aria-hidden />
              </div>
              <div className="p-6">
                <p className="font-semibold">{address.value}</p>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand"
                >
                  Open area in Maps <ArrowUpRight size={16} aria-hidden />
                </a>
                <p className="mt-3 text-xs text-fg-muted">
                  <Placeholder>exact street location / map pin and opening hours to be supplied</Placeholder>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="rounded-2xl border border-line p-6 text-sm text-fg-2">
              <h2 className="font-semibold text-fg">After you send an enquiry</h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                <li>Your message goes to the CONSOLE team.</li>
                <li>A team member reads it and replies using the email you provided.</li>
                <li>If you asked for cover, they&apos;ll explain the options and next steps.</li>
              </ol>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
