import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export, like the other CosmoHQ landings: every locale and legal page
  // is a real HTML file under out/, deployable to any static host.
  output: "export",
  // /privacy/ → out/privacy/index.html, which static hosts resolve without rewrites.
  trailingSlash: true,
  // The default image loader needs a server. Screenshots are pre-sized WebP
  // files in public/store, so there is nothing left to optimise at request time.
  images: { unoptimized: true },
  // The CosmoTV repo holds other lockfiles (dashboard/); pin the root here.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
