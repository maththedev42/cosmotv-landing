import { Reveal } from "@/components/site/reveal";
import { episodeCode } from "@/lib/episodes";
import type { Dict, Locale } from "@/lib/i18n";
import { getShot, TOUR_STORIES, type Device, type Shot, type TourStory } from "@/lib/screenshots";
import { ProductTour } from "./product-tour";
import { Eyebrow, Section, SectionTitle } from "./section";

export function Product({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.product;
  const shots = Object.fromEntries(
    (["iphone", "ipad"] as const).map((device) => [
      device,
      Object.fromEntries(TOUR_STORIES.map((story) => [story, getShot(locale, device, story)])),
    ]),
  ) as Record<Device, Record<TourStory, Shot>>;

  return (
    <Section id="product" data-landing-section="product" tone="dark">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <Reveal className="max-w-2xl">
          <Eyebrow code={episodeCode("product")}>{t.eyebrow}</Eyebrow>
          <SectionTitle className="mt-6">{t.title}</SectionTitle>
          <p className="mt-6 text-lg leading-relaxed text-luz/80">{t.body}</p>
        </Reveal>
        <div className="mt-14">
          <ProductTour t={t} shotText={dict.shots} stories={TOUR_STORIES} shots={shots} />
        </div>
      </div>
    </Section>
  );
}
