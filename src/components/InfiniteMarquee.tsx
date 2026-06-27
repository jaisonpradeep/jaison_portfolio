"use client";

import React from "react";

const ITEMS = [
  "AI Agents",
  "RAG",
  "Next.js 15",
  "TypeScript",
  "FastAPI",
  "LangChain",
  "Docker",
  "PostgreSQL",
  "MCP Protocols",
  "Python",
  "Vector DBs",
  "Framer Motion",
  "GSAP ScrollTrigger",
];

export default function InfiniteMarquee() {
  return (
    <section className="relative py-16 w-full bg-white overflow-hidden flex flex-col gap-6 z-10">
      {/* Track 1: Leftward moving marquee */}
      <div className="relative w-full flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]">
        <div className="flex whitespace-nowrap animate-marquee gap-8 py-2">
          {/* Double content to ensure seamless loop */}
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                {ITEMS.map((item, index) => (
                  <span
                    key={item + index}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-slate-200 hover:text-slate-900 transition-colors duration-300 flex items-center select-none"
                  >
                    {item}
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-electric-blue ml-8 animate-pulse-subtle shrink-0" />
                  </span>
                ))}
              </div>
            ))}
        </div>
      </div>

      {/* Track 2: Rightward moving marquee (Reverse) */}
      <div className="relative w-full flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]">
        <div className="flex whitespace-nowrap animate-marquee-reverse gap-8 py-2">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                {ITEMS.slice()
                  .reverse()
                  .map((item, index) => (
                    <span
                      key={item + index + "-rev"}
                      className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-slate-200 hover:text-slate-900 transition-colors duration-300 flex items-center select-none"
                    >
                      {item}
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-accent to-pink-accent ml-8 animate-pulse-subtle shrink-0" />
                    </span>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
