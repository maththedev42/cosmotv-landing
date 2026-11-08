// One submit module for every email-capturing form on the landing: contact,
// launch list, support and account deletion. They all POST to the CosmoTV API
// and differ only by `source` and a fixed localized subject.
//
// The browser never receives BREVO_API_KEY, ImprovMX credentials, provider
// tokens or the private forwarding address: the browser posts to the CosmoTV
// API, which sends through Brevo to contato@mycosmotv.com, and no key ever
// reaches the page.
//
// Local preview: prod CORS doesn't allow localhost, so point
// NEXT_PUBLIC_CONTACT_ENDPOINT at a local backend with CORS_ORIGINS=http://localhost:3000.
//
// Dependency-free on purpose: tests/contact-api.test.ts loads it straight into
// Node without a bundler.

/**
 * The CosmoTV public API endpoint for landing contact forms.
 *
 * Defaults to the production Azure Container App endpoint.
 * `NEXT_PUBLIC_CONTACT_ENDPOINT` overrides it (e.g. for local dev).
 */
export const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  "https://cosmotv-api.thankfulforest-5ed2b125.brazilsouth.azurecontainerapps.io/v1/public/landing-contact";

export const ANDROID_TESTERS_ENDPOINT =
  process.env.NEXT_PUBLIC_ANDROID_TESTERS_ENDPOINT ||
  CONTACT_ENDPOINT.replace(/\/landing-contact$/, "/android-testers");

/** Stable identifiers of the form a submission came from. */
export type ContactSource = "contact" | "waitlist" | "support" | "delete-account";

export type SubmitState =
  | "idle"
  | "pending"
  | "success"
  | "invalid"
  | "rate-limited"
  | "provider-down"
  | "error";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  source: ContactSource;
  /** Honeypot value. Must arrive empty; filled means bot. */
  website: string;
}

export interface SubmitOptions {
  timeoutMs?: number;
}

export interface SubmitResult {
  state: Exclude<SubmitState, "idle" | "pending">;
  /** Seconds suggested by Retry-After, when the server sends it. */
  retryAfter?: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) return Math.ceil(seconds);
  const date = Date.parse(value);
  if (!Number.isNaN(date)) {
    const diff = Math.ceil((date - Date.now()) / 1000);
    if (diff > 0) return diff;
  }
  return undefined;
}

const DEFAULT_TIMEOUT_MS = 25_000;

/**
 * Submits a form. Never throws: every failure becomes a state the UI knows how
 * to render, and no response body or provider secret ever reaches the page.
 */
export async function submitContact(
  payload: ContactPayload,
  fetchImpl: typeof fetch = fetch,
  options?: SubmitOptions,
): Promise<SubmitResult> {
  // Filled honeypot: pretend success and spend no request.
  if (payload.website.trim() !== "") return { state: "success" };

  if (!isValidEmail(payload.email) || !payload.message.trim()) {
    return { state: "invalid" };
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let res: Response;
  try {
    res = await fetchImpl(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        subject: payload.subject,
        message: payload.message,
        locale: payload.locale,
        source: payload.source,
        website: payload.website,
      }),
    });
  } catch {
    // Network down, DNS, CORS, offline, timeout / abort.
    return { state: "error" };
  } finally {
    clearTimeout(timer);
  }

  if (res.ok) return { state: "success" };

  if (res.status === 429) {
    return { state: "rate-limited", retryAfter: parseRetryAfter(res.headers.get("Retry-After")) };
  }
  if (res.status === 400 || res.status === 422) return { state: "invalid" };
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return { state: "provider-down" };
  }
  return { state: "error" };
}

export interface AndroidTesterLinks {
  group: string;
  optIn: string;
  store: string;
}

export const ANDROID_TESTER_LINKS: AndroidTesterLinks = {
  group: "https://groups.google.com/g/cosmotv-testers",
  optIn: "https://play.google.com/apps/testing/com.cosmohq.cosmotv",
  store: "https://play.google.com/store/apps/details?id=com.cosmohq.cosmotv",
};

export function normalizeTesterCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function buildTesterIntentUrl(
  rawCode: string,
  fallbackUrl: string = ANDROID_TESTER_LINKS.optIn,
): string {
  const code = encodeURIComponent(normalizeTesterCode(rawCode));
  const fallback = encodeURIComponent(fallbackUrl);
  return `intent://tester?code=${code}#Intent;scheme=com.cosmohq.cosmotv;package=com.cosmohq.cosmotv;S.browser_fallback_url=${fallback};end`;
}

export interface AndroidTesterPayload {
  email: string;
  locale: string;
  /** Honeypot value. Must arrive empty; filled means bot. */
  website: string;
}

export interface AndroidTesterSubmitResult {
  state: Exclude<SubmitState, "idle" | "pending">;
  links?: AndroidTesterLinks;
  /** Seconds suggested by Retry-After, when the server sends it. */
  retryAfter?: number;
}

/**
 * Submits an Android closed tester signup.
 * On 202, returns `{ state: "success", links: { group, optIn, store } }`.
 */
export async function submitAndroidTester(
  payload: AndroidTesterPayload,
  fetchImpl: typeof fetch = fetch,
  options?: SubmitOptions,
): Promise<AndroidTesterSubmitResult> {
  // Filled honeypot: pretend success and spend no request.
  if (payload.website.trim() !== "") return { state: "success" };

  if (!isValidEmail(payload.email)) {
    return { state: "invalid" };
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let res: Response;
  try {
    res = await fetchImpl(ANDROID_TESTERS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        email: payload.email.trim(),
        locale: payload.locale,
        website: payload.website,
      }),
    });
  } catch {
    // Network down, DNS, CORS, offline, timeout / abort.
    return { state: "error" };
  } finally {
    clearTimeout(timer);
  }

  if (res.ok) {
    try {
      const data = await res.json();
      return {
        state: "success",
        links: data?.links,
      };
    } catch {
      return { state: "success" };
    }
  }

  if (res.status === 429) {
    return { state: "rate-limited", retryAfter: parseRetryAfter(res.headers.get("Retry-After")) };
  }
  if (res.status === 400 || res.status === 422) return { state: "invalid" };
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return { state: "provider-down" };
  }
  return { state: "error" };
}

