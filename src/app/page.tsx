import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import About from "@/components/About";
import Skills from "@/components/Skills";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Background grain noise layer */}
      <div className="bg-grain" />

      {/* Navigation Menu */}
      <Header />

      {/* Main Single Page Sections */}
      <main className="flex-1 w-full">
        {/* Fullscreen Hero Landing Area */}
        <Hero />

        {/* GSAP Scroll Story Pinned Component */}
        <ScrollStory />

        {/* About Grid and Counters */}
        <About />

        {/* Interactive 3D Skills Categories */}
        <Skills />

        {/* Running Tech Keyword Tracks */}
        <InfiniteMarquee />

        {/* Alternating Projects Showcase */}
        <Projects />

        {/* SVG Drawing Experience Timeline */}
        {/* <Timeline /> */}

        {/* Glass Form Contact Section */}
        <Contact />
      </main>

      {/* Back to top footer */}
      <Footer />
    </div>
  );
}
