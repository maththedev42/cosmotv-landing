import { localePath, type Dict, type Locale, type PageKey } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/landing-data";
import { LangSwitcher } from "./lang-switcher";

export function SiteFooter({
  locale,
  page,
  dict,
  preserveQuery = false,
}: {
  locale: Locale;
  page: PageKey;
  dict: Dict;
  preserveQuery?: boolean;
}) {
  const t = dict.footer;
  const onHome = page === "";
  const anchor = (id: string) => (onHome ? `#${id}` : localePath(locale, "", id));

  const productLinks = [
    { href: anchor("features"), label: dict.nav.features },
    { href: anchor("product"), label: dict.nav.product },
    { href: anchor("pricing"), label: dict.nav.pricing },
    { href: anchor("faq"), label: dict.nav.faq },
    { href: anchor("launch"), label: dict.nav.cta },
  ];

  const legalLinks = [
    { href: localePath(locale, "privacy"), label: t.links.privacy },
    { href: localePath(locale, "terms"), label: t.links.terms },
    { href: localePath(locale, "support"), label: t.links.support },
    { href: localePath(locale, "contact"), label: t.links.contact },
    { href: localePath(locale, "delete-account"), label: t.links.deleteAccount },
  ];

  return (
    <footer className="border-t border-line bg-noite-3 text-luz">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href={localePath(locale)} className="inline-flex min-h-11 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- small brand mark */}
            <img src="/brand/icon-512.png" alt="" width={36} height={36} className="size-9 rounded-[10px]" />
            <span className="font-display text-xl font-semibold tracking-tight">CosmoTV</span>
          </a>
          <p className="mt-5 max-w-sm font-display text-2xl font-medium leading-snug tracking-tight text-balance">
            {t.tagline}
          </p>
          <p className="mt-6 text-sm text-muted">
            {t.emailLabel}:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orbita-soft underline-offset-4 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <nav aria-label={t.productTitle}>
          <p className="ep-code text-xs uppercase text-muted">{t.productTitle}</p>
          <ul className="mt-4 space-y-1">
            {productLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-10 items-center text-luz/85 hover:text-luz">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.legalTitle}>
          <p className="ep-code text-xs uppercase text-muted">{t.legalTitle}</p>
          <ul className="mt-4 space-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-10 items-center text-luz/85 hover:text-luz">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-muted sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p>{t.honesty}</p>
            <p>{t.attribution}</p>
            <p>{t.rights}</p>
          </div>
          <LangSwitcher locale={locale} page={page} label={dict.nav.language} preserveQuery={preserveQuery} />
        </div>
      </div>
    </footer>
  );
}
