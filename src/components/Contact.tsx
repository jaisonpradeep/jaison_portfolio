"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, CheckCircle } from "lucide-react";
import Magnetic from "./Magnetic";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";
const FADE_DURATION = 1.2; // Cross-fade duration in seconds

/* ─── LoopingVideoBg — Double Buffered Seamless Cross-fading Loop ───────── */
function LoopingVideoBg() {
  const containerARef = useRef<HTMLDivElement>(null);
  const containerBRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    const cA = containerARef.current;
    const cB = containerBRef.current;

    if (!vA || !vB || !cA || !cB) return;

    let active = "A";
    let isTransitioning = false;
    let rafId: number;

    // Start Video A initially
    vA.currentTime = 0;
    vA.play().catch(() => { });
    cA.style.opacity = "1";
    cB.style.opacity = "0";

    const tick = () => {
      const activeVideo = active === "A" ? vA : vB;
      const nextVideo = active === "A" ? vB : vA;
      const activeCont = active === "A" ? cA : cB;
      const nextCont = active === "A" ? cB : cA;

      if (activeVideo.duration) {
        const curr = activeVideo.currentTime;
        const dur = activeVideo.duration;

        // If we enter the cross-fade window before the end
        if (dur - curr <= FADE_DURATION) {
          if (!isTransitioning) {
            isTransitioning = true;
            nextVideo.currentTime = 0;
            nextVideo.play().catch(() => { });
          }

          // Calculate cross-fade interpolation factor (0 to 1)
          const factor = (FADE_DURATION - (dur - curr)) / FADE_DURATION;
          activeCont.style.opacity = String(Math.max(0, 1 - factor));
          nextCont.style.opacity = String(Math.min(1, factor));
        }

        // When current video finishes or goes past duration
        if (curr >= dur - 0.05) {
          activeVideo.pause();
          activeVideo.currentTime = 0;
          activeCont.style.opacity = "0";
          nextCont.style.opacity = "1";

          // Swap active slots
          active = active === "A" ? "B" : "A";
          isTransitioning = false;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      vA.pause();
      vB.pause();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      {/* Buffer A */}
      <div
        ref={containerARef}
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{ opacity: 0 }}
      >
        <video
          ref={videoARef}
          src={VIDEO_URL}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Buffer B */}
      <div
        ref={containerBRef}
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{ opacity: 0 }}
      >
        <video
          ref={videoBRef}
          src={VIDEO_URL}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays to blend it into the section layout */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none z-10" />
    </div>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────────── */
export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti particles for success celebration
  const triggerConfetti = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      alpha: number;
    }> = [];

    const colors = ["#2563EB", "#06B6D4", "#8B5CF6", "#EC4899", "#F97316"];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 - 100,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 4 + 2,
        alpha: 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.alpha -= 0.01;

        if (p.alpha > 0) {
          active = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });

      if (active) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", message: "" });
        triggerConfetti();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 md:py-32 w-full bg-white flex items-center justify-center overflow-hidden"
    >
      {/* Canvas for confetti animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />

      {/* Looping Cinematic Video Background Layer (z-0) with Gradient Overlay */}
      <LoopingVideoBg />

      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-2xl mb-16 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-electric-blue font-mono mb-4 inline-block">
            {/* // GET IN TOUCH */}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 font-display mb-4">
            Let's Build Something Great
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Have a project idea, contract opening, or simply want to connect? Send a message and let's start talking.
          </p>
        </div>

        {/* Contact Layout Card */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Column: Direct Links Details */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-8 md:p-10 rounded-[36px] bg-slate-50/50">
            <div>
              <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                Connect Directly
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8">
                Feel free to email me, review my open-source code repositories, or check my career status.
              </p>

              {/* Contact Methods */}
              <div className="flex flex-col gap-6">
                {/* Email link */}
                <Magnetic strength={0.15}>
                  <a
                    href="mailto:jaisonpradeep@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/60 transition-colors cursor-none group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        Email Me
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        jaisonpradeep292002@gmail.com
                      </div>
                    </div>
                  </a>
                </Magnetic>

                {/* Github link */}
                <Magnetic strength={0.15}>
                  <a
                    href="https://github.com/Jaison08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/60 transition-colors cursor-none group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform duration-300">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        GitHub
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        github.com/jaisonpradeep
                      </div>
                    </div>
                  </a>
                </Magnetic>

                {/* Linkedin link */}
                <Magnetic strength={0.15}>
                  <a
                    href="https://www.linkedin.com/in/jaison-pradeep-42bb01224/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/60 transition-colors cursor-none group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        LinkedIn
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        linkedin.com/in/jaison-pradeep
                      </div>
                    </div>
                  </a>
                </Magnetic>
              </div>
            </div>

            {/* Career Status Badge */}
            <div className="mt-12 pt-6 border-t border-slate-200/50 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                Career Status
              </span>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for Projects
              </div>
            </div>
          </div>

          {/* Right Column: Secure Form */}
          <div className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-[36px] flex flex-col justify-between">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-3xl text-slate-900 mb-3">
                  Message Transmitted!
                </h3>
                <p className="text-slate-500 text-sm md:text-base max-w-sm leading-relaxed mb-8">
                  Your prompt context has been secured. I will reach out to you as soon as my compiler finishes processing.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-800 border border-slate-200 hover:bg-slate-50 cursor-none"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                    Send a Secure Message
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8">
                    Submit your parameters below. Encrypted pipelines will forward them straight to my inbox.
                  </p>

                  <div className="flex flex-col gap-6">
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors text-sm cursor-none"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors text-sm cursor-none"
                      />
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Let's discuss how we can build your intelligent systems..."
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none cursor-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  {status === "error" && (
                    <div className="text-xs font-semibold text-red-500 text-center">
                      Transmission failed. Please verify your connection status and retry.
                    </div>
                  )}

                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-4.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-900 transition-colors cursor-none flex items-center justify-center gap-2.5 shadow-md shadow-slate-950/10 disabled:opacity-50"
                    >
                      {status === "submitting" ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Transmitting Context...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Initialize Transmission
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
