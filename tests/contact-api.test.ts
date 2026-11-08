// Tests for the landing's form submission helper.
// Runs directly on Node (native type stripping), no bundler:
//   pnpm test
//
// fetch is injected, so no real request ever leaves this suite.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  submitContact,
  CONTACT_ENDPOINT,
  isValidEmail,
  type ContactPayload,
} from "../lib/contact-api.ts";

const payload: ContactPayload = {
  name: "Jane Viewer",
  email: "jane@example.com",
  subject: "Contact from the landing — CosmoTV",
  message: "I'd like to know when the app launches.",
  locale: "en",
  source: "waitlist",
  website: "",
};

/** Fake fetch that returns the requested response and records the call it received. */
function mockFetch(response: Response) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return response;
  };
  return { impl: impl as unknown as typeof fetch, calls };
}

test("success: POSTs to the endpoint with the public fields", async () => {
  const { impl, calls } = mockFetch(new Response("", { status: 200 }));

  const result = await submitContact(payload, impl);

  assert.equal(result.state, "success");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, CONTACT_ENDPOINT);
  assert.equal(calls[0].init?.method, "POST");

  const body = JSON.parse(String(calls[0].init?.body));
  assert.deepEqual(Object.keys(body).sort(), [
    "email",
    "locale",
    "message",
    "name",
    "source",
    "subject",
    "website",
  ]);
  assert.equal(body.email, "jane@example.com");
  assert.equal(body.source, "waitlist");
  assert.equal(body.website, "");
});

test("success: 202 Accepted returns success", async () => {
  const { impl, calls } = mockFetch(new Response(JSON.stringify({ ok: true }), { status: 202 }));

  const result = await submitContact(payload, impl);

  assert.equal(result.state, "success");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, CONTACT_ENDPOINT);
});

test("success: preserves empty name in request body", async () => {
  const { impl, calls } = mockFetch(new Response(JSON.stringify({ ok: true }), { status: 202 }));

  const result = await submitContact({ ...payload, name: "" }, impl);

  assert.equal(result.state, "success");
  const body = JSON.parse(String(calls[0].init?.body));
  assert.equal(body.name, "");
  assert.equal(body.email, "jane@example.com");
});

test("success: also works for the delete-account source", async () => {
  const { impl, calls } = mockFetch(new Response("", { status: 200 }));

  const result = await submitContact({ ...payload, source: "delete-account" }, impl);

  assert.equal(result.state, "success");
  const body = JSON.parse(String(calls[0].init?.body));
  assert.equal(body.source, "delete-account");
});

test("timeout: a fetch that never resolves returns error after timeoutMs", async () => {
  const neverResolvingFetch = ((_url: string | URL | Request, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      if (init?.signal) {
        init.signal.addEventListener("abort", () => {
          reject(new DOMException("This operation was aborted", "AbortError"));
        });
      }
    });
  }) as unknown as typeof fetch;

  const start = Date.now();
  const result = await submitContact(payload, neverResolvingFetch, { timeoutMs: 50 });
  const elapsed = Date.now() - start;

  assert.equal(result.state, "error");
  assert.ok(elapsed >= 35, `expected at least ~35ms, got ${elapsed}ms`);
  assert.ok(elapsed < 1000, `expected less than 1s, got ${elapsed}ms`);
});

test("429: becomes rate-limited and honours Retry-After in seconds", async () => {
  const { impl } = mockFetch(new Response("", { status: 429, headers: { "Retry-After": "45" } }));

  const result = await submitContact(payload, impl);

  assert.equal(result.state, "rate-limited");
  assert.equal(result.retryAfter, 45);
});

test("429 without Retry-After: still rate-limited, no seconds", async () => {
  const { impl } = mockFetch(new Response("", { status: 429 }));

  const result = await submitContact(payload, impl);

  assert.equal(result.state, "rate-limited");
  assert.equal(result.retryAfter, undefined);
});

test("503: becomes provider-down", async () => {
  const { impl } = mockFetch(new Response("", { status: 503 }));
  assert.equal((await submitContact(payload, impl)).state, "provider-down");
});

test("422: becomes invalid", async () => {
  const { impl } = mockFetch(new Response("", { status: 422 }));
  assert.equal((await submitContact(payload, impl)).state, "invalid");
});

test("500: becomes a generic error", async () => {
  const { impl } = mockFetch(new Response("", { status: 500 }));
  assert.equal((await submitContact(payload, impl)).state, "error");
});

test("network down: becomes a generic error instead of throwing", async () => {
  const failing = (async () => {
    throw new TypeError("Failed to fetch");
  }) as unknown as typeof fetch;

  assert.equal((await submitContact(payload, failing)).state, "error");
});

test("invalid email: never reaches the endpoint", async () => {
  const { impl, calls } = mockFetch(new Response("", { status: 200 }));

  const result = await submitContact({ ...payload, email: "not-an-email" }, impl);

  assert.equal(result.state, "invalid");
  assert.equal(calls.length, 0);
});

test("empty message: never reaches the endpoint", async () => {
  const { impl, calls } = mockFetch(new Response("", { status: 200 }));

  const result = await submitContact({ ...payload, message: "   " }, impl);

  assert.equal(result.state, "invalid");
  assert.equal(calls.length, 0);
});

test("honeypot filled: pretends success and spends no request", async () => {
  const { impl, calls } = mockFetch(new Response("", { status: 200 }));

  const result = await submitContact({ ...payload, website: "http://spam.example" }, impl);

  assert.equal(result.state, "success");
  assert.equal(calls.length, 0);
});

// ── isValidEmail ─────────────────────────────────────────────────────────

test("isValidEmail: accepts a well-formed address", () => {
  assert.equal(isValidEmail("jane@example.com"), true);
});

test("isValidEmail: rejects a string with no @ or domain", () => {
  assert.equal(isValidEmail("not-an-email"), false);
});

// ── Endpoint ─────────────────────────────────────────────────────────────

test("endpoint: defaults to the CosmoTV API public landing-contact route", () => {
  assert.equal(
    CONTACT_ENDPOINT,
    "https://cosmotv-api.thankfulforest-5ed2b125.brazilsouth.azurecontainerapps.io/v1/public/landing-contact",
  );
  assert.ok(CONTACT_ENDPOINT.includes("landing-contact"), "must contain landing-contact");
});
