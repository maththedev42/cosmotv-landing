import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "dark" | "raised" | "light" | "violet";

const toneClass: Record<Tone, string> = {
  dark: "bg-noite text-luz",
  raised: "bg-noite-2 text-luz",
  light: "bg-luz text-ink",
  violet: "bg-orbita text-luz",
};

/** Every landing section is one "episode" of the page, with a stable anchor and marker. */
export function Section({
  id,
  "data-landing-section": marker,
  tone = "dark",
  className,
  children,
}: {
  id: string;
  /** Written literally at each call site: CosmoHQ's deploy gate scans the source for it. */
  "data-landing-section"?: "hero" | "value" | "features" | "product" | "conversion" | "faq" | "final-cta" | "android-testers";
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-landing-section={marker}
      className={cn("relative scroll-mt-16 overflow-hidden", toneClass[tone], className)}
    >
      {children}
    </section>
  );
}

const codeTone: Record<Tone, string> = {
  dark: "bg-proximo/15 text-proximo",
  raised: "bg-proximo/15 text-proximo",
  light: "bg-orbita/10 text-orbita",
  violet: "bg-luz/15 text-luz",
};

const labelTone: Record<Tone, string> = {
  dark: "text-muted",
  raised: "text-muted",
  light: "text-muted-light",
  violet: "text-luz",
};

/** "E03 · Day to day" — the episode code that labels a section. */
export function Eyebrow({ code, tone = "dark", children }: { code: string; tone?: Tone; children?: ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.16em]">
      <span className={cn("ep-code rounded-md px-1.5 py-0.5 text-[0.72rem]", codeTone[tone])}>{code}</span>
      {children && <span className={labelTone[tone]}>{children}</span>}
    </p>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-display text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-balance",
        className,
      )}
    >
      {children}
    </h2>
  );
}
