"use client";

// Re-compiled successfully
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Server, Network } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollStory() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  /* The "circle" is now a square div with border-radius: 50%
     that we SCALE — 100% GPU, zero clip-path, zero blur animation */
  const circleRef    = useRef<HTMLDivElement>(null);
  const vectorRef    = useRef<SVGSVGElement>(null);
  const stage1Ref    = useRef<HTMLDivElement>(null);
  const stage2Ref    = useRef<HTMLDivElement>(null);
  const stage3Ref    = useRef<HTMLDivElement>(null);
  const widgetsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section   = sectionRef.current;
    const container = containerRef.current;
    const circle    = circleRef.current;
    const vector    = vectorRef.current;
    const s1        = stage1Ref.current;
    const s2        = stage2Ref.current;
    const s3        = stage3Ref.current;
    const widgets   = widgetsRef.current;

    if (!section || !container || !circle || !vector || !s1 || !s2 || !s3 || !widgets) return;

    /* ── Promote all animated elements to compositor layers upfront ──── */
    gsap.set([circle, vector, s1, s2, s3, widgets], {
      force3D: true,
      willChange: "transform, opacity",
    });

    // Enforce perfect centering of the expanding circle element
    gsap.set(circle, {
      xPercent: -50,
      yPercent: -50,
    });

    /* ── Pin the viewport container ─────────────────────────────────── */
    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: container,
      anticipatePin: 1,
    });

    /* ── Single scrubbed timeline — all values use transform/opacity ─── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,    // Smooth but not laggy
      },
      defaults: {
        ease: "none",  // Linear scrub — let Lenis provide the easing
      },
    });

    /*
     * PHASE 0 → 1  Circle expands via SCALE (GPU only, no clip-path)
     * The circle starts at scale(0.32) — about 32% of viewport min-dim
     * and grows to scale(5.5) and morphs to borderRadius: 0% to cover the full viewport corners
     */
    tl.fromTo(
      circle,
      { scale: 0.32, opacity: 1, borderRadius: "50%" },
      { scale: 5.5, borderRadius: "0%", duration: 1.2 },
      0
    );

    /* Vector graphics fade in as circle expands (opacity only, no blur anim) */
    tl.fromTo(
      vector,
      { opacity: 0 },
      { opacity: 0.45, duration: 0.8 },
      0.1
    );

    /* Stage 1 fades out quickly once expansion begins, display:none ensures no overlap */
    tl.fromTo(
      s1,
      { opacity: 1, y: 0, display: "flex" },
      { opacity: 0, y: -50, display: "none", duration: 0.35 },
      0.05
    );

    /* ── PHASE 1 → 2  Stage 2 enters ───────────────────────────────── */
    tl.fromTo(
      s2,
      { opacity: 0, y: 50, display: "none" },
      { opacity: 1, y: 0, display: "flex", duration: 0.4 },
      0.75
    );
    tl.to(
      s2,
      { opacity: 0, y: -50, display: "none", duration: 0.35 },
      1.5
    );

    /* ── PHASE 2 → 3  Stage 3 enters and holds ──────────────────────── */
    tl.fromTo(
      s3,
      { opacity: 0, y: 50, display: "none" },
      { opacity: 1, y: 0, display: "flex", duration: 0.4 },
      2.0
    );

    /* ── Floating widgets drift (transform only) ─────────────────────── */
    const cards = widgets.querySelectorAll<HTMLElement>(".floating-widget");
    cards.forEach((card, i) => {
      gsap.set(card, { force3D: true });
      tl.fromTo(
        card,
        { y: 100 + i * 30, opacity: 0 },
        { y: -60 - i * 15, opacity: 1, duration: 1.8 },
        0.25 + i * 0.08
      );
    });

    return () => {
      pin.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scroll-story"
      className="relative bg-white"
      style={{ height: "300vh" }}
    >
      {/* ── Pinned viewport ──────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Pearl underlay */}
        <div className="absolute inset-0 bg-pearl z-0 pointer-events-none" />

        {/*
          ── Expanding circle — pure scale transform ───────────────────
          A perfectly square div with border-radius:50% scaled up.
          This is 100% GPU-composited — no clip-path, no layout paint.
          Size: 60vmin × 60vmin so scale(3.5) fills the whole screen.
        */}
        <div
          ref={circleRef}
          className="absolute z-10 pointer-events-none overflow-hidden"
          style={{
            width: "60vmin",
            height: "60vmin",
            borderRadius: "50%",
            /* Centre it */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.32)",
            transformOrigin: "center center",
            backgroundColor: "#020617", /* slate-950 */
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Custom SVG Neural Network Vector Scene — Crisp Infinite Scale */}
          <svg
            ref={vectorRef}
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              opacity: 0,
              willChange: "opacity",
              transform: "scale(1.05)",
            }}
          >
            {/* Inline CSS animation styles for rotating concentric radar rings and cyber scan lines */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes spin-reverse {
                0% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
              }
              @keyframes scan-vertical {
                0% { top: 0%; opacity: 0.2; }
                50% { opacity: 0.85; }
                100% { top: 100%; opacity: 0.2; }
              }
              .rot-slow {
                transform-origin: 720px 450px;
                animation: spin-slow 40s linear infinite;
              }
              .rot-rev {
                transform-origin: 720px 450px;
                animation: spin-reverse 50s linear infinite;
              }
              .animate-scan {
                animation: scan-vertical 5s ease-in-out infinite;
              }
            ` }} />

            {/* Concentric radar rings (Static for optimal scroll rendering performance) */}
            <g>
              <circle cx="720" cy="450" r="130" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
              <circle cx="720" cy="450" r="280" stroke="rgba(236, 72, 153, 0.06)" strokeWidth="1" strokeDasharray="10 20" />
            </g>
            <g>
              <circle cx="720" cy="450" r="200" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1.5" strokeDasharray="30 15" />
              <circle cx="720" cy="450" r="380" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" strokeDasharray="4 8" />
            </g>

            {/* Connected node network pathways */}
            <path
              d="M 100 150 L 300 150 L 450 300 L 700 300 L 800 450 L 1100 450"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
            <path
              d="M 200 700 L 400 700 L 550 550 L 900 550 L 1050 350 L 1300 350"
              stroke="rgba(139, 92, 246, 0.25)"
              strokeWidth="2"
              strokeDasharray="12 6"
            />
            <path
              d="M 500 100 L 650 250 L 650 500 L 850 700 L 1200 700"
              stroke="rgba(236, 72, 153, 0.18)"
              strokeWidth="1.5"
            />
            
            {/* Nodes */}
            <circle cx="300" cy="150" r="5" fill="#06b6d4" />
            <circle cx="450" cy="300" r="7" fill="#3b82f6" />
            <circle cx="700" cy="300" r="9" fill="#8b5cf6" />
            <circle cx="800" cy="450" r="6" fill="#ec4899" />
            <circle cx="550" cy="550" r="8" fill="#10b981" />
            <circle cx="900" cy="550" r="11" fill="#f59e0b" />
            
            {/* Laser pulse animations moving along the vector paths */}
            <circle r="4" fill="#00ffff">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M 100 150 L 300 150 L 450 300 L 700 300 L 800 450 L 1100 450"
              />
            </circle>
            <circle r="4" fill="#d946ef">
              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                path="M 200 700 L 400 700 L 550 550 L 900 550 L 1050 350 L 1300 350"
              />
            </circle>

            {/* Grid dot pattern backing */}
            <defs>
              <pattern id="vector-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="rgba(255, 255, 255, 0.15)" />
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vector-grid)" />
          </svg>

        </div>

        {/* ── Unscaled Content Overlay (Z-20) ───────────────────────────
            Positioned on top of the expanding circle, but NOT scaled
            so text remains perfectly crisp, normal-sized, and highly legible. */}
        <div className="absolute inset-0 z-25 flex items-center justify-center p-6 text-center pointer-events-none">

          {/* Stage 2 */}
          <div
            ref={stage2Ref}
            className="absolute text-center max-w-3xl flex flex-col items-center pointer-events-none p-4"
            style={{ opacity: 0, willChange: "transform, opacity", display: "none" }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-none mb-3">
              AGENTIC <span className="text-cyan-400">RAG</span> PIPELINES
            </h2>
            <p className="text-slate-200 text-xs md:text-sm lg:text-base max-w-xl leading-relaxed font-sans font-medium mb-5">
              Connecting intelligent autonomous agents with multi-source knowledge bases, delivering zero-latency data retrieval and contextual synthesis to custom web interfaces.
            </p>
            <div className="relative group mt-6 w-72 md:w-[450px] lg:w-[540px] aspect-[16/10] rounded-2xl p-2 bg-slate-900/98 border border-white/10 shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.4)] pointer-events-auto cursor-pointer overflow-hidden flex items-center justify-center"
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}>
              {/* Scan Line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 z-10 pointer-events-none animate-scan" />
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none" />
              {/* Image */}
              <img
                src="/images/agentic_rag.png"
                alt="Agentic RAG pipeline architecture diagram"
                loading="lazy"
                className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-95"
              />
            </div>
          </div>

          {/* Stage 3 */}
          <div
            ref={stage3Ref}
            className="absolute text-center max-w-3xl flex flex-col items-center pointer-events-none p-4"
            style={{ opacity: 0, willChange: "transform, opacity", display: "none" }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-none mb-3">
              INTELLIGENT{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SYSTEMS
              </span>
            </h2>
            <p className="text-slate-200 text-xs md:text-sm lg:text-base max-w-xl leading-relaxed font-sans font-medium mb-5">
              We design and engineer enterprise-grade digital architectures using autonomous workflows, model-context protocols (MCP), and highly interactive frontends running at 60 FPS.
            </p>
            <div className="relative group mt-6 w-72 md:w-[450px] lg:w-[540px] aspect-[16/10] rounded-2xl p-2 bg-slate-900/98 border border-white/10 shadow-[0_0_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.4)] pointer-events-auto cursor-pointer overflow-hidden flex items-center justify-center"
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}>
              {/* Scan Line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70 z-10 pointer-events-none animate-scan" />
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none" />
              {/* Image */}
              <img
                src="/images/intelligent_systems.png"
                alt="Intelligent systems telemetry dashboard mockup"
                loading="lazy"
                className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-95"
              />
            </div>
          </div>

          {/* Floating widget cards — Prominent yet sleek HUD tags (optimized) */}
          <div ref={widgetsRef} className="absolute inset-0 pointer-events-none">
            <div className="floating-widget absolute top-[18%] left-[10%] bg-slate-900/95 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-white max-w-[155px]"
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}>
              <Cpu className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase font-mono tracking-wider">Compute</h4>
                <p className="text-[8px] md:text-[9px] text-slate-300 font-mono leading-none mt-0.5">Autonomous Cycles</p>
              </div>
            </div>

            <div className="floating-widget absolute bottom-[22%] left-[14%] bg-slate-900/95 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-white max-w-[165px]"
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}>
              <Network className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase font-mono tracking-wider">Database</h4>
                <p className="text-[8px] md:text-[9px] text-slate-300 font-mono leading-none mt-0.5">Vector Linkages</p>
              </div>
            </div>

            <div className="floating-widget absolute top-[22%] right-[10%] bg-slate-900/95 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-white max-w-[155px]"
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}>
              <Server className="w-4.5 h-4.5 text-pink-400 shrink-0" />
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase font-mono tracking-wider">MCP Server</h4>
                <p className="text-[8px] md:text-[9px] text-slate-300 font-mono leading-none mt-0.5">Secure Tools Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stage 1 — mix-blend-mode:difference auto-contrasts ──────
            white text = black on pearl bg, white on dark circle bg    */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
          style={{ mixBlendMode: "difference", willChange: "transform, opacity" }}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none font-display"
              style={{ color: "#ffffff" }}
            >
              CORE OF <span style={{ color: "#ffffff" }}>AI</span> REVOLUTION
            </h2>
            <p
              className="mt-6 text-sm font-semibold tracking-widest uppercase font-mono"
              style={{ color: "#999999", mixBlendMode: "normal" }}
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
