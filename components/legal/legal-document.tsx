import { fill, getDict, localePath, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, priceValues } from "@/lib/landing-data";
import { LegalShell, ProseSection } from "./legal-shell";

// In the privacy policy, the "Your rights" section links to the deletion form.
const PRIVACY_RIGHTS_INDEX = 5;

/** Privacy policy and terms of use: localized sections from the message files. */
export function LegalDocument({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" }) {
  const dict = getDict(locale);
  const doc = dict.legal[kind];
  const values = { ...priceValues(locale), email: CONTACT_EMAIL };

  return (
    <LegalShell locale={locale} page={kind} title={doc.title} intro={doc.intro} showUpdated>
      {doc.sections.map((section, i) => (
        <ProseSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{fill(paragraph, values)}</p>
          ))}
          {section.list.length > 0 && (
            <ul className="list-disc space-y-2 pl-5 marker:text-orbita">
              {section.list.map((item) => (
                <li key={item}>{fill(item, values)}</li>
              ))}
            </ul>
          )}
          {kind === "privacy" && i === PRIVACY_RIGHTS_INDEX && (
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={localePath(locale, "delete-account")}
                className="inline-flex min-h-11 items-center font-semibold text-orbita underline underline-offset-4"
              >
                {dict.footer.links.deleteAccount} →
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center font-semibold text-orbita underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          )}
        </ProseSection>
      ))}
    </LegalShell>
  );
}
