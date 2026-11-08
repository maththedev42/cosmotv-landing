"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Dict } from "@/lib/i18n";
import type { Device, Shot, TourStory } from "@/lib/screenshots";
import { ShotImage } from "./shot";

const DEVICES: Device[] = ["iphone", "ipad"];

/**
 * Story × device selector over the localized store frames. Only the selected
 * frame is in the DOM, so the default state (Discover on iPhone) is the only
 * tour image a visitor sees until they choose another.
 */
export function ProductTour({
  t,
  shotText,
  stories,
  shots,
}: {
  t: Dict["product"];
  shotText: Dict["shots"];
  stories: readonly TourStory[];
  shots: Record<Device, Record<TourStory, Shot>>;
}) {
  const [story, setStory] = useState<TourStory>(stories[0]);
  const [device, setDevice] = useState<Device>("iphone");

  const shot = shots[device][story];
  const text = shotText[device][story];

  return (
    <div data-landing-interactive className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
      <div className="space-y-8">
        <div>
          <p className="ep-code text-xs uppercase text-muted">{t.storiesLabel}</p>
          <div role="group" aria-label={t.storiesLabel} className="mt-3 flex flex-col gap-2">
            {stories.map((key) => {
              const active = key === story;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStory(key)}
                  className={cn(
                    "flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-5 text-left transition-colors duration-200",
                    active
                      ? "border-orbita bg-orbita/15 text-luz"
                      : "border-line text-luz/75 hover:border-orbita-soft hover:text-luz",
                  )}
                >
                  <span className="font-display text-xl font-semibold tracking-tight">{t.stories[key]}</span>
                  <span className="flex items-center gap-2">
                    {key === "rewind" && (
                      <span className="rounded-full bg-orbita px-2 py-0.5 text-xs font-semibold text-luz">{t.proTag}</span>
                    )}
                    <span
                      aria-hidden="true"
                      className={cn("size-2.5 rounded-full", active ? "bg-proximo" : "bg-line")}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="ep-code text-xs uppercase text-muted">{t.devicesLabel}</p>
          <div role="group" aria-label={t.devicesLabel} className="mt-3 inline-flex rounded-full border border-line p-1">
            {DEVICES.map((key) => {
              const active = key === device;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDevice(key)}
                  className={cn(
                    "min-h-11 min-w-24 rounded-full px-5 text-sm font-semibold transition-colors duration-200",
                    active ? "bg-luz text-noite" : "text-muted hover:text-luz",
                  )}
                >
                  {t.devices[key]}
                </button>
              );
            })}
          </div>
        </div>

        <p aria-live="polite" className="max-w-md border-l-2 border-proximo pl-4 text-base leading-relaxed text-luz/85">
          {text.caption}
        </p>
      </div>

      <figure className="relative flex min-h-[28rem] items-center justify-center rounded-[2rem] border border-line bg-noite-2 p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(60%_50%_at_50%_45%,rgba(103,87,232,0.35),transparent)]"
        />
        <div className={cn("relative w-full", device === "iphone" ? "max-w-[18rem]" : "max-w-[30rem]")}>
          <ShotImage
            key={shot.src}
            shot={shot}
            alt={text.alt}
            sizes={device === "iphone" ? "(min-width: 640px) 288px, 80vw" : "(min-width: 640px) 480px, 90vw"}
            className="shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]"
          />
        </div>
        <figcaption className="sr-only">{text.caption}</figcaption>
      </figure>
    </div>
  );
}
