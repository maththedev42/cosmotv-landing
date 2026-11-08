"use client";

import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonClass } from "@/components/ui/button";
import {
  ANDROID_TESTER_LINKS,
  buildTesterIntentUrl,
  normalizeTesterCode,
} from "@/lib/contact-api";
import { getDict, type Dict } from "@/lib/i18n";
import { detectTesterLocale, htmlLang, localePath, type Locale } from "@/lib/locales";

export function TesterLinkPageAuto() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const langs =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];
    const detected = detectTesterLocale(langs);
    setLocale(detected);
    document.documentElement.lang = htmlLang[detected];
  }, []);

  return <TesterLinkPage locale={locale} dict={getDict(locale)} />;
}

export function TesterLinkPage({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.testerPage;
  const testersT = dict.androidTesters;
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("code") || "";
    setCode(normalizeTesterCode(raw));
  }, []);

  async function handleCopy() {
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fall back to selecting the code element text below
    }
    if (codeRef.current && window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <div data-landing-tester-page>
      <SiteHeader locale={locale} page="tester" nav={dict.nav} preserveQuery />
      <main id="main" className="bg-noite text-luz">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <a
            href={localePath(locale)}
            className="ep-code inline-flex min-h-11 items-center text-xs uppercase text-muted hover:text-luz"
          >
            ← {dict.legal.backHome}
          </a>

          <p className="ep-code mt-6 text-xs uppercase tracking-widest text-orbita-soft">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,7vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
            {t.title}
          </h1>

          <div className="mt-6 space-y-8">
            <p
              className="text-lg leading-relaxed text-luz/85"
              data-landing-tester-body
            >
              {code ? t.body : t.incompleteBody}
            </p>

            {code && (
              <div className="rounded-[1.75rem] border border-line bg-noite-2 p-6 sm:p-8 space-y-6">
                <a
                  href={buildTesterIntentUrl(code)}
                  className={buttonClass("primary", "w-full justify-center text-center")}
                  data-landing-tester-open-app
                >
                  {t.openInApp}
                </a>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-noite px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t.codeLabel}</p>
                    <code
                      ref={codeRef}
                      className="mt-0.5 block font-mono text-lg font-semibold tracking-widest text-luz"
                      data-landing-tester-code
                    >
                      {code}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={buttonClass("ghost", "min-h-10 px-4 py-2 text-sm")}
                    data-landing-tester-copy
                  >
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3" data-landing-tester-steps>
              <a
                href={ANDROID_TESTER_LINKS.group}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("ghost", "w-full text-center sm:text-left justify-start")}
              >
                {testersT.step1}
              </a>
              <a
                href={ANDROID_TESTER_LINKS.optIn}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("ghost", "w-full text-center sm:text-left justify-start")}
              >
                {testersT.step2}
              </a>
              <a
                href={ANDROID_TESTER_LINKS.store}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("ghost", "w-full text-center sm:text-left justify-start")}
              >
                {testersT.step3}
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} page="tester" dict={dict} preserveQuery />
    </div>
  );
}
