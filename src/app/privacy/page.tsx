import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Privacy & Data",
  description: "How CONSOLE INSURANCE handles the information you submit through this website.",
  alternates: { canonical: "/privacy" },
};

const retention = process.env.SUBMISSION_RETENTION_DAYS ?? "180";

export default function PrivacyPage() {
  return (
    <>
      <PageHero scene="hills" eyebrow="Privacy & data" title="Your information, handled with care." />
      <section className="section pt-4">
        <div className="container-x max-w-3xl">
          <p className="rounded-xl border border-dashed border-brand/50 bg-brand-soft p-4 text-sm text-brand">
            Draft notice describing how this website works. It must be reviewed and approved by CONSOLE (and a legal
            adviser) before launch.
          </p>
          <div className="prose-console mt-6">
            <h2>Who is responsible</h2>
            <p>
              {company.name} ({company.contact.address.value}) is responsible for the information you send through this
              website. Contact: <a href={`mailto:${company.contact.email.value}`}>{company.contact.email.value}</a>.
            </p>
            <p>
              <Placeholder>data-protection registration details, if applicable</Placeholder>
            </p>

            <h2>What we collect</h2>
            <ul>
              <li>Quote requests: insurance category, full name, email, phone, preferred contact method, an optional note.</li>
              <li>Contact messages: name, email, subject, message.</li>
              <li>Claims enquiries: name, email, phone, claim type, optional policy number, a short summary.</li>
            </ul>
            <p>Please don&apos;t send ID numbers, bank or card details, or medical records through these forms.</p>

            <h2>Why we use it</h2>
            <p>Only to respond to your enquiry. We don&apos;t sell your information or use it for unrelated marketing.</p>

            <h2>How long we keep it</h2>
            <p>
              Enquiries are kept for up to {retention} days after receipt, then deleted, unless you become a customer or
              the law requires us to keep them longer.
            </p>

            <h2>Who handles it</h2>
            <p>
              Your enquiry is sent securely to CONSOLE&apos;s own systems. Our website hosting provider processes
              requests to deliver the site. <Placeholder>name of the system that receives enquiries</Placeholder>
            </p>

            <h2>Cookies &amp; local storage</h2>
            <p>
              The site stores one small flag in your browser (local storage, and a first-party cookie named
              <code> console_intro</code>) to remember that you have seen the welcome introduction. It contains no personal
              information. We don&apos;t use advertising or analytics cookies.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask to see, correct or delete the information you sent us by emailing{" "}
              <a href={`mailto:${company.contact.email.value}`}>{company.contact.email.value}</a>. You may have rights
              under Kenya&apos;s Data Protection Act, 2019.
            </p>

            <h2>Protecting abuse</h2>
            <p>
              To block spam, forms limit how often a device can submit. For that we use a one-way scrambled form of your
              network address, which isn&apos;t kept with your enquiry.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
