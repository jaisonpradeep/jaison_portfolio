"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    if (!dot || !ring || !glow) return;

    // Quick setters for smooth animations
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    const xToRing = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    const xToGlow = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const yToGlow = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    // Set initial positions off-screen
    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const { clientX, clientY } = e;
      xToDot(clientX);
      yToDot(clientY);

      xToRing(clientX);
      yToRing(clientY);

      xToGlow(clientX);
      yToGlow(clientY);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Event delegation for interactive hover effects
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, [role='button'], input, textarea, .interactive-hover");
      
      if (interactiveEl) {
        setIsHovered(true);
        
        // Custom text inside cursor if set (e.g. data-cursor-text="View")
        const text = interactiveEl.getAttribute("data-cursor-text");
        if (text) {
          setHoverText(text);
          gsap.to(ring, {
            scale: 2.2,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            duration: 0.3,
            ease: "power2.out",
            force3D: true
          });
          gsap.to(dot, { scale: 0, duration: 0.2, force3D: true });
        } else {
          gsap.to(ring, {
            scale: 1.5,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.8)",
            duration: 0.3,
            ease: "power2.out",
            force3D: true
          });
          gsap.to(dot, { scale: 1.5, backgroundColor: "#ffffff", duration: 0.2, force3D: true });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, [role='button'], input, textarea, .interactive-hover");
      
      if (interactiveEl) {
        setIsHovered(false);
        setHoverText("");
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.3)",
          duration: 0.3,
          ease: "power2.out",
          force3D: true
        });
        gsap.to(dot, { scale: 1, backgroundColor: "#ffffff", duration: 0.2, force3D: true });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isVisible, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Background Soft Glow following cursor */}
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-opacity duration-700 bg-radial from-cyan-200/20 via-purple-100/10 to-transparent blur-3xl ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Tiny center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white mix-blend-difference pointer-events-none z-[9998] flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {hoverText && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-white">
            {hoverText}
          </span>
        )}
      </div>
    </>
  );
}
