"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Layers, Database, Cpu, Brain, Terminal, FileCode, CheckCircle2 } from "lucide-react";
import { ShineBorder } from "./ui/ShineBorder";

// Reusable 3D Tilt Card with Glare Effect (Optimized with GPU Motion Values — Zero React Re-renders)
function TiltCard({
  children,
  accentColor = "from-cyan-500 to-electric-blue",
}: {
  children: React.ReactNode;
  accentColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values to feed GPU transforms directly
  const pctX = useMotionValue(0.5);
  const pctY = useMotionValue(0.5);
  
  // Smooth physical spring responses
  const rotateX = useSpring(useTransform(pctY, [0, 1], [8, -8]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(pctX, [0, 1], [-8, 8]), { stiffness: 150, damping: 25 });
  const scale = useSpring(1, { stiffness: 150, damping: 25 });
  const glareX = useSpring(50, { stiffness: 150, damping: 25 });
  const glareY = useSpring(50, { stiffness: 150, damping: 25 });
  
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Percent coordinates within bounds [0, 1]
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    
    pctX.set(px);
    pctY.set(py);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pctX.set(0.5);
    pctY.set(0.5);
    scale.set(1);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] rounded-[36px] p-[1px] bg-gradient-to-br from-slate-200/50 via-transparent to-slate-200/30 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 flex overflow-hidden cursor-none"
      style={{
        perspective: "1000px",
      }}
    >
      <ShineBorder shineColor={["#FFD700", "#FFA500", "#FFD700"]} borderRadius={36} borderWidth={2} />
      {/* Outer border glow on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-0 transition-opacity duration-500 rounded-[36px] -z-10`}
        style={{ opacity: isHovered ? 0.15 : 0 }}
      />

      {/* Tilt Content */}
      <motion.div
        className="relative flex-1 w-full h-full glass-panel-heavy rounded-[35px] p-8 flex flex-col justify-between overflow-hidden"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glowing floating blob inside card */}
        <div
          className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${accentColor} blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}
        />

        {/* Glare Sheet */}
        <motion.div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.08 : 0,
            background: useTransform(
              [glareX, glareY],
              (values) => `radial-gradient(circle 180px at ${values[0]}% ${values[1]}%, #ffffff, transparent)`
            ) as any,
          }}
        />

        {/* Content Children */}
        <div className="z-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Column Parallax Component to simulate smooth Lenis scroll layout offsets
function ScrollParallaxCol({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the column relative to viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Vertical offset values based on column index
  // Col 0 (Frontend) slides up slightly, Col 1 (Backend) is static, Col 2 (AI) slides down slightly
  const y = useTransform(scrollYProgress, [0, 1], [30 * (index - 1), -30 * (index - 1)]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="w-full flex justify-center"
    >
      {children}
    </motion.div>
  );
}

export default function Skills() {
  const CATEGORIES = [
    {
      title: "Frontend",
      subtitle: "Client & Aesthetics",
      icon: <Layers className="w-6 h-6 text-cyan-500" />,
      accent: "from-cyan-400 to-electric-blue",
      techs: [
        { name: "React", desc: "Declarative, component-driven architecture" },
        { name: "Next.js 15", desc: "Server Actions, App Router optimization" },
        { name: "TypeScript", desc: "Strict compiler checks & safety models" },
        { name: "Tailwind CSS", desc: "Fluid, screen-responsive styling structures" },
      ],
    },
    {
      title: "Backend",
      subtitle: "Systems & Databases",
      icon: <Database className="w-6 h-6 text-purple-500 animate-pulse" />,
      accent: "from-purple-400 to-pink-500",
      techs: [
        { name: "Node.js / Express", desc: "Asynchronous middleware architectures" },
        { name: "FastAPI", desc: "Python web services with automatic Pydantic types" },
        { name: "MongoDB", desc: "NoSQL JSON schema definitions" },
        { name: "PostgreSQL", desc: "Relational constraints & optimized indexing" },
      ],
    },
    {
      title: "Artificial Intel",
      subtitle: "Models & Reasoning",
      icon: <Cpu className="w-6 h-6 text-orange-500" />,
      accent: "from-orange-400 to-pink-500",
      techs: [
        { name: "Python / PyTorch", desc: "Machine learning & scripting ecosystems" },
        { name: "LangChain", desc: "Composable prompt pipelines and agent tools" },
        { name: "RAG & Vector DBs", desc: "Pinecone / Qdrant semantic chunk queries" },
        { name: "Model Context (MCP)", desc: "Integrating secure context feeds into LLMs" },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="relative min-h-screen py-24 md:py-32 w-full bg-gradient-to-b from-rose-950 via-red-950 to-slate-950 flex items-center overflow-hidden"
    >
      {/* Background Crimson & Rose Aurora Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-radial from-red-500/20 to-transparent blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-radial from-rose-500/20 to-transparent blur-3xl animate-float-medium" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-4xl mb-20 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono mb-4 inline-block">
            // TECHNICAL ABILITIES
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-[6.5rem] font-black tracking-tight text-white font-display leading-[0.9] mb-6 flex flex-wrap justify-center gap-x-4 select-none">
            {"Core Tech Stack".split(" ").map((word, wIdx) => (
              <span key={wIdx} className="flex">
                {word.split("").map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      color: "#06b6d4",
                      textShadow: "0 0 25px rgba(6,182,212,0.8)",
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 12 }}
                    className="inline-block transition-colors duration-150 cursor-none origin-center"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>
          <p className="text-rose-200/80 text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed">
            A specialized stack focused on high performance, clean interfaces, and intelligent, LLM-powered backend processing.
          </p>
        </div>

        {/* 3D Cards Grid (align-start prevents grid row stretching to enable parallax) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl items-start">
          {CATEGORIES.map((cat, idx) => (
            <ScrollParallaxCol key={cat.title} index={idx}>
              <motion.div
                initial={{ opacity: 0, y: 80, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 1.0, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <TiltCard accentColor={cat.accent}>
                  {/* Header */}
                  <div className="flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border border-slate-100">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-3xl text-slate-900 leading-[0.95]">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Tech list items with premium micro-interactions */}
                  <div className="flex flex-col gap-5 my-8">
                    {cat.techs.map((tech) => (
                      <div key={tech.name} className="flex items-start gap-3 group/item cursor-none">
                        <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-emerald-accent group-hover/item:scale-125 group-hover/item:rotate-12 transition-transform duration-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex flex-col group-hover/item:translate-x-1.5 transition-transform duration-300">
                          <h4 className="text-sm font-semibold text-slate-800 tracking-tight transition-colors duration-200 group-hover/item:text-cyan-600">
                            {tech.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5 group-hover/item:text-slate-700 transition-colors duration-200">
                            {tech.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase border-t border-slate-100 pt-4 mt-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Enterprise Ready
                  </div>
                </TiltCard>
              </motion.div>
            </ScrollParallaxCol>
          ))}
        </div>
      </div>
    </section>
  );
}
