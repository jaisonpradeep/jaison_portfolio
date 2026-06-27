"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { useLenisScrollProgress } from "./useLenisScroll";

interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  demo: string;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    title: "Resilience.Net",
    category: "AI Infrastructure Monitoring Platform",
    description:
      "A real-time AI infrastructure monitoring dashboard built for high-performance analytics. It visualizes system health, predictive insights, neural network activity, and streaming metrics with optimized rendering, delivering responsive performance and scalable architecture for modern AI workloads.",
    tech: ["React.js", "HTML5", "CSS3", "JavaScript", "Responsive Web Design","Node.js", "Express.js","Python","MongoDB Atlas","WebSockets (Socket.IO)","USGS Earthquake API","Open-Meteo API","NASA EONET API", "Scikit-learn", "XGBoost", "Random Forest", "Support Vector Machine (SVM)","NumPy", "Pandas"],
    image: "/images/resilience_net.png",
    github: "https://github.com/jaisonpradeep/ResilienceNet",
    demo: "https://resilience-net.vercel.app/",
    accent: "#6366f1",
  },
  {
    title: "Jasmine's Crotchet",
    category: "Web Development",
    description:
      "Jasmine's Crotchet is a modern full-stack e-commerce platform built for showcasing and selling handmade crochet products. The application provides customers with a seamless shopping experience, featuring product browsing, category-based filtering, detailed product pages, secure user authentication, shopping cart management, and a streamlined checkout process. An intuitive admin dashboard enables efficient product, inventory, and order management. Designed with a responsive, user-friendly interface and optimized performance, the platform demonstrates end-to-end full-stack development, secure RESTful APIs, database management, and scalable deployment practices.",
    tech: ["React.js","TypeScript","Vite","Tailwind CSS","React Router DOM","Node.js","Express.js","MongoDB Atlas", "Stripe Payment Gateway","JWT Authentication","Responsive Web Design", "RESTful APIs"],
    image: "/images/jasmines_crochet.png",
    github: "https://github.com/jaisonpradeep",
    demo: "#",
    accent: "#f59e0b",
  },
  {
    title: "Portfolio V1 Platform",
    category: "Web & UX Design",
    description:
      "Portfolio-V2 is a modern, high-performance developer portfolio website designed to showcase projects, technical skills, certifications, and professional experience through immersive animations and interactive UI. Built with a strong focus on responsive design, accessibility, and performance, the portfolio features smooth scrolling, scroll-triggered animations, dynamic project showcases, and seamless navigation. It serves as a personal brand platform where visitors can explore projects, download resumes, and connect through integrated contact forms and social media links.",
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP ScrollTrigger", "Lenis (Smooth Scrolling)","SMTP"],
    image: "/images/portfolio_v1.png",
    github: "https://github.com/jaisonpradeep",
    demo: "#",
    accent: "#10b981",
  },
];

/* ─── 3D card tilt ──────────────────────────────────────────────────────────── */

function useCardTilt(strength = 8) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 280,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 280,
    damping: 28,
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

/* ─── Tech tag ──────────────────────────────────────────────────────────────── */

function TechTag({ label, delay, accent }: { label: string; delay: number; accent: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.1, y: -2 }}
      style={{ borderColor: `${accent}40`, color: accent }}
      className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full border bg-white/70 backdrop-blur-sm shadow-sm cursor-default select-none"
    >
      {label}
    </motion.span>
  );
}

