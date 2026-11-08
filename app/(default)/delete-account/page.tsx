import type { Metadata } from "next";
import { renderPage } from "@/components/pages";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata("en", "delete-account");
}

export default function Page() {
  return renderPage("en", "delete-account");
}
