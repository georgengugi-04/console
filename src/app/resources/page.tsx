import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ResourceBrowser } from "@/components/sections/ResourceBrowser";
import { Reveal } from "@/components/motion/Reveal";
import { faqs, resources, type ResourceCategory } from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Plain-language guides and answers about insurance from CONSOLE INSURANCE.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const categories = Array.from(new Set(resources.map((r) => r.category))) as ResourceCategory[];
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Clear answers, in plain language."
        lead="Short guides to help you ask better questions. Articles marked Draft are placeholders pending review by CONSOLE."
      />
      <section className="section pt-4" aria-label="Guides">
        <div className="container-x">
          <ResourceBrowser items={resources} categories={categories} />
        </div>
      </section>

      <section className="section hairline-t" aria-labelledby="faq">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq" className="h2 mt-4">
              Common questions.
            </h2>
          </Reveal>
          <div className="divide-y divide-line lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-semibold marker:hidden">
                  {f.q}
                  <span aria-hidden className="text-electric-300 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
