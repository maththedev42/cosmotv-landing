import type { MetadataRoute } from "next";
import { localePath, locales, type PageKey } from "@/lib/locales";
import { LEGAL_UPDATED, SITE_URL } from "@/lib/landing-data";

export const dynamic = "force-static";

const PAGES: PageKey[] = ["", "privacy", "terms", "support", "contact", "delete-account"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) => {
    const languages: Record<string, string> = { "x-default": `${SITE_URL}${localePath("en", page)}` };
    for (const l of locales) languages[l] = `${SITE_URL}${localePath(l, page)}`;
    return locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, page)}`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: page === "" ? ("weekly" as const) : ("yearly" as const),
      priority: page === "" ? 1 : 0.4,
      alternates: { languages },
    }));
  });
}
