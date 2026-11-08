import { Download, HardDrive, Upload } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { episodeCode } from "@/lib/episodes";
import type { Dict, Locale } from "@/lib/i18n";
import { getShot } from "@/lib/screenshots";
import { Eyebrow, Section, SectionTitle } from "./section";
import { ShotImage } from "./shot";

// Bring → keep → take: the order is the actual life of your history in the app.
const pointIcons = [Upload, HardDrive, Download] as const;

export function Value({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.value;
  const shot = getShot(locale, "iphone", "import");

  return (
    <Section id="value" data-landing-section="value" tone="raised">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-32">
        <Reveal className="order-2 lg:order-1">
          <figure className="mx-auto w-[70%] max-w-[18rem] sm:w-[52%] lg:w-[74%]">
            <ShotImage
              shot={shot}
              alt={dict.shots.iphone.import.alt}
              sizes="(min-width: 1024px) 290px, (min-width: 640px) 280px, 70vw"
              className="shadow-[0_40px_80px_-35px_rgba(0,0,0,0.9)]"
            />
            <figcaption className="mt-5 text-center text-sm leading-relaxed text-muted">
              {dict.shots.iphone.import.caption}
            </figcaption>
          </figure>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow code={episodeCode("value")} tone="raised">
              {t.eyebrow}
            </Eyebrow>
            <SectionTitle className="mt-6">{t.title}</SectionTitle>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-luz/80">{t.body}</p>
          </Reveal>

          <ol className="mt-12 border-t border-line">
            {t.points.map((point, i) => {
              const Icon = pointIcons[i] ?? Upload;
              return (
                <li key={point.title}>
                  <Reveal delay={i * 90} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-b border-line py-6 sm:grid-cols-[3rem_9rem_1fr] sm:items-baseline">
                    <span className="row-span-2 flex size-10 items-center justify-center rounded-full bg-proximo/15 text-proximo sm:row-span-1 sm:self-center">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight">{point.title}</span>
                    <span className="text-base leading-relaxed text-luz/75">{point.text}</span>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
