import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Document } from "@/components/site/document";
import { rootMetadata, rootViewport } from "@/lib/metadata";
import "../globals.css";

// Root layout for the default locale (English), served without a prefix.
export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default function DefaultLocaleLayout({ children }: { children: ReactNode }) {
  return <Document locale="en">{children}</Document>;
}
