import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getDict, intlLocale, localePath, type Locale, type PageKey } from "@/lib/i18n";
import { LEGAL_UPDATED } from "@/lib/landing-data";

export function formatUpdated(locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${LEGAL_UPDATED}T12:00:00Z`),
  );
}

/** Light reading surface for the help and legal pages, framed by the site chrome. */
export function LegalShell({
  locale,
  page,
  title,
  intro,
  showUpdated = false,
  children,
}: {
  locale: Locale;
  page: Exclude<PageKey, "">;
  title: string;
  intro: string;
  showUpdated?: boolean;
  children: ReactNode;
}) {
  const dict = getDict(locale);

  return (
    <>
      <SiteHeader locale={locale} page={page} nav={dict.nav} />
      <main id="main" className="bg-luz text-ink">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <a
            href={localePath(locale)}
            className="ep-code inline-flex min-h-11 items-center text-xs uppercase text-muted-light hover:text-orbita"
          >
            ← {dict.legal.backHome}
          </a>
          <h1 className="mt-6 font-display text-[clamp(2.4rem,8vw,3.8rem)] font-semibold leading-[1] tracking-[-0.035em] text-balance">
            {title}
          </h1>
          {showUpdated && (
            <p className="mt-4 text-sm text-muted-light">
              {dict.legal.updatedLabel}: <time dateTime={LEGAL_UPDATED}>{formatUpdated(locale)}</time>
            </p>
          )}
          <p className="mt-6 text-lg leading-relaxed text-ink/85">{intro}</p>
          <div className="mt-12">{children}</div>
        </div>
      </main>
      <SiteFooter locale={locale} page={page} dict={dict} />
    </>
  );
}

export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line-light py-8">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}
