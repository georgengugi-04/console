import { Scene } from "@/components/art/Scene";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";

export function CtaBand({
  title = "Let's talk about what matters to you.",
  body = "Tell us what you'd like to protect and we'll follow up to explain the options.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-label="Next step" className="section relative overflow-hidden">
      <Scene name="hills" mode="backdrop" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5" />
      <div className="container-x relative">
        <Reveal className="surface mx-auto max-w-5xl overflow-hidden px-6 py-14 text-center sm:px-14 sm:py-20">
          <h2 className="h1 text-balance">{title}</h2>
          <p className="lead mx-auto mt-6">{body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <LinkButton href="/quote">Get a Quote</LinkButton>
            </Magnetic>
            <Magnetic>
              <LinkButton href="/contact" variant="ghost">
                Contact us
              </LinkButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
