import { Check, Globe, Smartphone, Tablet, TabletSmartphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { episodeCode } from "@/lib/episodes";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { PLATFORMS, priceValues, type PlatformId } from "@/lib/landing-data";
import { Eyebrow, Section, SectionTitle } from "./section";

const platformIcons: Record<PlatformId, LucideIcon> = {
  iphone: Smartphone,
  ipad: Tablet,
  android: TabletSmartphone,
  web: Globe,
};

/**
 * Conversion episode: the free tier and CosmoTV Pro side by side, with BOTH
 * configured prices always printed, then where the app premieres. Nothing has
 * launched, so there are "Coming soon" pills and a launch-list link instead of
 * store badges.
 */
export function Pricing({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.pricing;
  const price = priceValues(locale);

  return (
    <Section id="pricing" data-landing-section="conversion" tone="dark">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <Reveal className="max-w-3xl">
          <Eyebrow code={episodeCode("conversion")}>{t.eyebrow}</Eyebrow>
          <SectionTitle className="mt-6">{t.title}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-luz/80">{t.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-noite-2 p-7 sm:p-9">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{t.free.name}</h3>
              <p className="mt-1 text-base text-muted">{t.free.tagline}</p>
              <p className="mt-8 font-display text-5xl font-semibold tracking-tight">{t.free.price}</p>
              <ul className="mt-8 space-y-3.5">
                {t.free.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-snug text-luz/85">
                    <Check className="mt-0.5 size-5 shrink-0 text-proximo" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={90}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-orbita p-7 text-luz sm:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(247,247,252,0.22),transparent)]"
              />
              <h3 className="font-display text-2xl font-semibold tracking-tight">{t.pro.name}</h3>
              <p className="mt-1 text-base text-luz">{t.pro.tagline}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-luz/25 p-5">
                  <p className="text-sm font-medium text-luz">{t.pro.monthly}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-display text-4xl font-semibold tracking-tight">{price.monthly}</span>
                    <span className="text-sm text-luz">{t.pro.perMonth}</span>
                  </p>
                </div>
                <div className="relative rounded-2xl bg-luz p-5 text-ink">
                  <p className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-muted-light">
                    {t.pro.yearly}
                    <span className="rounded-full bg-estreia px-2 py-0.5 text-xs font-semibold text-ink">
                      {t.pro.bestValue}
                    </span>
                  </p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-display text-4xl font-semibold tracking-tight">{price.yearly}</span>
                    <span className="text-sm text-muted-light">{t.pro.perYear}</span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-orbita">
                    {fill(t.pro.save, { percent: price.percent })}
                    <span className="font-normal text-muted-light"> · {fill(t.pro.equivalent, { price: price.yearlyPerMonth })}</span>
                  </p>
                </div>
              </div>

              <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {t.pro.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-snug">
                    <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-9">
                <ButtonLink href="#launch" variant="inverse" className="w-full sm:w-auto">
                  {t.pro.cta}
                </ButtonLink>
                <p className="mt-4 text-sm leading-relaxed text-luz">{t.pro.note}</p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal className="mt-5">
          <div className="grid gap-6 rounded-[1.75rem] border border-line p-7 sm:p-9 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{t.platforms.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{t.platforms.body}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PLATFORMS.map((platform) => {
                const Icon = platformIcons[platform.id];
                return (
                  <li
                    key={platform.id}
                    className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-noite-2 px-4 py-3"
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <Icon className="size-5 text-orbita-soft" aria-hidden="true" />
                      {t.platforms.items[platform.id]}
                    </span>
                    {/* No store URL exists yet: a pill, never a fake download badge. */}
                    <a
                      href="#launch"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-estreia/15 px-3 text-xs font-semibold text-estreia hover:bg-estreia/25"
                    >
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-estreia" />
                      {t.platforms.soon}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
