import type { CSSProperties } from "react";
import { ArrowDown, Check, Layers, SunMoon, UserX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { episodeCode } from "@/lib/episodes";
import type { Dict, Locale } from "@/lib/i18n";
import { getShot } from "@/lib/screenshots";
import { Eyebrow, Section } from "./section";
import { ShotImage } from "./shot";

/** Splits "Your story *continues* here." into plain and emphasised parts. */
function emphasise(title: string) {
  return title.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") ? (
      <span key={i} className="relative inline-block whitespace-nowrap">
        {part.slice(1, -1)}
        {/* The "watched" progress bar under the word — Verde Próximo marks progress. */}
        <span
          aria-hidden="true"
          className="hero-underline absolute inset-x-0 -bottom-1 h-[0.12em] origin-left rounded-full bg-proximo"
        />
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const calloutIcons = [Layers, Check, SunMoon, UserX] as const;

// Positions around the lead iPhone frame. The fourth chip only appears from sm.
const calloutPlacement = [
  "flex left-0 top-[14%] sm:-left-4 lg:-left-10",
  "flex right-0 top-[40%] sm:-right-2 lg:right-[34%]",
  "flex left-0 bottom-[22%] sm:-left-6 lg:-left-14",
  "hidden sm:flex right-0 bottom-[8%] lg:right-[30%]",
] as const;

export function Hero({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.hero;
  const phone = getShot(locale, "iphone", "home");
  const tablet = getShot(locale, "ipad", "home");
  const platforms = Object.values(dict.pricing.platforms.items);

  return (
    <Section id="top" data-landing-section="hero" tone="dark">
      {/* Screen glow: the room light of a TV left on, in Violeta Órbita. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[640px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgba(103,87,232,0.45),rgba(103,87,232,0.12)_55%,transparent)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line to-transparent"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-6 lg:pb-28 lg:pt-16">
        <div className="max-w-xl">
          <div className="hero-rise">
            <Eyebrow code={episodeCode("hero")}>{t.eyebrow}</Eyebrow>
          </div>
          <h1 className="hero-rise mt-6 font-display text-[clamp(2.75rem,11vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance [--rise-delay:80ms]">
            {emphasise(t.title)}
          </h1>
          <p className="hero-rise mt-7 max-w-lg text-lg leading-relaxed text-luz/80 [--rise-delay:160ms]">
            {t.subtitle}
          </p>

          <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row [--rise-delay:240ms]">
            <ButtonLink href="#launch" className="w-full sm:w-auto">
              {t.primaryCta}
            </ButtonLink>
            <ButtonLink href="#product" variant="ghost" className="w-full sm:w-auto">
              {t.secondaryCta}
              <ArrowDown className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <p className="hero-rise mt-4 text-sm text-muted [--rise-delay:280ms]">
            <a
              href="#android-testers"
              className="text-muted transition-colors hover:text-luz underline underline-offset-4"
            >
              {dict.androidTesters.heroLink} →
            </a>
          </p>

          <p className="hero-rise mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted [--rise-delay:320ms]">
            <span className="inline-flex items-center gap-2 rounded-full bg-estreia/15 px-2.5 py-1 font-medium text-estreia">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-estreia" />
              {t.availability}
            </span>
            <span>{platforms.join(" · ")}</span>
          </p>
        </div>

        {/* Lead product visual: real localized store frames, shown whole. */}
        <div className="relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-none">
          <div className="hidden lg:absolute lg:right-0 lg:top-4 lg:block lg:w-[72%] lg:rotate-[3deg]">
            <ShotImage
              shot={tablet}
              alt={dict.shots.ipad.home.alt}
              sizes="(min-width: 1024px) 400px, 0px"
              className="opacity-90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="hero-drift relative mx-auto w-[64%] max-w-[17.5rem] sm:w-[58%] lg:mx-0 lg:ml-[6%] lg:mt-24 lg:w-[46%]">
            <ShotImage
              shot={phone}
              alt={dict.shots.iphone.home.alt}
              sizes="(min-width: 1024px) 250px, (min-width: 640px) 280px, 64vw"
              preload
              className="shadow-[0_40px_90px_-30px_rgba(103,87,232,0.75)]"
            />
          </div>

          {t.callouts.map((label, i) => {
            const Icon = calloutIcons[i] ?? Check;
            return (
              <span
                key={label}
                data-landing-callout
                className={cn(
                  "hero-rise pointer-events-none absolute z-10 max-w-[11.5rem] items-center gap-2 rounded-full border border-white/10 bg-noite/90 px-3 py-2 text-xs font-medium leading-tight text-luz shadow-lg backdrop-blur sm:max-w-none sm:text-sm",
                  calloutPlacement[i],
                )}
                style={{ "--rise-delay": `${420 + i * 110}ms` } as CSSProperties}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-proximo/15 text-proximo">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
