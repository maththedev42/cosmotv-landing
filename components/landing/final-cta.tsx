import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/site/reveal";
import { episodeCode } from "@/lib/episodes";
import { localePath, type Dict, type Locale } from "@/lib/i18n";
import { Eyebrow, Section } from "./section";

/** The season finale: the launch list every "notify me" CTA scrolls to. */
export function FinalCta({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.finalCta;

  return (
    <Section id="launch" data-landing-section="final-cta" tone="violet">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-[-40%] size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(21,21,42,0.45),transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:py-32">
        <Reveal>
          <Eyebrow code={episodeCode("finalCta")} tone="violet">
            {t.eyebrow}
          </Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,7vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance">
            {t.title}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-luz">{t.body}</p>
        </Reveal>

        <Reveal delay={90}>
          <div className="rounded-[1.75rem] bg-noite/25 p-6 ring-1 ring-luz/20 sm:p-8">
            <LeadForm locale={locale} t={dict.forms} />
            <p className="mt-5 text-sm text-luz">
              {t.privacyNote}{" "}
              <a href={localePath(locale, "privacy")} className="font-semibold underline underline-offset-4">
                {t.privacyLink}
              </a>
            </p>
            <p className="mt-4 border-t border-luz/15 pt-4 text-sm text-luz">
              <a href="#android-testers" className="font-semibold underline underline-offset-4">
                {dict.androidTesters.heroLink} →
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
