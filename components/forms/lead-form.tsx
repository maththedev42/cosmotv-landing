"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { isValidEmail, submitContact, type SubmitState } from "@/lib/contact-api";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { FormStatus, Honeypot, fieldClass, labelClass } from "./form-parts";

/** Launch list ("notify me"): the destination of every pre-launch CTA. */
export function LeadForm({ locale, t }: { locale: Locale; t: Dict["forms"] }) {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [retryAfter, setRetryAfter] = useState<number | undefined>();
  const pending = state === "pending";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!isValidEmail(email)) {
      setState("invalid");
      return;
    }
    setState("pending");
    setRetryAfter(undefined);
    const result = await submitContact({
      name,
      email,
      subject: t.lead.subject,
      message: t.lead.message,
      locale,
      source: "waitlist",
      website,
    });
    setState(result.state);
    setRetryAfter(result.retryAfter);
    if (result.state === "success") {
      setName("");
      setEmail("");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-landing-lead-form className="relative space-y-4">
      <Honeypot label={t.honeypot} value={website} onChange={setWebsite} />
      <div className="grid gap-4 sm:grid-cols-[1fr_1.3fr]">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass("violet")}>
            {t.nameOptional}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={pending}
            className={fieldClass("violet")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass("violet")}>
            {t.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className={fieldClass("violet")}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonClass("inverse", "w-full sm:w-auto")}>
        {pending ? t.sending : t.lead.submit}
      </button>
      <FormStatus
        state={state}
        retryAfter={retryAfter}
        t={t}
        successTitle={t.lead.successTitle}
        successBody={t.lead.successBody}
        tone="violet"
      />
    </form>
  );
}
