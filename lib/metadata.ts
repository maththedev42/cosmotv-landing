import type { Metadata, Viewport } from "next";
import { getDict, localePath, locales, ogLocale, type Locale, type PageKey } from "./i18n";
import { APP_NAME, SITE_URL } from "./landing-data";

export const legalKey = {
  privacy: "privacy",
  terms: "terms",
  support: "support",
  contact: "contact",
  "delete-account": "deleteAccount",
} as const;

export type LegalPage = keyof typeof legalKey;

/** Shared by both root layouts. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  icons: {
    icon: [{ url: "/brand/icon-512.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const rootViewport: Viewport = {
  themeColor: "#15152a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Static 1200×630 share card, committed under public/ (og.png, pt-BR/og.png, es/og.png). */
export function ogImagePath(locale: Locale): string {
  return locale === "en" ? "/og.png" : `/${locale}/og.png`;
}

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const dict = getDict(locale);
  const isTester = page === "tester";
  const legal = page === "" || isTester ? null : dict.legal[legalKey[page]];
  const title = isTester
    ? `${dict.testerPage.title} — ${APP_NAME}`
    : legal
      ? `${legal.title} — ${APP_NAME}`
      : dict.meta.title;
  const description = isTester
    ? dict.testerPage.body
    : legal
      ? legal.description
      : dict.meta.description;
  const canonical = localePath(locale, page);

  const languages: Record<string, string> = { "x-default": localePath("en", page) };
  for (const l of locales) languages[l] = localePath(l, page);

  const image = {
    url: ogImagePath(locale),
    width: 1200,
    height: 630,
    alt: `${APP_NAME} — ${dict.meta.ogTagline}`,
  };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages },
    ...(isTester ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      siteName: APP_NAME,
      title,
      description,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
