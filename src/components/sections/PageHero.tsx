import type { ReactNode } from "react";
import { Scene } from "@/components/art/Scene";
import type { SceneName } from "@/content/imagery";
import { SplitText } from "@/components/motion/SplitText";

export function PageHero({
  eyebrow,
  title,
  lead,
  scene = "hills",
  children,
}: {
  scene?: SceneName;
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="atmosphere relative overflow-hidden pb-12 pt-36 sm:pb-20 sm:pt-44">
      <Scene name={scene} mode="backdrop" className="pointer-events-none absolute inset-0 opacity-90" />
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
