"use client";

import { Check, Play, Undo2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Dict } from "@/lib/i18n";
import { fill } from "@/lib/locales";

const SEASON = 1;
// A season in progress: the first three episodes are already watched.
const INITIAL = [true, true, true, false, false, false, false, false];

/**
 * The app's core loop in miniature: tap an episode to mark it, and "next up"
 * moves to the first one you haven't seen. Undo mirrors the app's swipe-to-undo.
 * Illustrative only — no show, no numbers from anyone's real library.
 */
export function EpisodeToy({ t }: { t: Dict["features"]["toy"] }) {
  const [watched, setWatched] = useState<boolean[]>(INITIAL);
  const [history, setHistory] = useState<boolean[][]>([]);

  const nextIndex = watched.indexOf(false);
  const count = watched.filter(Boolean).length;

  const toggle = (index: number) => {
    setHistory((h) => [...h, watched]);
    setWatched((w) => w.map((value, i) => (i === index ? !value : value)));
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setWatched(previous);
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <div data-landing-interactive className="mt-8 rounded-2xl border border-line bg-noite-3/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-luz/85">{t.label}</p>
        <p className="ep-code text-xs uppercase text-muted">{t.season}</p>
      </div>

      <div role="group" aria-label={t.season} className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {watched.map((isWatched, i) => {
          const isNext = i === nextIndex;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={isWatched}
              aria-label={fill(t.episode, { n: i + 1 })}
              onClick={() => toggle(i)}
              className={cn(
                "group flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border text-xs transition-colors duration-200",
                isWatched
                  ? "border-proximo/40 bg-proximo/15 text-proximo"
                  : isNext
                    ? "border-orbita bg-orbita/15 text-luz"
                    : "border-line bg-noite-2 text-muted hover:border-orbita-soft hover:text-luz",
              )}
            >
              <span className="ep-code">E{i + 1}</span>
              {isWatched ? (
                <Check className="size-4" aria-hidden="true" />
              ) : isNext ? (
                <Play className="size-3.5 fill-current" aria-hidden="true" />
              ) : (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-line" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-proximo transition-[width] duration-300"
          style={{ width: `${(count / watched.length) * 100}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-display text-lg font-semibold tracking-tight">
          {nextIndex === -1 ? (
            <span className="text-proximo">{t.done}</span>
          ) : (
            <>
              <span className="text-muted">{t.next}: </span>
              <span className="ep-code">{fill(t.code, { s: SEASON, n: nextIndex + 1 })}</span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-luz transition-colors hover:border-orbita-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 className="size-4" aria-hidden="true" />
          {t.undo}
        </button>
      </div>
    </div>
  );
}
