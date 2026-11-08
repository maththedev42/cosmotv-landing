"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import {
  ANDROID_TESTER_LINKS,
  isValidEmail,
  submitAndroidTester,
  type AndroidTesterLinks,
  type SubmitState,
} from "@/lib/contact-api";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { FormStatus, Honeypot, fieldClass, labelClass } from "./form-parts";

export function TesterForm({
  locale,
  t,
  formsT,
}: {
  locale: Locale;
  t: Dict["androidTesters"];
  formsT: Dict["forms"];
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [links, setLinks] = useState<AndroidTesterLinks | undefined>();
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
    const result = await submitAndroidTester({
      email,
      locale,
      website,
    });
    setState(result.state);
    setRetryAfter(result.retryAfter);
    if (result.state === "success") {
      setLinks(result.links || ANDROID_TESTER_LINKS);
      setEmail("");
    }
  }

  if (state === "success" && links) {
    return (
      <div className="space-y-5" data-landing-tester-success>
        <div className="flex flex-col gap-3">
          <a
            href={links.group}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "w-full text-center sm:text-left justify-start")}
          >
            {t.step1}
          </a>
          <a
            href={links.optIn}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "w-full text-center sm:text-left justify-start")}
          >
            {t.step2}
          </a>
          <a
            href={links.store}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "w-full text-center sm:text-left justify-start")}
          >
            {t.step3}
          </a>
        </div>
        <p className="text-sm leading-relaxed text-luz/90">
          {t.successNote}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-landing-tester-form className="relative space-y-4">
      <Honeypot label={formsT.honeypot} value={website} onChange={setWebsite} />
      <div>
        <label htmlFor={`${id}-email`} className={labelClass("violet")}>
          {formsT.email}
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
      <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto")}>
        {pending ? formsT.sending : t.submit}
      </button>
      <p className="text-xs text-luz/70">
        {t.privacyNote}
      </p>
      <FormStatus
        state={state}
        retryAfter={retryAfter}
        t={formsT}
        successTitle=""
        successBody=""
        tone="violet"
      />
    </form>
  );
}
