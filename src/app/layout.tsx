import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionConfig } from "motion/react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IntroGate } from "@/components/intro/IntroGate";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { company, siteUrl } from "@/content/company";
import { introHeadScript } from "@/lib/introStore";

/**
 * Fonts are self-hosted (no third-party requests) and loaded through next/font, which preloads them and
 * generates a metric-matched fallback so the swap does not shift layout. Latin subset only — add the
 * *-latin-ext files from @fontsource-variable/* if non-Latin characters are ever needed.
 */
const display = localFont({
  src: "./fonts/unbounded-latin-wght.woff2",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
  adjustFontFallback: "Arial",
});
const sans = localFont({
  src: "./fonts/manrope-latin-wght.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const viewport: Viewport = {
  themeColor: "#02050d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${company.name} — ${company.tagline}`, template: `%s · ${company.name}` },
  description:
    "CONSOLE INSURANCE is an insurance agency in Subukia, Nakuru. Explore life, health, motor and property insurance and request a quote.",
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} — ${company.tagline}`,
    description: "Explore insurance for your life, health, vehicle and home — and talk to a real person.",
    url: "/",
    locale: "en_KE",
  },
  twitter: { card: "summary_large_image", title: company.name, description: company.tagline },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* First-visit flag: prevents a flash of the page before the one-time intro mounts. See lib/introStore.ts */}
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
        <noscript>
          <style>{`html[data-intro]::after{display:none!important}html[data-intro] body{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <a
            href="#main"
            className="sr-only-focusable fixed left-4 top-4 z-[300] rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Skip to content
          </a>
          <TransitionProvider>
            <div id="app-root">
              <Header />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
            </div>
          </TransitionProvider>
          <IntroGate />
        </MotionConfig>
      </body>
    </html>
  );
}
