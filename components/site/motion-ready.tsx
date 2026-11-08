"use client";

import { useEffect } from "react";

/**
 * Proof that React hydrated. The inline <head> script removes `motion-ready`
 * after a few seconds unless this marker shows up, so reveals only ever hide
 * content when the code that reveals it is actually running.
 */
export function MotionReady() {
  useEffect(() => {
    document.documentElement.classList.add("motion-hydrated");
  }, []);
  return null;
}
