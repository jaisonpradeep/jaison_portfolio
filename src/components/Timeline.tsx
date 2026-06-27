"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface TimelineItem {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
}

const EXPERIENCE: TimelineItem[] = [
  {
    role: "Lead AI Engineer & Full Stack Developer",
    company: "Aura Labs",
    period: "2024 - Present",
    location: "Bangalore, India (Remote)",
    points: [
      "Leading engineering of autonomous multi-agent pipelines utilizing LangChain and FastAPI to process thousands of daily documents.",
      "Architected Next.js 15 dashboards with React Server Components, decreasing initial bundle load sizes by 35% and improving Web Vitals scores.",
      "Integrated secure Model Context Protocol (MCP) servers enabling LLMs to safely query database tables and call localized script functions.",
    ],
  },
  {
    role: "Senior Full Stack Engineer",
    company: "Nexus Tech",
    period: "2022 - 2024",
    location: "Mumbai, India",
    points: [
      "Built scalable microservice architectures using Node.js, Express, and PostgreSQL, handling concurrent traffic peaks of 5k+ requests.",
      "Designed and deployed Retrieval-Augmented Generation (RAG) models, employing vector chunking strategies and cosine-similarity searches.",
      "Configured robust CI/CD actions and Dockerized deployments on AWS EC2/ECS, lowering infrastructure costs by 22%.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Synapse Solutions",
    period: "2020 - 2022",
    location: "Bangalore, India",
    points: [
      "Developed interactive data visualization modules and dashboards using React, Tailwind CSS, and Chart.js.",
      "Optimized legacy database queries and implemented Redis caching, resulting in a 45% reduction in API response latency.",
      "Collaborated with UX teams to implement micro-animations and smooth page transitions, boosting user retention metrics by 18%.",
    ],
  },
];

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 last:mb-0 w-full">
      {/* Spacer or Left Column (Desktop) */}
      <div className={`hidden md:block w-[45%] ${isEven ? "text-right order-1" : "order-2"}`}>
        {isEven && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end"
          >
            <div className="flex items-center gap-2 text-electric-blue font-mono font-bold text-xs uppercase mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {item.period}
            </div>
            <h3 className="font-display font-bold text-slate-900 text-xl mb-1">{item.role}</h3>
            <span className="text-sm font-semibold text-slate-500 mb-2">{item.company}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <MapPin className="w-3 h-3" />
              {item.location}
            </div>
          </motion.div>
        )}
      </div>

      {/* Center Icon/Node */}
      <div className="absolute left-4 md:left-1/2 md:-ml-6 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-slate-200 shadow-sm z-20 order-2 md:order-1 text-slate-600 transition-colors duration-500 hover:border-electric-blue hover:text-electric-blue">
        <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      {/* Right Column (Desktop) */}
      <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${isEven ? "order-2 md:order-2" : "order-1 md:text-left"}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 rounded-3xl"
        >
          {/* Mobile Calendar details */}
          <div className="flex md:hidden items-center gap-1.5 text-electric-blue font-mono font-bold text-[11px] uppercase mb-2">
            <Calendar className="w-3 h-3" />
            {item.period}
          </div>
          
          <div className="block md:hidden">
            <h3 className="font-display font-bold text-slate-900 text-lg">{item.role}</h3>
            <span className="text-xs font-semibold text-slate-500">{item.company}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium my-2">
              <MapPin className="w-3 h-3" />
              {item.location}
            </div>
          </div>

          {!isEven && (
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-electric-blue font-mono font-bold text-xs uppercase mb-2">
                <Calendar className="w-3.5 h-3.5" />
                {item.period}
              </div>
              <h3 className="font-display font-bold text-slate-900 text-xl mb-1">{item.role}</h3>
              <span className="text-sm font-semibold text-slate-500 mb-3 block">{item.company}</span>
            </div>
          )}

          <ul className="flex flex-col gap-2.5 text-slate-500 text-xs md:text-sm leading-relaxed list-none pl-0">
            {item.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative min-h-screen py-24 md:py-32 w-full bg-pearl overflow-hidden flex items-center"
    >
      {/* Aurora Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-purple-100/15 to-transparent blur-3xl" />
        <div className="absolute bottom-[10%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-radial from-cyan-100/20 to-transparent blur-3xl animate-float-slow" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-2xl mb-24 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-electric-blue font-mono mb-4 inline-block">
            // CAREER TRACK
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 font-display mb-4">
            Professional Experience
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            A chronological timeline of roles in full-stack architecture, machine learning integrations, and digital design.
          </p>
        </div>

        {/* Timeline Tracks */}
        <div className="relative w-full max-w-5xl">
          {/* Vertical Drawing SVG Path Line */}
          <div className="absolute left-[30px] md:left-1/2 md:-ml-[1.5px] top-4 bottom-4 w-[3px] pointer-events-none z-10 overflow-hidden">
            {/* Background path line */}
            <div className="absolute inset-0 w-full h-full bg-slate-200/50 rounded-full" />
            
            {/* Dynamic Spring-Drawn path line */}
            <motion.div
              style={{ scaleY: pathLength, originY: 0 }}
              className="absolute inset-0 w-full bg-gradient-to-b from-electric-blue via-purple-accent to-pink-accent rounded-full"
            />
          </div>

          {/* Experience Cards */}
          <div className="flex flex-col relative w-full">
            {EXPERIENCE.map((item, idx) => (
              <TimelineCard key={item.role + idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
