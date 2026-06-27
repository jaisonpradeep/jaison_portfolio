"use client";

import React, { useState, useEffect } from "react";
import { useLenis } from "./SmoothScrollProvider";
import Magnetic from "./Magnetic";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", target: "#home" },
  { label: "About", target: "#about" },
  { label: "Skills", target: "#skills" },
  { label: "Projects", target: "#projects" },
  // { label: "Timeline", target: "#timeline" },
  { label: "Contact", target: "#contact" },
];

export default function Header() {
  const { lenis, scrollTo } = useLenis();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("#home");

  useEffect(() => {
    // Cache DOM elements to avoid layout thrashing and querySelector inside scroll callback
    const cachedItems = NAV_ITEMS.map((item) => ({
      target: item.target,
      el: typeof document !== "undefined" ? document.querySelector(item.target) as HTMLElement | null : null,
    }));

    const handleScroll = () => {
      const scrollY = lenis ? lenis.scroll : window.scrollY;
      setIsScrolled(scrollY > 20);
      
      const scrollPos = scrollY + 200;
      for (const item of cachedItems) {
        if (item.el) {
          const top = item.el.offsetTop;
          const bottom = top + item.el.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveItem(item.target);
          }
        }
      }
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    
    handleScroll();
    
    return () => {
      if (lenis) {
        lenis.off("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lenis]);

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    setActiveItem(target);
    scrollTo(target);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 bg-transparent border-b border-transparent ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Magnetic strength={0.25} range={50}>
            <button
              onClick={() => handleNavClick("#home")}
              className={`flex items-center text-xl font-bold tracking-tight focus:outline-none transition-colors duration-300 ${
                isScrolled ? "text-white" : "text-slate-900"
              }`}
            >
              <span>JAISON</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-electric-blue to-purple-accent ml-0.5 animate-pulse-subtle" />
            </button>
          </Magnetic>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 py-1.5 px-2 rounded-full bg-transparent">
            {NAV_ITEMS.map((item) => (
              <Magnetic key={item.target} strength={0.2} range={40}>
                <button
                  onClick={() => handleNavClick(item.target)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full focus:outline-none ${
                    isScrolled 
                      ? (activeItem === item.target ? "text-white font-bold" : "text-slate-400 hover:text-white") 
                      : (activeItem === item.target ? "text-slate-950 font-bold" : "text-slate-500 hover:text-slate-900")
                  }`}
                >
                  {item.label}
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* Let's Talk Button */}
          <div className="hidden lg:block">
            <Magnetic strength={0.3} range={55}>
              <button
                onClick={() => handleNavClick("#contact")}
                className={`group relative inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-none cursor-none bg-transparent hover:bg-transparent ${
                  isScrolled ? "text-white" : "text-slate-900"
                }`}
              >
                Let's talk
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </Magnetic>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-transparent border-0 focus:outline-none transition-colors duration-300 ${
              isScrolled ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] lg:hidden bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-8 text-white"
          >
            {/* Header placeholder space */}
            <div className="h-16" />

            {/* Links */}
            <nav className="flex flex-col gap-6 items-center text-center my-auto">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.target}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNavClick(item.target)}
                  className={`text-3xl font-semibold tracking-tight ${
                    activeItem === item.target ? "gradient-text-vibrant" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Footer details */}
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-xs tracking-widest text-slate-400 uppercase font-semibold">
                Available for remote projects
              </span>
              <a
                href="mailto:jaisonp118@gmail.com"
                className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-0.5 hover:border-slate-800 transition-colors"
              >
                jaisonp118@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
