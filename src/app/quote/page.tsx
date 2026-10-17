import type { Metadata } from "next";
import { PhoneText } from "@/components/ui/PhoneText";
import { Mail, Phone } from "lucide-react";
import { Suspense } from "react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { QuoteFormLoader } from "@/components/forms/QuoteFormLoader";
import { PageHero } from "@/components/sections/PageHero";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Request a quote from CONSOLE INSURANCE. Tell us what you'd like cover for and the team will get in touch.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Get a quote"
        title="Tell us what you'd like to protect."
        lead="A few quick details and the CONSOLE team will get in touch. This form doesn't calculate prices — a team member follows up."
      />
      <section className="section pt-4">
        <div className="container-x grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense fallback={<QuoteForm />}>
              <QuoteFormLoader />
            </Suspense>
          </div>
          <aside aria-label="Before you start" className="space-y-6 lg:col-span-4 lg:sticky lg:top-28">
            <div className="surface p-7">
              <h2 className="h3">What happens next</h2>
              <ol className="mt-5 space-y-4 text-sm text-mist">
                <li><span className="font-semibold text-snow">1.</span> Your details reach the CONSOLE team.</li>
                <li><span className="font-semibold text-snow">2.</span> A team member contacts you by the method you choose.</li>
                <li><span className="font-semibold text-snow">3.</span> They explain the options and what the insurer will need.</li>
              </ol>
            </div>
            <div className="surface p-7 text-sm text-mist">
              <h2 className="font-semibold text-snow">We only ask for what we need</h2>
              <p className="mt-2">
                Name, email, phone and a short note. Please don&apos;t send ID numbers, bank or card details through this
                form. See the{" "}
                <a href="/privacy" className="text-electric-300 underline underline-offset-4">privacy notice</a>.
              </p>
            </div>
            <div className="surface p-7 text-sm text-mist">
              <h2 className="font-semibold text-snow">Prefer to talk?</h2>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-electric-300" aria-hidden />
                  <PhoneText className="hover:text-white" />
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-electric-300" aria-hidden />
                  <a href={`mailto:${company.contact.email.value}`} className="break-all hover:text-white">{company.contact.email.value}</a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
