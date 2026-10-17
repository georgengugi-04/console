"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { successLottie } from "./successLottie";

// Self-hosted renderer (no third-party CDN → keeps the CSP strict and works offline).
// This module is only ever loaded in the browser, on demand, after a confirmed success (see SubmitResult).
setWasmUrl("/dotlottie/dotlottie-player.wasm");

/** Decorative check-mark animation. */
export default function SuccessAnimation() {
  return <DotLottieReact data={successLottie} autoplay loop={false} />;
}
