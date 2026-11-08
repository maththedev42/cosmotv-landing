import { TesterForm } from "@/components/forms/tester-form";
import { Reveal } from "@/components/site/reveal";
import type { Dict, Locale } from "@/lib/i18n";
import { Eyebrow, Section, SectionTitle } from "./section";

export function AndroidTesters({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.androidTesters;

  return (
    <Section id="android-testers" data-landing-section="android-testers" tone="raised">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-32">
        <Reveal>
          <Eyebrow code={t.eyebrow} tone="raised" />
          <SectionTitle className="mt-6">{t.title}</SectionTitle>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-luz/80">{t.body}</p>
        </Reveal>

        <Reveal delay={90}>
          <div className="rounded-[1.75rem] border border-line bg-noite p-6 sm:p-8">
            <TesterForm locale={locale} t={t} formsT={dict.forms} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
