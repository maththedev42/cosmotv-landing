// Single source of truth for pricing, platforms and public contact data.
// Components never hardcode a price or a store link: they read from here.

import { intlLocale, type Locale } from "./locales";

export const APP_NAME = "CosmoTV";
export const SITE_URL = "https://mycosmotv.com";
export const CONTACT_EMAIL = "contato@mycosmotv.com";

/** Configured in CosmoHQ (source: cosmohq). Amounts are exact; only formatting varies by locale. */
export const PRICING = {
  currency: "BRL",
  monthly: 8.9,
  yearly: 89.9,
} as const;

/** Yearly vs 12 × monthly, rounded down so the claim never overstates the saving. */
export const YEARLY_SAVINGS_PERCENT = Math.floor(
  (1 - PRICING.yearly / (PRICING.monthly * 12)) * 100,
);

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: PRICING.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function priceValues(locale: Locale) {
  return {
    monthly: formatPrice(PRICING.monthly, locale),
    yearly: formatPrice(PRICING.yearly, locale),
    yearlyPerMonth: formatPrice(PRICING.yearly / 12, locale),
    percent: YEARLY_SAVINGS_PERCENT,
  };
}

export type PlatformId = "iphone" | "ipad" | "android" | "web";

/**
 * Detected platforms and their store links. Every URL is empty: nothing has
 * launched yet, so the page renders "Coming soon" pills and the launch list —
 * never a store badge.
 */
export const PLATFORMS: readonly { id: PlatformId; storeUrl: string }[] = [
  { id: "iphone", storeUrl: "" },
  { id: "ipad", storeUrl: "" },
  { id: "android", storeUrl: "" },
  { id: "web", storeUrl: "" },
];

export const LEGAL_UPDATED = "2026-09-21";
