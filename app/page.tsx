"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FloatingMenu from "@/components/FloatingMenu";
import AboutSection from "@/components/AboutSection";
import ProfileSection from "@/components/ProfileSection";
import ProjectsSection from "@/components/ProjectsSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import GithubProjectsSection from "@/components/GithubProjectsSection";
import GallerySection from "@/components/GallerySection";
import WidgetsSection from "@/components/WidgetsSection";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { AudioProvider } from "@/components/AudioManager";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import ScrollIndicator from "@/components/ScrollIndicator";

function ScrollTextLines() {
  const marqueeItems = [
    "FEATURED PROJECTS",
    "•",
    "UI/UX DESIGN",
    "•",
    "FULL-STACK DEVELOPMENT",
    "•",
    "CREATIVE CODE",
    "•",
    "SYSTEM ARCHITECTURE",
    "•",
  ];

  return (
    <div className="relative w-full py-10 bg-zinc-950 overflow-hidden border-y border-zinc-800/80 z-10">
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex items-center gap-8 text-3xl sm:text-5xl font-black font-mono uppercase tracking-widest text-zinc-700/60 select-none pr-8"
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className={item === "•" ? "text-emerald-500/80" : "hover:text-emerald-400 transition-colors"}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden mt-3">
        <motion.div
          animate={{ x: ["-50%", 0] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex items-center gap-8 text-2xl sm:text-4xl font-bold font-mono uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-700 opacity-40 select-none pr-8"
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className={item === "•" ? "text-indigo-500" : ""}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AudioProvider>
      <PageLoader onFinish={() => setIsLoading(false)} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative bg-zinc-50"
      >
        <section id="home" data-sound="home">
          <HeroSection />
        </section>

        <section id="profile" data-sound="profile">
          <ProfileSection />
        </section>

        <section id="about" data-sound="about">
          <AboutSection />
        </section>
        
        <div className="h-[20rem] flex items-center justify-center bg-zinc-950 w-full overflow-hidden">
          <TextHoverEffect text="PORTFOLIO" />
        </div>

        <ScrollTextLines />

        <section id="projects" data-sound="projects">
          <ProjectsSection />
        </section>

        <section id="activities" data-sound="activities">
          <ActivitiesSection />
        </section>

        {/* 1. Gallery Section นำหน้าก่อน */}
        <section id="gallery" data-sound="gallery">
          <GallerySection />
        </section>

        <ScrollTextLines />

        {/* 3. Github Projects Section */}
        <section id="github" data-sound="github">
          <GithubProjectsSection />
        </section>

        <section id="widgets" data-sound="widgets">
          <WidgetsSection />
        </section>

        <ScrollIndicator />

        <FloatingMenu />

        <section id="contact" data-sound="widgets">
          <Footer />
        </section>
      </motion.main>
    </AudioProvider>
  );
}