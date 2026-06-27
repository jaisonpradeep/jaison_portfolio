"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfileVisual() {
  const [imgError, setImgError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background particle connections for the generative placeholder
  useEffect(() => {
    if (!imgError || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 400);
    let height = (canvas.height = 400);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 6400) { // 80 * 80 = 6400
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.4)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imgError]);

  return (
    <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center">
      {/* Outer ambient glow circles */}
      <div className="absolute inset-0 bg-radial from-cyan-400/20 via-purple-400/10 to-transparent blur-3xl rounded-full scale-110" />

      {/* Floating rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[95%] h-[95%] border border-dashed border-cyan-400/30 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute w-[85%] h-[85%] border border-slate-200/40 rounded-full"
      />



      {/* Live Animated Glowing Aurora Shadow Behind Card */}
      <motion.div
        animate={{
          scale: [1, 1.03, 0.98, 1.02, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[86%] h-[86%] rounded-[48px] bg-gradient-to-tr from-cyan-400 via-electric-blue to-purple-accent opacity-50 blur-2xl z-0"
      />

      {/* Profile Frame with Mask and Glow */}
      <div className="relative w-[85%] h-[85%] rounded-[48px] overflow-hidden glass-panel flex items-center justify-center p-3.5 z-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        {!imgError ? (
          <div className="relative w-full h-full overflow-hidden rounded-[38px]">
            <Image
              src="/images/profile.jpg"
              alt="Jaison Pradeep"
              fill
              sizes="(max-width: 768px) 340px, 450px"
              quality={100}
              priority
              onError={() => setImgError(true)}
              className="object-cover rounded-[38px] transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          /* Generative placeholder visualization */
          <div className="relative w-full h-full bg-slate-50/50 rounded-[38px] overflow-hidden flex flex-col items-center justify-center">
            {/* Background Canvas Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

            {/* Central Holographic Neural Node */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-electric-blue to-purple-accent flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-sm font-bold tracking-widest text-slate-800 uppercase mb-1">
                SYSTEM ACTIVE
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Neural Net Node v4.15
              </p>
              
              {/* Dynamic code overlay */}
              <div className="absolute bottom-4 left-0 w-full text-center text-[8px] font-mono text-cyan-600/60 leading-normal animate-pulse-subtle">
                {"const model = await RAG.load('LLM');"}
              </div>
            </div>
          </div>
        )}

        {/* Ambient reflection overlay inside the card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/15 pointer-events-none" />
      </div>
    </div>
  );
}
