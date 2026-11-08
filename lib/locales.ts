// Locale constants and path helpers. No dictionary imports here, so client
// components can use this module without shipping every locale's messages.

export const locales = ["en", "pt-BR", "es"] as const;
export type Locale = (typeof locales)[number];

/** Root `/` renders this locale; the others live under `/<locale>/`. */
export const defaultLocale: Locale = "en";

/**
 * Locales served under the `[lang]` segment. `en` is included so `/en/` also
 * resolves, but its canonical URL is the unprefixed root.
 */
export const routedLocales = ["pt-BR", "es", "en"] as const satisfies readonly Locale[];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const htmlLang: Record<Locale, string> = { en: "en", "pt-BR": "pt-BR", es: "es" };
export const intlLocale: Record<Locale, string> = { en: "en-US", "pt-BR": "pt-BR", es: "es-ES" };
export const ogLocale: Record<Locale, string> = { en: "en_US", "pt-BR": "pt_BR", es: "es_ES" };
export const localeShortLabel: Record<Locale, string> = { en: "EN", "pt-BR": "PT", es: "ES" };
export const localeName: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Português (Brasil)",
  es: "Español",
};

export type PageKey = "" | "privacy" | "terms" | "support" | "contact" | "delete-account" | "tester";

/** Public path of a page in a locale, with the trailing slash the static export uses. */
export function localePath(locale: Locale, page: PageKey = "", hash?: string): string {
  const base = locale === defaultLocale ? "" : `/${locale}`;
  const path = page ? `${base}/${page}/` : `${base}/`;
  return hash ? `${path}#${hash}` : path;
}

/** Replaces `{name}` placeholders in a localized string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Maps browser language preferences (`navigator.languages`) to a supported tester page locale. */
export function detectTesterLocale(languages: readonly string[]): Locale {
  for (const raw of languages) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;
    if (tag.startsWith("pt")) return "pt-BR";
    if (tag.startsWith("es")) return "es";
    return "en";
  }
  return "en";
}
