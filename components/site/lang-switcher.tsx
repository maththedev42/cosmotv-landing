"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { localeName, localePath, locales, localeShortLabel, type Locale, type PageKey } from "@/lib/locales";

/**
 * Plain links to the same page in every locale. No redirect, no detection:
 * each locale is a crawlable URL the visitor picks.
 */
export function LangSwitcher({
  locale,
  page,
  label,
  className,
  tone = "dark",
  preserveQuery = false,
}: {
  locale: Locale;
  page: PageKey;
  label: string;
  className?: string;
  tone?: "dark" | "light";
  preserveQuery?: boolean;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (preserveQuery && window.location.search) {
      setQuery(window.location.search);
    }
  }, [preserveQuery]);

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      {locales.map((l) => {
        const current = l === locale;
        return (
          <a
            key={l}
            href={`${localePath(l, page)}${preserveQuery ? query : ""}`}
            hrefLang={l}
            lang={l}
            aria-current={current ? "page" : undefined}
            title={localeName[l]}
            className={cn(
              "ep-code inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 text-xs transition-colors",
              current
                ? "bg-orbita text-luz"
                : tone === "dark"
                  ? "text-muted hover:text-luz"
                  : "text-muted-light hover:text-ink",
            )}
          >
            <span aria-hidden="true">{localeShortLabel[l]}</span>
            <span className="sr-only">{localeName[l]}</span>
          </a>
        );
      })}
    </nav>
  );
}
