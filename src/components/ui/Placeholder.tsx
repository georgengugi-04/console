import type { ReactNode } from "react";

/**
 * Clearly identified placeholder for information CONSOLE has not supplied yet.
 * Rendered visibly during review; hide everywhere at launch with NEXT_PUBLIC_SHOW_PLACEHOLDERS=false
 * once real content replaces it.
 */
export function Placeholder({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "false") return null;
  return (
    <span
      className={`inline-block rounded-md border border-dashed border-electric-400/50 bg-electric-400/5 px-2 py-0.5 text-[0.72rem] font-medium tracking-wide text-electric-300 ${className}`}
    >
      Placeholder · {children}
    </span>
  );
}
