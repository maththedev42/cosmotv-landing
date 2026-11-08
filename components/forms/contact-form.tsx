"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { isValidEmail, submitContact, type ContactSource, type SubmitState } from "@/lib/contact-api";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { FormStatus, Honeypot, fieldClass, labelClass } from "./form-parts";

/** The /contact form. `source` stays "contact" unless another page reuses it. */
export function ContactForm({
  locale,
  t,
  source = "contact",
}: {
  locale: Locale;
  t: Dict["forms"];
  source?: ContactSource;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [retryAfter, setRetryAfter] = useState<number | undefined>();
  const pending = state === "pending";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!isValidEmail(email) || !message.trim()) {
      setState("invalid");
      return;
    }
    setState("pending");
    setRetryAfter(undefined);
    const result = await submitContact({
      name,
      email,
      subject: t.contact.subject,
      message,
      locale,
      source,
      website,
    });
    setState(result.state);
    setRetryAfter(result.retryAfter);
    if (result.state === "success") {
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-landing-contact-form className="relative space-y-5">
      <Honeypot label={t.honeypot} value={website} onChange={setWebsite} />
      <div>
        <label htmlFor={`${id}-name`} className={labelClass("light")}>
          {t.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
          className={fieldClass("light")}
        />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={labelClass("light")}>
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
          className={fieldClass("light")}
        />
      </div>
      <div>
        <label htmlFor={`${id}-message`} className={labelClass("light")}>
          {t.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
          className={`${fieldClass("light")} resize-y`}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto")}>
        {pending ? t.sending : t.submit}
      </button>
      <FormStatus
        state={state}
        retryAfter={retryAfter}
        t={t}
        successTitle={t.successTitle}
        successBody={t.successBody}
        tone="light"
      />
    </form>
  );
}
