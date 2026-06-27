"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: Record<string, unknown>) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(SmoothScrollContext);

/** Singleton — lets any hook outside the tree reach Lenis */
export let globalLenis: Lenis | null = null;

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /* ── 1. Create Lenis with tuned production settings ──────────────── */
    const lenis = new Lenis({
      duration: 1.5,                                            // Recommended sweet spot
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,   // Less aggressive — feels more controlled
      touchMultiplier: 1.5,   // Natural on mobile
      infinite: false,
      autoRaf: false,         // We drive via gsap.ticker
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    /* ── 2. Drive Lenis via gsap.ticker (single rAF, no jitter) ──── */
    // Store the tick fn in a stable variable so we can remove the SAME ref
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Prevent gsap lag smoothing from fighting Lenis easing
    gsap.ticker.lagSmoothing(0);

    /* ── 3. Keep GSAP ScrollTrigger in sync ──────────────────────── */
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);  // Remove same reference — was broken before
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options: Record<string, unknown> = {}
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as any, {
        duration: 1.8,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        ...options,
      });
    } else {
      const el =
        typeof target === "string"
          ? document.querySelector(target)
          : typeof target === "number"
          ? null
          : target;
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
