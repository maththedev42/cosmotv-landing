import { Plus } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { DeleteAccountForm } from "@/components/forms/delete-account-form";
import { ButtonLink } from "@/components/ui/button";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/landing-data";
import { LegalShell, ProseSection } from "./legal-shell";

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-orbita underline underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  );
}

export function SupportPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.legal.support;
  const [before, after] = t.helpBody.split("{email}");

  return (
    <LegalShell locale={locale} page="support" title={t.title} intro={t.intro}>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{t.faqTitle}</h2>
      <div className="mt-6 border-t border-line-light">
        {t.faq.map((item) => (
          <details key={item.q} className="group border-b border-line-light">
            <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 font-display text-lg font-semibold tracking-tight">
              {item.q}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-nebulosa text-orbita transition-transform group-open:rotate-45">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="pb-6 pr-12 text-base leading-relaxed text-ink/85">{item.a}</p>
          </details>
        ))}
      </div>

      <section className="mt-14 rounded-[1.5rem] bg-noite p-7 text-luz sm:p-9">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t.helpTitle}</h2>
        <p className="mt-3 text-base leading-relaxed text-luz/85">
          {before}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-orbita-soft underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          {after}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, "contact")}>{t.contactCta}</ButtonLink>
          <ButtonLink href={localePath(locale, "delete-account")} variant="ghost">
            {t.deleteCta}
          </ButtonLink>
        </div>
      </section>
    </LegalShell>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.legal.contact;

  return (
    <LegalShell locale={locale} page="contact" title={t.title} intro={t.intro}>
      <div className="grid gap-6">
        <section className="rounded-[1.5rem] border border-line-light bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t.formTitle}</h2>
          <div className="mt-6">
            <ContactForm locale={locale} t={dict.forms} />
          </div>
        </section>
        <section className="rounded-[1.5rem] bg-nebulosa p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold tracking-tight">{t.emailTitle}</h2>
          <p className="mt-2 text-base leading-relaxed text-ink/85">
            {t.emailBody} <EmailLink />
          </p>
        </section>
      </div>
    </LegalShell>
  );
}

export function DeleteAccountPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.legal.deleteAccount;

  return (
    <LegalShell locale={locale} page="delete-account" title={t.title} intro={t.intro}>
      {/* The form comes first so it is immediately discoverable; the details follow. */}
      <section className="rounded-[1.5rem] border border-line-light bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t.formTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-light">{t.tip}</p>
        <div className="mt-6">
          <DeleteAccountForm locale={locale} t={dict.forms} />
        </div>
      </section>

      <div className="mt-6">
        <ProseSection title={t.whatTitle}>
          <ul className="list-disc space-y-2 pl-5 marker:text-orbita">
            {t.what.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ProseSection>
        <ProseSection title={t.keepTitle}>
          <ul className="list-disc space-y-2 pl-5 marker:text-orbita">
            {t.keep.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ProseSection>
        <ProseSection title={t.timeTitle}>
          <p>{t.timeBody}</p>
          <p>
            {dict.forms.fallbackLabel} <EmailLink />
          </p>
        </ProseSection>
      </div>
    </LegalShell>
  );
}
