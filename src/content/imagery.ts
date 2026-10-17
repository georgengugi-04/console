/**
 * Imagery slots. Every section image on the site is a <Scene name="…"> — an original, theme-aware illustration
 * (no stock-photo licence involved). To use real photography instead, put the file in /public/images and map it here,
 * e.g.  home: { src: "/images/home.jpg", alt: "A family home in Subukia" }.
 * Only use photos CONSOLE owns or has a licence for. Photos are shown with a tonal overlay so text stays readable.
 */
export type SceneName = "land" | "hills" | "home" | "road" | "family" | "health";

export const photos: Partial<Record<SceneName, { src: string; alt: string }>> = {};
