import type { Metadata } from "next";
import { renderPage, resolveLocale, type LangParams } from "@/components/pages";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "support");
}

export default async function Page({ params }: LangParams) {
  return renderPage(await resolveLocale(params), "support");
}
