import { Bell, Compass, Film, ListChecks, Search, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { episodeCode } from "@/lib/episodes";
import type { Dict } from "@/lib/i18n";
import { EpisodeToy } from "./episode-toy";
import { Eyebrow, Section, SectionTitle } from "./section";

const icons: Record<string, LucideIcon> = {
  film: Film,
  lists: ListChecks,
  compass: Compass,
  bell: Bell,
  search: Search,
};

export function Features({ dict }: { dict: Dict }) {
  const t = dict.features;

  return (
    <Section id="features" data-landing-section="features" tone="light">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <Reveal className="max-w-3xl">
          <Eyebrow code={episodeCode("features")} tone="light">
            {t.eyebrow}
          </Eyebrow>
          <SectionTitle className="mt-6">{t.title}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-light">{t.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
          {/* The core loop gets the big tile — and it is the one you can touch. */}
          <Reveal className="sm:col-span-2 lg:row-span-2">
            <article className="h-full rounded-[1.5rem] bg-noite p-6 text-luz sm:p-8">
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.queue.title}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-luz/75">{t.queue.text}</p>
              <EpisodeToy t={t.toy} />
            </article>
          </Reveal>

          {t.items.map((item, i) => {
            const Icon = icons[item.icon] ?? Film;
            return (
              <Reveal
                key={item.title}
                delay={(i % 3) * 80}
                // Five small tiles leave one alone on the 2-column grid: let it span.
                className={i === t.items.length - 1 ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <article className="flex h-full flex-col rounded-[1.5rem] border border-line-light bg-white p-6 shadow-[0_1px_0_rgba(32,32,51,0.04)]">
                  <span className="flex size-11 items-center justify-center rounded-full bg-nebulosa text-orbita">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-light">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
