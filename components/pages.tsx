import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { ContactPage, DeleteAccountPage, SupportPage } from "@/components/legal/help-pages";
import { LegalDocument } from "@/components/legal/legal-document";
import { TesterLinkPage } from "@/components/tester/tester-link-page";
import { getDict, isLocale, type Locale, type PageKey } from "@/lib/i18n";

/** One renderer for every route, so `/x` and `/<lang>/x` can never drift apart. */
export function renderPage(locale: Locale, page: PageKey) {
  switch (page) {
    case "":
      return <LandingPage locale={locale} />;
    case "privacy":
      return <LegalDocument locale={locale} kind="privacy" />;
    case "terms":
      return <LegalDocument locale={locale} kind="terms" />;
    case "support":
      return <SupportPage locale={locale} />;
    case "contact":
      return <ContactPage locale={locale} />;
    case "delete-account":
      return <DeleteAccountPage locale={locale} />;
    case "tester":
      return <TesterLinkPage locale={locale} dict={getDict(locale)} />;
  }
}

export type LangParams = { params: Promise<{ lang: string }> };

export async function resolveLocale(params: LangParams["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
