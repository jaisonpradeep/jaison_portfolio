"use client";

/**
 * useLenisScroll
 *
 * Drives a Framer Motion MotionValue with Lenis's real-time scroll position.
 * This makes useTransform parallax effects track the Lenis virtual scroll
 * (not the native scroll event which fires after paint), giving true buttery
 * motion on every animation frame.
 */

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, MotionValue } from "framer-motion";
import { globalLenis } from "./SmoothScrollProvider";

/**
 * Returns a MotionValue that mirrors the Lenis scroll progress
 * for a given element ref, mapped [0 → 1] between `start` and `end` offsets.
 *
 * @param ref         - The element to track
 * @param inputRange  - Scroll positions (px) [start, end] at which the output
 *                      maps from 0 → 1. Defaults to element enter/exit viewport.
 */
export function useLenisScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  outputRange: [number, number] = [-100, 100]
): MotionValue<number> {
  // Raw lenis scroll value (px)
  const lenisScroll = useMotionValue(0);

  useEffect(() => {
    // Subscribe to Lenis scroll events; update the MotionValue each frame
    const handler = ({ scroll }: { scroll: number }) => {
      lenisScroll.set(scroll);
    };

    // Attach as soon as Lenis is ready (it may mount slightly after this hook)
    const attach = () => {
      if (globalLenis) {
        globalLenis.on("scroll", handler);
        // Seed with current position
        lenisScroll.set(globalLenis.scroll);
      } else {
        // Retry if Lenis hasn't mounted yet
        const id = setTimeout(attach, 50);
        return () => clearTimeout(id);
      }
    };

    attach();

    return () => {
      if (globalLenis) globalLenis.off("scroll", handler);
    };
  }, [lenisScroll]);

  // Map raw scroll px → element-relative progress [-100 → 100] by default
  // Callers can then useTransform this however they like
  const elementProgress = useMotionValue(0);

  useEffect(() => {
    return lenisScroll.on("change", (scroll) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewH = window.innerHeight;

      // When element top hits bottom of viewport → 0
      // When element bottom hits top of viewport → 1
      const elementTop = rect.top + scroll - (window.scrollY - scroll); // absolute top
      // Simpler: just use getBoundingClientRect relative position
      const relativeY = rect.top; // pixels from viewport top (negative = scrolled past)
      // Normalise: -viewH (element fully below) → +viewH (element fully above)
      const raw = relativeY / viewH; // -1 → +1
      elementProgress.set(
        outputRange[0] + (1 - (raw * 0.5 + 0.5)) * (outputRange[1] - outputRange[0])
      );
    });
  }, [lenisScroll, elementProgress, ref, outputRange]);

  return elementProgress;
}

/**
 * Returns a raw Lenis scroll MotionValue (absolute px from top of page).
 */
export function useLenisScrollY(): MotionValue<number> {
  const scrollY = useMotionValue(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  useEffect(() => {
    const handler = ({ scroll }: { scroll: number }) => {
      scrollY.set(scroll);
    };

    const attach = () => {
      if (globalLenis) {
        globalLenis.on("scroll", handler);
        scrollY.set(globalLenis.scroll);
      } else {
        const id = setTimeout(attach, 50);
        return () => clearTimeout(id);
      }
    };

    attach();

    return () => {
      if (globalLenis) globalLenis.off("scroll", handler);
    };
  }, [scrollY]);

  return scrollY;
}
