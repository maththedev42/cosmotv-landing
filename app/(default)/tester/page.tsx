import type { Metadata } from "next";
import { TesterLinkPageAuto } from "@/components/tester/tester-link-page";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata("en", "tester");
}

export default function Page() {
  return <TesterLinkPageAuto />;
}
