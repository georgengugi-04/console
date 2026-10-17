/**
 * Persistence policy for the one-time brand introduction
 * ───────────────────────────────────────────────────────
 *  • Shown once per browser, on the first eligible visit (any route).
 *  • "Seen" is recorded the moment the intro is DISPLAYED (not when it ends), so a refresh or a quick
 *    navigation never replays it.
 *  • Storage: localStorage key `console.intro.v1`, mirrored to a first-party cookie
 *    `console_intro=1` (1 year, SameSite=Lax, no personal data) so it also survives storage partitioning.
 *  • If neither can be read/written (e.g. blocked storage) the intro is SKIPPED — we cannot guarantee
 *    "only once", so we choose not to show it rather than replay it on every page.
 *  • Bumping INTRO_VERSION re-shows it after a deliberate redesign. Visitors can also replay it from the
 *    footer ("Replay introduction"), which clears the flag.
 *  • The same read logic is inlined (as a string) in the document <head> to avoid a flash — keep in sync.
 */
export const INTRO_KEY = "console.intro.v1";
export const INTRO_COOKIE = "console_intro";

export const introHeadScript = `try{var k='${INTRO_KEY}',seen=localStorage.getItem(k)||(document.cookie.indexOf('${INTRO_COOKIE}=1')>-1?'1':'');if(!seen&&!/[?&]nointro=1/.test(location.search)){document.documentElement.setAttribute('data-intro','pending')}}catch(e){}`;

export function hasSeenIntro(): boolean {
  try {
    return Boolean(localStorage.getItem(INTRO_KEY)) || document.cookie.includes(`${INTRO_COOKIE}=1`);
  } catch {
    return true; // storage unavailable → never show
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_KEY, new Date().toISOString());
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${INTRO_COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function resetIntro(): void {
  try {
    localStorage.removeItem(INTRO_KEY);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${INTRO_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}
