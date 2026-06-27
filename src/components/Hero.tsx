"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import ProfileVisual from "./ProfileVisual";
import { useLenis } from "./SmoothScrollProvider";
import { Code, Brain, Sparkles } from "lucide-react";
import Magnetic from "./Magnetic";

/* ─── Asset URLs ────────────────────────────────────────────────────────────── */
const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;
const LERP = 0.10; // cursor smoothing factor

/* ─────────────────────────────────────────────────────────────────────────────
   RevealLayer — completely ref-driven, ZERO React state in the hot path.
   - Mouse tracking, lerp smoothing, canvas draw, and mask application all
     happen inside a single RAF loop via direct DOM refs.
   - No setState → no Hero re-renders during cursor movement.
   - Uses SVG mask instead of canvas.toDataURL() to avoid GPU→CPU readback.
────────────────────────────────────────────────────────────────────────────── */
function RevealLayer({ image }: { image: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGRadialGradientElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  /* Tracking refs — never touch React state */
  const mouseRef  = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* Single RAF loop — lerp + update SVG mask position directly */
    const loop = () => {
      const s = smoothRef.current;
      const m = mouseRef.current;
      s.x += (m.x - s.x) * LERP;
      s.y += (m.y - s.y) * LERP;

      /* Move the SVG radial gradient centre directly in DOM — no React re-render */
      if (svgRef.current) {
        svgRef.current.setAttribute("cx", String(s.x));
        svgRef.current.setAttribute("cy", String(s.y));
        svgRef.current.setAttribute("fx", String(s.x));
        svgRef.current.setAttribute("fy", String(s.y));
      }
      if (circleRef.current) {
        circleRef.current.setAttribute("cx", String(s.x));
        circleRef.current.setAttribute("cy", String(s.y));
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Unique ID per component instance to avoid SVG mask collision */
  const maskId = "hero-spotlight-mask";

  return (
    <div ref={wrapRef} className="absolute inset-0 z-30 pointer-events-none" style={{ bottom: "-30px" }}>
      {/* Inline SVG mask — GPU composited, no canvas readback */}
      <svg
        className="absolute"
        style={{ width: 0, height: 0, position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id={`${maskId}-grad`}
            cx="-999"
            cy="-999"
            r={SPOTLIGHT_R}
            fx="-999"
            fy="-999"
            gradientUnits="userSpaceOnUse"
            ref={svgRef}
          >
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="40%"  stopColor="white" stopOpacity="1" />
            <stop offset="60%"  stopColor="white" stopOpacity="0.75" />
            <stop offset="75%"  stopColor="white" stopOpacity="0.4" />
            <stop offset="88%"  stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId}>
            <circle
              ref={circleRef}
              cx="-999"
              cy="-999"
              r={SPOTLIGHT_R}
              fill={`url(#${maskId}-grad)`}
            />
          </mask>
        </defs>
      </svg>

      {/* Reveal image — masked by SVG, no dataURL overhead */}
      <div
        ref={revealRef}
        className="absolute bg-center bg-cover bg-no-repeat"
        style={{
          inset: 0,
          bottom: "-30px",
          backgroundImage: `url(${image})`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
          willChange: "mask-position",
        }}
      />
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { scrollTo } = useLenis();
  const heroRef = useRef<HTMLElement>(null);

  /* Scroll-driven parallax — only transform & opacity (GPU props only) */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rawTextY   = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rawVisualY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* Spring smoothing — tighter springs track Lenis scroll more faithfully */
  const textY   = useSpring(rawTextY,   { stiffness: 120, damping: 30, mass: 0.5 });
  const visualY = useSpring(rawVisualY, { stiffness: 120, damping: 30, mass: 0.5 });
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 32, mass: 0.5 });

  const titleWords = "CRAFTING INTELLIGENT SYSTEMS".split(" ");

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full overflow-hidden bg-black flex items-center justify-center py-20 lg:py-32"
      style={{
        height: "100dvh",
        minHeight: "100vh",
        /* GPU promotion — compositor layer for the hero */
        transform: "translate3d(0,0,0)",
        willChange: "transform",
        contain: "layout paint",
      }}
    >
      {/* ── Layer 1: Base image — Ken Burns zoom ──────────────────────────── */}
      <div
        className="absolute z-10 bg-center bg-cover bg-no-repeat hero-zoom"
        style={{
          backgroundImage: `url(${BG_IMAGE_1})`,
          top: 0, left: 0, right: 0, bottom: "-30px",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Dark vignette — opacity only, no blur (GPU cheap) */}
      <div
        className="absolute z-20 bg-gradient-to-b from-black/30 via-black/20 to-black/50 pointer-events-none"
        style={{ top: 0, left: 0, right: 0, bottom: "-30px" }}
      />

      {/* ── Layer 2: Spotlight reveal — SVG mask, ref-only, 0 re-renders ─── */}
      <RevealLayer image={BG_IMAGE_2} />

      {/* ── Hero content ──────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 relative z-50 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* Left: text — only transform+opacity animated (GPU only) */}
        <motion.div
          style={{ y: textY, opacity }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-6 border border-white/20 shadow-sm"
            style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-white/90 uppercase font-mono">
              Available for Contracts
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg font-bold tracking-widest text-white/50 uppercase font-mono mb-2"
          >
            JAISON PRADEEP
          </motion.h2>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] font-display mb-6">
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-3 pb-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block ${word === "INTELLIGENT" ? "gradient-text-vibrant" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/70 max-w-xl font-sans leading-relaxed mb-8"
          >
            Full Stack Developer <span className="text-white/30">•</span> AI Engineer{" "}
            <span className="text-white/30">•</span> Building Intelligent Systems with modern
            LLMs, agents, and highly-animated frontends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25} range={50}>
              <button
                onClick={() => scrollTo("#projects")}
                className="px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-white/15 hover:bg-white/25 border border-white/25 transition-colors shadow-md cursor-none flex items-center gap-2"
                style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              >
                View Works
              </button>
            </Magnetic>

            <Magnetic strength={0.2} range={40}>
              <button
                onClick={() => scrollTo("#contact")}
                className="px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-slate-900 bg-white/90 hover:bg-white transition-colors cursor-none"
              >
                Get in Touch
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right: profile + widgets — only transform+opacity */}
        <motion.div
          style={{ y: visualY, opacity }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute top-10 left-[-20px] md:left-[-40px] z-20 p-4 rounded-2xl flex items-center gap-3 shadow-md max-w-[160px] border border-white/20 animate-float-slow"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-mono">AI Engines</div>
              <div className="text-[10px] text-white/60 font-mono">RAG / MCP / Agents</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="absolute bottom-10 right-[-10px] md:right-[-20px] z-20 p-4 rounded-2xl flex items-center gap-3 shadow-md max-w-[180px] border border-white/20 animate-float-medium"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase font-mono">Full Stack</div>
              <div className="text-[10px] text-white/60 font-mono">React • FastAPI</div>
            </div>
          </motion.div>

          <ProfileVisual />
        </motion.div>
      </div>

      {/* Scroll indicator — opacity only */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-none z-50"
      >
        <span className="text-[10px] tracking-widest text-white/50 uppercase font-semibold">Scroll Down</span>
        <button
          onClick={() => scrollTo("#scroll-story")}
          className="w-8 h-12 rounded-full border border-white/30 flex justify-center p-2 hover:border-white/70 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-white/60 rounded-full"
          />
        </button>
      </motion.div>
    </section>
  );
}
