// Server-side dictionary access. Client components import helpers from
// ./locales and only `import type { Dict }` from here.

import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ptBR from "@/messages/pt-BR.json";
import type { Locale } from "./locales";

export * from "./locales";

export type Dict = typeof en;

// Typed against the English shape: a missing or renamed key in pt-BR or es
// fails the build instead of rendering an empty string.
const dictionaries: Record<Locale, Dict> = { en, "pt-BR": ptBR, es };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}
