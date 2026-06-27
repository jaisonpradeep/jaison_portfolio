"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

/* ─── WordReveal Component ─────────────────────────────────────────────────── */
function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }} // Replays whenever scrolled into view from top or bottom
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.045, // Slow, steady stagger (45ms gap per word)
          }
        }
      }}
      className={className}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-1 pb-[2px]">
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } // Longer transition for clear visibility
              }
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll progress across the full section lifetime */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // full enter → exit range
  });

  /*
   * Fade-IN  : 0 → 0.15  (section entering from bottom)
   * Visible  : 0.15 → 0.80
   * Fade-OUT : 0.80 → 1   (section leaving through top)
   */
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.80, 1],
    [0,  1,    1,   0]
  );

  /* Subtle vertical drift on enter + exit for depth */
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.80, 1],
    [40,  0,    0,  -30]
  );

  /* Spring-smooth both so they track Lenis perfectly.
     Higher stiffness = snappier. Higher damping = less oscillation. */
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30, mass: 0.5 });
  const y       = useSpring(rawY,       { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      style={{ opacity, y }}
      className="relative min-h-screen py-24 md:py-32 w-full overflow-hidden bg-pearl flex items-center"
    >
      {/* Decorative blur blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-radial from-cyan-100/35 to-transparent blur-3xl" />
        <div className="absolute bottom-[20%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-radial from-purple-100/30 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">

        {/* ── Left: Story & counters ──────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-electric-blue font-mono mb-4 inline-block">
            {/* // WHO I AM */}
          </span>

          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 font-display leading-[0.9] mb-8">
            Engineering with Precision.{" "}
            <span className="gradient-text-vibrant">Designing for Human Emotion.</span>
          </h2>

          <WordReveal 
            text="Hello, I'm Jaison Pradeep. I specialize in building robust, performant full-stack systems and integrating advanced artificial intelligence models into seamless frontend designs."
            className="text-slate-600 text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 font-sans"
          />

          <WordReveal 
            text="My engineering philosophy centers around absolute smooth execution, clean type-safety, and interactive motion language. I believe web systems should not just serve data, but narrate stories through fluidity, depth, and micro-interactions."
            className="text-slate-600 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 font-sans"
          />
        </div>

        {/* ── Right: Low-contrast stats cards with hover motion and glow ───── */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 w-full">
          {[
            {
              large: "2+",
              label: "Years of Learning",
              delay: 0.1,
            },
            {
              large: "15+",
              label: "Projects Completed",
              delay: 0.2,
            },
            {
              large: "MERN",
              label: "Stack Expert",
              delay: 0.3,
            },
            {
              large: "Python",
              label: "Developer",
              delay: 0.4,
            },
          ].map((w) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: w.delay }}
              whileHover={{ 
                y: -6,
                scale: 1.015,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
              className="bg-slate-100/40 border border-slate-200/50 p-8 rounded-3xl flex flex-col justify-center min-h-[150px] sm:min-h-[170px] shadow-sm hover:shadow-[0_20px_40px_rgba(6,182,212,0.12)] hover:border-cyan-300/60 hover:bg-white transition-all duration-300 group relative overflow-hidden cursor-none"
            >
              {/* Soft light cyan radial glow on hover inside the card */}
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <span className="font-playfair italic text-slate-800 text-4xl sm:text-5xl font-medium tracking-tight mb-2 block select-none group-hover:text-cyan-600 transition-colors duration-300 origin-left">
                {w.large}
              </span>
              <span className="font-sans text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-slate-500 group-hover:text-slate-700 transition-colors duration-300 leading-tight">
                {w.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
