"use client";

import { SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface EpisodeLink {
  id: string;
  code: string;
  label: string;
}

/**
 * The page's signature: a streaming player's "Next episode" button. It always
 * says what comes next and fills its episode strip as you read — the app's own
 * promise ("always know what's next") applied to the page itself.
 *
 * Before hydration it is a plain link to the second section; at the finale
 * (the launch list) it steps aside.
 */
export function NextEpisode({ episodes, label }: { episodes: EpisodeLink[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.4;
      let index = 0;
      const nodes = episodes.map((episode) => document.getElementById(episode.id));
      nodes.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top <= probe) index = i;
      });
      const rect = nodes[index]?.getBoundingClientRect();
      const within = rect ? Math.min(1, Math.max(0, (probe - rect.top) / rect.height)) : 0;
      setCurrent(index);
      setProgress(within);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [episodes]);

  const next = episodes[current + 1];
  if (!next) return null;

  return (
    <a
      href={`#${next.id}`}
      data-next-episode
      className="fixed bottom-3 right-3 z-40 flex w-[13.5rem] flex-col gap-2 rounded-2xl border border-white/10 bg-noite/92 px-4 pb-3 pt-2.5 text-luz shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:border-orbita-soft sm:bottom-5 sm:right-5 sm:w-60"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="ep-code text-[0.68rem] uppercase text-muted">{label}</span>
        <span className="ep-code text-[0.72rem] text-proximo">{next.code}</span>
      </span>
      <span className="flex items-center justify-between gap-3">
        <span className="truncate font-display text-base font-semibold tracking-tight">{next.label}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orbita">
          <SkipForward className="size-4 fill-current" aria-hidden="true" />
        </span>
      </span>
      {/* One cell per section: watched sections fill in Verde Próximo. */}
      <span className="ep-rail h-1" aria-hidden="true">
        {episodes.map((episode, i) => (
          <span key={episode.id} className="relative overflow-hidden rounded-full bg-line">
            <span
              className={cn("absolute inset-y-0 left-0 bg-proximo", i < current && "w-full")}
              style={i === current ? { width: `${Math.round(progress * 100)}%` } : undefined}
            />
          </span>
        ))}
      </span>
    </a>
  );
}
