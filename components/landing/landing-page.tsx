import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { EPISODES, episodeCode } from "@/lib/episodes";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { APP_NAME, SITE_URL } from "@/lib/landing-data";
import { Faq } from "./faq";
import { Features } from "./features";
import { FinalCta } from "./final-cta";
import { Hero } from "./hero";
import { NextEpisode } from "./next-episode";
import { Pricing } from "./pricing";
import { AndroidTesters } from "./android-testers";
import { Product } from "./product";
import { Value } from "./value";

/**
 * Conversion story, one "episode" per section:
 * promise → your history → day to day → inside the app → pricing → questions → launch list.
 */
export function LandingPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const episodes = EPISODES.map((episode) => ({
    id: episode.id,
    code: episodeCode(episode.key),
    label: dict.episodes[episode.key],
  }));

  // Only facts we know. No rating, no offer, no install count: nothing has launched.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "EntertainmentApplication",
    description: dict.meta.description,
    url: `${SITE_URL}${localePath(locale)}`,
    image: `${SITE_URL}/brand/icon-512.png`,
    inLanguage: locale,
  };

  return (
    <>
      <SiteHeader locale={locale} page="" nav={dict.nav} />
      <main id="main">
        <Hero locale={locale} dict={dict} />
        <Value locale={locale} dict={dict} />
        <Features dict={dict} />
        <Product locale={locale} dict={dict} />
        <Pricing locale={locale} dict={dict} />
        <AndroidTesters locale={locale} dict={dict} />
        <Faq locale={locale} dict={dict} />
        <FinalCta locale={locale} dict={dict} />
      </main>
      <SiteFooter locale={locale} page="" dict={dict} />
      <NextEpisode episodes={episodes} label={dict.episodes.next} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
