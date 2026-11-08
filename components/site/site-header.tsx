"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { buttonClass } from "@/components/ui/button";
import type { Dict } from "@/lib/i18n";
import { localePath, type Locale, type PageKey } from "@/lib/locales";
import { LangSwitcher } from "./lang-switcher";

/**
 * Sticky header. The mobile menu is a native <details>, so it opens and closes
 * before hydration too; JavaScript only adds "close after picking a link".
 */
export function SiteHeader({
  locale,
  page,
  nav,
  preserveQuery = false,
}: {
  locale: Locale;
  page: PageKey;
  nav: Dict["nav"];
  preserveQuery?: boolean;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const t = nav;
  const onHome = page === "";
  const anchor = (id: string) => (onHome ? `#${id}` : localePath(locale, "", id));

  const links = [
    { href: anchor("features"), label: t.features },
    { href: anchor("product"), label: t.product },
    { href: anchor("pricing"), label: t.pricing },
    { href: anchor("faq"), label: t.faq },
  ];

  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-noite/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-luz focus:px-4 focus:py-2 focus:text-noite"
      >
        {t.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href={localePath(locale)} className="flex min-h-11 items-center gap-2.5" aria-label={t.home}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 32px brand mark, no optimisation needed */}
          <img src="/brand/icon-512.png" alt="" width={32} height={32} className="size-8 rounded-[9px]" />
          <span className="font-display text-lg font-semibold tracking-tight">CosmoTV</span>
        </a>

        <nav aria-label={t.menu} className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-luz"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LangSwitcher
            locale={locale}
            page={page}
            label={t.language}
            preserveQuery={preserveQuery}
            className="hidden md:flex"
          />
          <a href={anchor("launch")} className={buttonClass("primary", "hidden min-h-11 px-5 py-2 text-sm sm:inline-flex")}>
            {t.cta}
          </a>

          <details ref={menuRef} className="group md:hidden">
            <summary
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-luz"
              aria-label={t.menu}
            >
              <Menu className="size-5 group-open:hidden" aria-hidden="true" />
              <X className="hidden size-5 group-open:block" aria-hidden="true" />
            </summary>
            <div className="absolute inset-x-0 top-full border-b border-line bg-noite px-4 pb-6 pt-2 shadow-2xl">
              <nav aria-label={t.menu} className="flex flex-col">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-12 items-center border-b border-line/60 font-display text-lg"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <LangSwitcher locale={locale} page={page} label={t.language} preserveQuery={preserveQuery} />
                <a href={anchor("launch")} onClick={closeMenu} className={buttonClass("primary", "w-full min-[380px]:w-auto")}>
                  {t.cta}
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
