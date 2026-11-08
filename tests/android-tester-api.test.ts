// Tests for the Android tester signup form submission helper.
// Runs directly on Node (native type stripping), no bundler:
//   pnpm test
//
// fetch is injected, so no real request ever leaves this suite.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  submitAndroidTester,
  ANDROID_TESTERS_ENDPOINT,
  ANDROID_TESTER_LINKS,
  buildTesterIntentUrl,
  normalizeTesterCode,
  type AndroidTesterPayload,
} from "../lib/contact-api.ts";
import { detectTesterLocale } from "../lib/locales.ts";

const payload: AndroidTesterPayload = {
  email: "tester@example.com",
  locale: "pt-BR",
  website: "",
};

const fakeLinks = {
  group: "https://groups.google.com/g/cosmotv-testers",
  optIn: "https://play.google.com/apps/testing/com.cosmohq.cosmotv",
  store: "https://play.google.com/store/apps/details?id=com.cosmohq.cosmotv",
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

test("android testers success: 202 returns state=success and links", async () => {
  const { impl, calls } = mockFetch(
    new Response(JSON.stringify({ ok: true, links: fakeLinks }), { status: 202 }),
  );

  const result = await submitAndroidTester(payload, impl);

  assert.equal(result.state, "success");
  assert.deepEqual(result.links, fakeLinks);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, ANDROID_TESTERS_ENDPOINT);
  assert.equal(calls[0].init?.method, "POST");

  const body = JSON.parse(String(calls[0].init?.body));
  assert.deepEqual(Object.keys(body).sort(), ["email", "locale", "website"]);
  assert.equal(body.email, "tester@example.com");
  assert.equal(body.locale, "pt-BR");
  assert.equal(body.website, "");
});

test("android testers 422: becomes invalid", async () => {
  const { impl } = mockFetch(new Response("", { status: 422 }));
  const result = await submitAndroidTester(payload, impl);
  assert.equal(result.state, "invalid");
});

test("android testers 429: becomes rate-limited and honours Retry-After in seconds", async () => {
  const { impl } = mockFetch(new Response("", { status: 429, headers: { "Retry-After": "60" } }));
  const result = await submitAndroidTester(payload, impl);
  assert.equal(result.state, "rate-limited");
  assert.equal(result.retryAfter, 60);
});

test("android testers 429 without Retry-After: still rate-limited, no seconds", async () => {
  const { impl } = mockFetch(new Response("", { status: 429 }));
  const result = await submitAndroidTester(payload, impl);
  assert.equal(result.state, "rate-limited");
  assert.equal(result.retryAfter, undefined);
});

test("android testers 503: becomes provider-down", async () => {
  const { impl } = mockFetch(new Response("", { status: 503 }));
  const result = await submitAndroidTester(payload, impl);
  assert.equal(result.state, "provider-down");
});

test("android testers network down: becomes a generic error instead of throwing", async () => {
  const failing = (async () => {
    throw new TypeError("Failed to fetch");
  }) as unknown as typeof fetch;

  const result = await submitAndroidTester(payload, failing);
  assert.equal(result.state, "error");
});

test("android testers timeout: a fetch that never resolves returns error after timeoutMs", async () => {
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
  const result = await submitAndroidTester(payload, neverResolvingFetch, { timeoutMs: 50 });
  const elapsed = Date.now() - start;

  assert.equal(result.state, "error");
  assert.ok(elapsed >= 35, `expected at least ~35ms, got ${elapsed}ms`);
  assert.ok(elapsed < 1000, `expected less than 1s, got ${elapsed}ms`);
});

test("android testers invalid email: never reaches the endpoint", async () => {
  let called = false;
  const trackingFetch = (async () => {
    called = true;
    return new Response("", { status: 200 });
  }) as unknown as typeof fetch;

  const result = await submitAndroidTester({ ...payload, email: "not-an-email" }, trackingFetch);
  assert.equal(result.state, "invalid");
  assert.equal(called, false);
});

test("android testers honeypot filled: pretends success and spends no request", async () => {
  let called = false;
  const trackingFetch = (async () => {
    called = true;
    return new Response("", { status: 200 });
  }) as unknown as typeof fetch;

  const result = await submitAndroidTester({ ...payload, website: "https://spam.example" }, trackingFetch);
  assert.equal(result.state, "success");
  assert.equal(called, false);
});

test("ANDROID_TESTER_LINKS: shared three step URLs equal the expected Play testing links", () => {
  assert.deepEqual(ANDROID_TESTER_LINKS, {
    group: "https://groups.google.com/g/cosmotv-testers",
    optIn: "https://play.google.com/apps/testing/com.cosmohq.cosmotv",
    store: "https://play.google.com/store/apps/details?id=com.cosmohq.cosmotv",
  });
});

test("buildTesterIntentUrl: lowercase code is upper-cased and URL-safe, fallback URL encoded once", () => {
  assert.equal(normalizeTesterCode("  ab3d5f7h9k "), "AB3D5F7H9K");

  const url = buildTesterIntentUrl("ab3d5f7h9k");
  const expectedFallback = encodeURIComponent(ANDROID_TESTER_LINKS.optIn);
  assert.equal(
    url,
    `intent://tester?code=AB3D5F7H9K#Intent;scheme=com.cosmohq.cosmotv;package=com.cosmohq.cosmotv;S.browser_fallback_url=${expectedFallback};end`,
  );
  // Ensure fallback URL is encoded exactly once (no double %253A)
  assert.ok(url.includes("S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fapps%2Ftesting%2Fcom.cosmohq.cosmotv;end"));
  assert.ok(!url.includes("%253A"));

  // Unsafe characters in code are URL-encoded after upper-casing
  const unsafeUrl = buildTesterIntentUrl("ab cd+ef");
  assert.ok(unsafeUrl.startsWith("intent://tester?code=AB%20CD%2BEF#Intent;"));
});

test("detectTesterLocale: maps pt* to pt-BR, es* to es, and anything else to en", () => {
  assert.equal(detectTesterLocale(["pt-BR", "en"]), "pt-BR");
  assert.equal(detectTesterLocale(["es-419"]), "es");
  assert.equal(detectTesterLocale(["fr"]), "en");
  assert.equal(detectTesterLocale([]), "en");
});
