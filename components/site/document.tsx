import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { htmlLang, type Locale } from "@/lib/i18n";
import { MotionReady } from "./motion-ready";

/**
 * Turns motion on BEFORE first paint so reveals don't flash, and turns it off
 * again if React never confirms hydration: a page whose JavaScript failed must
 * still show every section. Mutating <html> before hydration is why <html>
 * carries suppressHydrationWarning.
 */
const MOTION_SCRIPT = `(function(){try{var d=document.documentElement;if(!window.matchMedia||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion-ready');setTimeout(function(){if(!d.classList.contains('motion-hydrated'))d.classList.remove('motion-ready');},3000);}catch(e){}})();`;

/** The <html> shell shared by the default-locale and the [lang] root layouts. */
export function Document({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-noite font-sans text-luz antialiased">
        <MotionReady />
        {children}
      </body>
    </html>
  );
}
