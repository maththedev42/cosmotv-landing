"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { SubmitState } from "@/lib/contact-api";
import type { Dict } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/landing-data";

export type FormTone = "light" | "violet";

export function fieldClass(tone: FormTone): string {
  return cn(
    "w-full min-h-12 rounded-xl border px-4 py-3 text-base outline-none transition-colors disabled:opacity-60",
    tone === "light"
      ? "border-line-light bg-white text-ink placeholder:text-muted-light focus:border-orbita"
      : "border-luz/30 bg-luz/10 text-luz placeholder:text-luz/70 focus:border-luz focus:bg-luz/15",
  );
}

export function labelClass(tone: FormTone): string {
  return cn("mb-1.5 block text-sm font-semibold", tone === "light" ? "text-ink" : "text-luz");
}

/**
 * Honeypot: off-screen, but reachable by bots.
 *
 * Its HTML name must be meaningless. Chrome ignores autocomplete="off" on a
 * form with a name + email pair and autofills the whole address profile —
 * including a field called "website". The honeypot then arrives filled by the
 * browser, the submission is dropped as a bot, the visitor sees success and no
 * email is ever sent. The value still travels as the `website` JSON key; only
 * the HTML name is neutral. The id comes from useId() so two forms on one page
 * never share it.
 */
export function Honeypot({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name="hp_field"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * Localized submit state. Success and pending are announced politely; errors
 * interrupt. No response body or provider detail ever reaches this component.
 */
export function FormStatus({
  state,
  retryAfter,
  t,
  successTitle,
  successBody,
  tone,
}: {
  state: SubmitState;
  retryAfter?: number;
  t: Dict["forms"];
  successTitle: string;
  successBody: string;
  tone: FormTone;
}) {
  if (state === "idle") return null;

  if (state === "pending") {
    return (
      <p role="status" aria-live="polite" className={cn("text-sm", tone === "light" ? "text-muted-light" : "text-luz")}>
        {t.sending}
      </p>
    );
  }

  if (state === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-xl border p-4",
          tone === "light" ? "border-proximo/50 bg-proximo/10 text-ink" : "border-luz/40 bg-noite/30 text-luz",
        )}
      >
        <p className="font-semibold">{successTitle}</p>
        <p className="mt-1 text-sm leading-relaxed">{successBody}</p>
      </div>
    );
  }

  const message =
    state === "invalid"
      ? t.invalid
      : state === "rate-limited"
        ? retryAfter
          ? t.rateLimitedRetry.replace("{seconds}", String(retryAfter))
          : t.rateLimited
        : state === "provider-down"
          ? t.providerDown
          : t.error;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border p-4 text-sm leading-relaxed",
        tone === "light" ? "border-danger/50 bg-danger/10 text-ink" : "border-luz/40 bg-noite/40 text-luz",
      )}
    >
      <p className="font-medium">{message}</p>
      <p className="mt-2">
        {t.fallbackLabel}{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={cn("font-semibold underline underline-offset-2", tone === "light" ? "text-orbita" : "text-luz")}
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}
