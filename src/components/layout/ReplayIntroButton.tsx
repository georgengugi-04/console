"use client";

import { REPLAY_EVENT } from "@/components/intro/IntroGate";

export function ReplayIntroButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}
      className="underline-offset-4 transition hover:text-white hover:underline"
    >
      Replay introduction
    </button>
  );
}
