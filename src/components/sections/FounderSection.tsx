import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { founder } from "@/content/founder";

/** Founder profile: only supplied biography. Photo is a clearly-marked replaceable placeholder (never a generated face). */
export function FounderSection({ id = "founder" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="founder-title" className="section relative">
      <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <div
              role="img"
              aria-label="Portrait placeholder for Malcolm Njoroge"
              className="surface relative grid aspect-[4/5] max-w-md place-items-center overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(37,99,255,0.28),transparent_70%)]"
              />
              <svg viewBox="0 0 120 150" className="relative h-2/3 w-auto opacity-70" fill="none" aria-hidden>
                <circle cx="60" cy="52" r="26" stroke="#7cc0ff" strokeWidth="2" />
                <path d="M12 142 c4 -38 26 -52 48 -52 s44 14 48 52" stroke="#7cc0ff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <Placeholder>approved founder photograph to be supplied</Placeholder>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">Founder</p>
            <h2 id="founder-title" className="h2 mt-4">
              {founder.name}
            </h2>
            <p className="mt-2 text-mist">{founder.role}</p>
          </Reveal>

          <ol className="relative mt-12 space-y-0 border-l border-line-strong pl-8">
            {founder.timeline.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 0.08} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[2.45rem] top-1.5 h-3 w-3 rounded-full border-2 border-electric-300 bg-ink-950"
                />
                <p className="font-display text-sm tracking-[0.18em] text-electric-300">{item.year}</p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-mist">{item.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
