import { Plus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { episodeCode } from "@/lib/episodes";
import { fill, localePath, type Dict, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, priceValues } from "@/lib/landing-data";
import { Eyebrow, Section, SectionTitle } from "./section";

// The "take my data with me" answer ends with a link to the deletion form.
const DATA_ANSWER_INDEX = 4;

/** Native <details> accordion: works before hydration and without JavaScript. */
export function Faq({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.faq;
  const values = { ...priceValues(locale), email: CONTACT_EMAIL };

  return (
    <Section id="faq" data-landing-section="faq" tone="light">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-32">
        <Reveal>
          <Eyebrow code={episodeCode("faq")} tone="light">
            {t.eyebrow}
          </Eyebrow>
          <SectionTitle className="mt-6">{t.title}</SectionTitle>
        </Reveal>

        <div className="border-t border-line-light">
          {t.items.map((item, i) => (
            <details key={item.q} className="group border-b border-line-light" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 font-display text-xl font-semibold tracking-tight">
                {item.q}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-nebulosa text-orbita transition-transform duration-200 group-open:rotate-45">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="pb-6 pr-12 text-base leading-relaxed text-muted-light">
                <p>{fill(item.a, values)}</p>
                {i === DATA_ANSWER_INDEX && (
                  <a
                    href={localePath(locale, "delete-account")}
                    className="mt-3 inline-flex min-h-11 items-center font-semibold text-orbita underline-offset-4 hover:underline"
                  >
                    {t.deleteLink} →
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
