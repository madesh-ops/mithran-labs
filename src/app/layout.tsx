import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { LogoFull } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Enhancers } from "@/components/motion/Enhancers";
import { IntroBoot } from "@/components/motion/IntroBoot";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { StreakField } from "@/components/motion/StreakField";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", weight: ["400", "500"] });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Mithran Labs — Website Design & Development Studio",
    template: "%s | Mithran Labs",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Mithran Labs — Website design and development studio" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before first paint:
 *  - marks JS as available (enables reveal animations)
 *  - applies the saved or system theme (no flash)
 *  - decides whether to play the intro (first visit per session only) and
 *    always dismisses it: on DOM ready + fonts, never sooner than ~1.4s of
 *    animation, never later than 2.6s after navigation start, regardless of
 *    slow assets. If the page was already slow to start (>1.5s), it is skipped.
 *  - records the intro state on window so it can be re-applied if React resets
 *    the root element during the dev Strict-Mode remount (see IntroBoot).
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');
try{var t=localStorage.getItem('ml-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}
var seen=false;try{seen=sessionStorage.getItem('ml-intro')==='1';sessionStorage.setItem('ml-intro','1')}catch(e){seen=true}
var now=function(){return window.performance&&performance.now?performance.now():0};
if(seen||now()>1500){d.dataset.intro='skip';window.__mlIntro='skip';return}
d.dataset.intro='play';window.__mlIntro='play';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,min=reduce?200:1400,done=false;
function finish(){if(done)return;done=true;setTimeout(function(){d.dataset.intro='done';window.__mlIntro='done'},Math.max(0,min-now()))}
function ready(){var f=document.fonts&&document.fonts.ready;if(f&&f.then){f.then(finish,finish)}else{finish()}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',ready)}else{ready()}
setTimeout(function(){done=false;finish()},Math.max(0,2600-now()));})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body suppressHydrationWarning>
        <IntroBoot />
        <StreakField />
        <div className="intro" aria-hidden="true">
          <div className="intro__mark">
            <div className="intro__logo">
              <LogoFull title="" />
            </div>
            <span className="intro__line" />
          </div>
        </div>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Enhancers />
        <SmoothScroll />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
