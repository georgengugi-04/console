import type { Theme } from "@/lib/theme";

/** Hero-scene colours per theme. Same hues as the CSS tokens (three.js cannot read CSS variables). */
export type ScenePalette = {
  frame: string;
  frameMetal: number;
  plate: string;
  plateOpacity: number;
  swoosh: string;
  swooshEmissive: string;
  swooshGlow: number;
  pillarA: string;
  pillarB: string;
  pillarEmissive: string;
  pillarGlow: number;
  ringA: string;
  ringB: string;
  body: string;
  accent: string;
  accentEmissive: string;
  accentGlow: number;
  glowInner: string; // rgba stops for the soft halo
  glowOuter: string;
  glowAdditive: boolean;
  glowOpacity: number;
  ambient: number;
  key: string;
  fill: string;
  fillIntensity: number;
  lights: { key: string; wash: string; ring: string; low: string; keyI: number; washI: number; ringI: number; lowI: number };
  sparkle: string;
  sparkleOpacity: number;
  envIntensity: number;
};

export const SCENE_PALETTES: Record<Theme, ScenePalette> = {
  light: {
    frame: "#4a7b69",
    frameMetal: 0.5,
    plate: "#a7b7a7",
    plateOpacity: 0.3,
    swoosh: "#6f9a82",
    swooshEmissive: "#3f6f5d",
    swooshGlow: 0.12,
    pillarA: "#2f6b57",
    pillarB: "#8fae9b",
    pillarEmissive: "#234b40",
    pillarGlow: 0.05,
    ringA: "#2f6b57",
    ringB: "#7aa38b",
    body: "#f1f0ea",
    accent: "#2f6b57",
    accentEmissive: "#234b40",
    accentGlow: 0.05,
    glowInner: "rgba(167,183,167,0.5)",
    glowOuter: "rgba(167,183,167,0)",
    glowAdditive: false,
    glowOpacity: 0.55,
    ambient: 0.55,
    key: "#fff8ec",
    fill: "#c9d8cd",
    fillIntensity: 6,
    lights: { key: "#ffffff", wash: "#dfe8e0", ring: "#ffffff", low: "#c9d8cd", keyI: 3.2, washI: 2.2, ringI: 2, lowI: 1.2 },
    sparkle: "#6f9a82",
    sparkleOpacity: 0.35,
    envIntensity: 1.5,
  },
  dark: {
    frame: "#b4cdbd",
    frameMetal: 0.6,
    plate: "#7e9d89",
    plateOpacity: 0.28,
    swoosh: "#cfe0d4",
    swooshEmissive: "#7e9d89",
    swooshGlow: 0.3,
    pillarA: "#7e9d89",
    pillarB: "#dbe8de",
    pillarEmissive: "#7e9d89",
    pillarGlow: 0.3,
    ringA: "#a7c4af",
    ringB: "#7e9d89",
    body: "#e4ebe5",
    accent: "#a7c4af",
    accentEmissive: "#7e9d89",
    accentGlow: 0.4,
    glowInner: "rgba(126,157,137,0.35)",
    glowOuter: "rgba(126,157,137,0)",
    glowAdditive: true,
    glowOpacity: 0.4,
    ambient: 0.28,
    key: "#eef5ef",
    fill: "#7e9d89",
    fillIntensity: 9,
    lights: { key: "#dbe8de", wash: "#7e9d89", ring: "#ffffff", low: "#a7c4af", keyI: 4, washI: 2.6, ringI: 2.2, lowI: 1.4 },
    sparkle: "#a7c4af",
    sparkleOpacity: 0.4,
    envIntensity: 1.5,
  },
};