/* ─── Project card ──────────────────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useCardTilt(7);

  /* Lenis-driven parallax on the image — silky smooth */
  const rawProgress = useLenisScrollProgress(containerRef, [-90, 90]);
  const imgY = useSpring(rawProgress, { stiffness: 60, damping: 20 });

  const isEven = index % 2 === 0;

  /* Text stagger */
  const textVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      {/* 3-D tilt shell */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative w-full rounded-[40px] overflow-hidden bg-white border border-slate-200/60 shadow-[0_8px_70px_-12px_rgba(0,0,0,0.13)] group"
      >
        {/* Hover glow ring */}
        <motion.div
          className="absolute inset-0 rounded-[40px] pointer-events-none z-0 transition-shadow duration-500"
          whileHover={{
            boxShadow: `0 0 0 2px ${project.accent}55, 0 0 90px 0 ${project.accent}18`,
          }}
        />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 overflow-hidden rounded-[40px]">
          <div
            className="absolute -inset-full animate-shimmer-sweep"
            style={{
              background: `linear-gradient(110deg, transparent 30%, ${project.accent}18 50%, transparent 70%)`,
            }}
          />
        </div>

        {/* Inner grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px] lg:min-h-[680px]">
          {/* ── Text pane ────────────────────────────────────────────────── */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col justify-center px-10 py-14 md:px-14 md:py-16 z-10 relative ${
              isEven ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {/* Index + category */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-black font-mono text-white shadow-lg"
                style={{ background: project.accent }}
              >
                0{index + 1}
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] font-mono"
                style={{ color: project.accent }}
              >
                {project.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              variants={itemVariants}
              className="font-display font-black text-5xl md:text-6xl xl:text-7xl text-slate-900 leading-[0.95] mb-5"
            >
              {project.title}
            </motion.h3>

            {/* Accent divider */}
            <motion.div
              variants={itemVariants}
              className="w-12 h-[3px] rounded-full mb-6"
              style={{ background: project.accent }}
            />

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 font-sans max-w-lg"
            >
              {project.description}
            </motion.p>

            {/* Tech tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t, i) => (
                <TechTag key={t} label={t} delay={i * 0.06} accent={project.accent} />
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Magnetic strength={0.35} range={50}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none cursor-none"
                  style={{ borderColor: project.accent, color: project.accent }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = project.accent;
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = project.accent;
                  }}
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              </Magnetic>

              <Magnetic strength={0.35} range={50}>
                <a
                  href={project.demo}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide text-white shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none cursor-none"
                  style={{
                    background: `linear-gradient(135deg, ${project.accent}, ${project.accent}bb)`,
                    boxShadow: `0 8px 30px -6px ${project.accent}80`,
                  }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Live Demo
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ── Image pane ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className={`relative overflow-hidden min-h-[380px] lg:min-h-0 ${
              isEven ? "lg:order-2 rounded-r-[40px]" : "lg:order-1 rounded-l-[40px]"
            }`}
          >
            {/* Lenis-synced parallax image */}
            <div className="absolute inset-0 w-full h-[130%] -top-[15%]">
              <motion.img
                style={{ y: imgY }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover will-change-transform"
              />
            </div>

            {/* Tint overlay */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
              style={{ background: project.accent }}
            />

            {/* Bottom dark vignette */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

            {/* Hover circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-20 h-20 rounded-full backdrop-blur-xl border border-white/30 bg-white/20 flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Bottom chip */}
            <div className="absolute bottom-5 left-5 z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: project.accent }}
                />
                <span className="text-[11px] font-mono font-bold text-white/90 uppercase tracking-widest">
                  {project.category}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────────── */

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-28 md:py-40 bg-white overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-20%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, -24, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[5%] left-[-15%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], y: [0, 16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-[50%] left-[30%] w-[40vw] h-[40vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-10 xl:px-16 relative z-10 max-w-[1400px]">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-black uppercase font-mono text-indigo-400 mb-5 inline-block"
          >
            // SELECTED PORTFOLIO
          </motion.span>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl sm:text-8xl md:text-9xl xl:text-[10rem] font-black tracking-tight text-slate-900 font-display leading-none"
            >
              Featured Works
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mt-6"
          >
            A handpicked selection of commercial applications, engineering
            exercises, and open-source contributions.
          </motion.p>
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-10 md:gap-14">
          {PROJECTS.map((proj, idx) => (
            <ProjectCard key={proj.title} project={proj} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
