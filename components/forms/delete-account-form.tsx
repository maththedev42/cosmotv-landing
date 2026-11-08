"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { isValidEmail, submitContact, type SubmitState } from "@/lib/contact-api";
import type { Dict } from "@/lib/i18n";
import { fill, type Locale } from "@/lib/locales";
import { FormStatus, Honeypot, fieldClass, labelClass } from "./form-parts";

/**
 * Account deletion request (App Store / Google Play requirement). Same hosted
 * endpoint as every other form, source "delete-account", fixed subject. It will
 * not submit until the irreversible-deletion checkbox is ticked.
 */
export function DeleteAccountForm({ locale, t }: { locale: Locale; t: Dict["forms"] }) {
  const id = useId();
  const d = t.deleteAccount;
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [retryAfter, setRetryAfter] = useState<number | undefined>();
  const pending = state === "pending";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!confirmed) {
      setConfirmError(true);
      setState("idle");
      return;
    }
    if (!isValidEmail(email)) {
      setState("invalid");
      return;
    }
    setConfirmError(false);
    setState("pending");
    setRetryAfter(undefined);
    const result = await submitContact({
      name: "",
      email,
      subject: d.subject,
      message: fill(d.messageTemplate, { email: email.trim(), reason: reason.trim() || d.noReason }),
      locale,
      source: "delete-account",
      website,
    });
    setState(result.state);
    setRetryAfter(result.retryAfter);
    if (result.state === "success") {
      setEmail("");
      setReason("");
      setConfirmed(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-landing-delete-account-form className="relative space-y-5">
      <Honeypot label={t.honeypot} value={website} onChange={setWebsite} />
      <div>
        <label htmlFor={`${id}-email`} className={labelClass("light")}>
          {d.accountEmail}
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
        <label htmlFor={`${id}-reason`} className={labelClass("light")}>
          {d.reason}
        </label>
        <textarea
          id={`${id}-reason`}
          name="reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={pending}
          className={`${fieldClass("light")} resize-y`}
        />
      </div>
      <div>
        <label htmlFor={`${id}-confirm`} className="flex cursor-pointer items-start gap-3 text-base leading-snug text-ink">
          <input
            id={`${id}-confirm`}
            name="confirm"
            type="checkbox"
            required
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              if (e.target.checked) setConfirmError(false);
            }}
            disabled={pending}
            aria-invalid={confirmError}
            aria-describedby={confirmError ? `${id}-confirm-error` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-orbita"
          />
          {d.confirm}
        </label>
        {confirmError && (
          <p id={`${id}-confirm-error`} role="alert" className="mt-2 text-sm font-medium text-[#c2410c]">
            {d.confirmRequired}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto")}>
        {pending ? t.sending : d.submit}
      </button>
      <FormStatus
        state={state}
        retryAfter={retryAfter}
        t={t}
        successTitle={d.successTitle}
        successBody={d.successBody}
        tone="light"
      />
    </form>
  );
}
