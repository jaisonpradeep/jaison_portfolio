"use client";

import React from "react";
import { useLenis } from "./SmoothScrollProvider";
import Magnetic from "./Magnetic";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const { scrollTo } = useLenis();

  return (
    <footer className="relative w-full bg-white py-12 border-t border-slate-200/50 z-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo / Details */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-slate-800 tracking-tight">
            JAISON PRADEEP <span className="text-electric-blue font-mono font-bold">•</span> PORTFOLIO
          </p>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            &copy; {new Date().getFullYear()} Jaison Pradeep. Crafted with Code & Precision.
          </p>
        </div>

        {/* Action credits details */}
        <div className="hidden lg:block text-center text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          {/* Engineered for international appeal */}
        </div>

        {/* Magnetic Back to Top Trigger */}
        <Magnetic strength={0.3} range={45}>
          <button
            onClick={() => scrollTo("#home")}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-colors focus:outline-none cursor-none shadow-sm"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </Magnetic>

      </div>
    </footer>
  );
}
