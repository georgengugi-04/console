import type { ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="atmosphere relative overflow-hidden pb-12 pt-36 sm:pb-20 sm:pt-44">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="h1 max-w-5xl text-balance">
          <SplitText as="span" text={title} className="block" />
        </h1>
        {lead && <p className="lead mt-6">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
