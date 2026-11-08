import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { resolveLocale, type LangParams } from "@/components/pages";
import { Document } from "@/components/site/document";
import { routedLocales } from "@/lib/i18n";
import { rootMetadata, rootViewport } from "@/lib/metadata";
import "../globals.css";

// Root layout for /pt-BR, /es and /en. Its own <html lang> comes from the
// segment, so every locale is correct in the server HTML, not after hydration.
export const dynamicParams = false;
export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export function generateStaticParams() {
  return routedLocales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: LangParams & { children: ReactNode }) {
  const locale = await resolveLocale(params);
  return <Document locale={locale}>{children}</Document>;
}
