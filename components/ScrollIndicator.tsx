"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

const sections = [
  { 
    id: "home", 
    label: "Home", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) 
  },
  { 
    id: "profile", 
    label: "Profile", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) 
  },
  { 
    id: "about", 
    label: "About", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) 
  },
  { 
    id: "projects", 
    label: "Projects", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ) 
  },
  { 
    id: "activities", 
    label: "Activities", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ) 
  },
  { 
    id: "gallery", 
    label: "Gallery", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) 
  },
  { 
    id: "github", 
    label: "GitHub", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) 
  },
  { 
    id: "widgets", 
    label: "Widgets", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ) 
  },
  { 
    id: "contact", 
    label: "Contact", 
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ) 
  },
];

const smoothSpring = { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.8 };

let audioCtx: AudioContext | null = null;

const playSound = (type: "tick" | "pop" | "swoosh") => {
  try {
    if (typeof window === "undefined") return;
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "tick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "pop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "swoosh") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.error("Audio block by browser");
  }
};

export default function ScrollIndicator() {
  const [isMobile, setIsMobile] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false); // 🌟 State สำหรับคุมการซ่อน/แสดงเมื่อเปิด Modal ดูรูป
  
  const [activeWidget, setActiveWidget] = useState<{ id: string; label: string; icon: ReactElement } | null>(null);
  const widgetTimeout = useRef<NodeJS.Timeout | null>(null);

  const prevSection = useRef(activeSection);
  const prevIsAtTop = useRef(isAtTop);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleHeroState = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsHeroExpanded(customEvent.detail.expanded);
    };
    
    window.addEventListener("hero-state", handleHeroState);
    return () => window.removeEventListener("hero-state", handleHeroState);
  }, []);

  // 🌟 useEffect สำหรับดักฟัง Event การเปิดรูปเต็มจอ/โปรเจกต์
  useEffect(() => {
    const handleUiState = (e: Event) => {
      const { isHidden } = (e as CustomEvent).detail;
      setIsUiHidden(isHidden);
      
      if (isHidden) {
        playSound("swoosh");
      } else {
        playSound("pop");
      }
    };
    
    window.addEventListener("ui-state", handleUiState);
    return () => window.removeEventListener("ui-state", handleUiState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) return;

      setIsAtTop(window.scrollY < 30);

      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);

      const footer = document.getElementById("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setIsVisible(footerRect.top > window.innerHeight - 100);
      } else {
        const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
        setIsVisible(!isBottom);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  useEffect(() => {
    if (isHeroExpanded || isMobile) return;

    if (prevSection.current !== activeSection) {
      playSound("tick");
      prevSection.current = activeSection;

      const sectionData = sections.find((s) => s.id === activeSection);
      if (sectionData) {
        setActiveWidget(sectionData);
        playSound("pop");

        if (widgetTimeout.current) clearTimeout(widgetTimeout.current);
        widgetTimeout.current = setTimeout(() => {
          setActiveWidget(null);
        }, 2000);
      }
    }
  }, [activeSection, isHeroExpanded, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    if (prevIsAtTop.current !== isAtTop) {
      playSound("swoosh");
      prevIsAtTop.current = isAtTop;
    }
  }, [isAtTop, isMobile]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isHeroExpanded || isMobile) return null;

  return (
    <MotionConfig transition={smoothSpring}>
      <AnimatePresence>
        {/* 🌟 เพิ่มเงื่อนไข !isUiHidden */}
        {activeWidget && !isUiHidden && (
          <motion.div
            key={activeWidget.id}
            initial={{ opacity: 0, x: isAtTop ? -15 : 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
            className={`fixed z-[90] flex items-center gap-3 px-3.5 py-2 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-white/10 shadow-xl ${
              isAtTop ? "bottom-24 left-8" : "bottom-10 right-20"
            }`}
          >
            <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 text-zinc-300">
              {activeWidget.icon}
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider leading-none mb-1">
                Section
              </span>
              <span className="text-xs font-semibold text-zinc-200 tracking-wide leading-tight">
                {activeWidget.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 🌟 เพิ่มเงื่อนไข !isUiHidden */}
        {isVisible && !isUiHidden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            className={`fixed z-[100] flex p-1.5 rounded-full bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-colors duration-500 ${
              isAtTop
                ? "bottom-8 left-8 flex-row gap-1"
                : "top-0 bottom-0 my-auto right-4 md:right-6 h-max w-max flex-col gap-2"
            }`}
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const isHovered = hoveredSection === section.id;

              return (
                <motion.button
                  layout
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`relative flex items-center justify-center focus:outline-none group rounded-full overflow-hidden ${
                    isAtTop && isActive ? "h-8 px-4" : "w-8 h-8"
                  }`}
                  aria-label={`Scroll to ${section.label}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGlassPill"
                      className="absolute inset-0 bg-white/90 shadow-sm rounded-full"
                    />
                  )}

                  <motion.div layout className="relative z-10 flex items-center gap-2">
                    <motion.div
                      layout
                      animate={{
                        backgroundColor: isActive ? "#09090b" : "rgba(255, 255, 255, 0.3)",
                        scale: isActive ? 1 : isHovered ? 1.3 : 0.85,
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                    />

                    <AnimatePresence>
                      {isAtTop && isActive && (
                        <motion.span
                          initial={{ opacity: 0, x: -8, width: 0 }}
                          animate={{ opacity: 1, x: 0, width: "auto" }}
                          exit={{ opacity: 0, x: -4, width: 0 }}
                          className="text-[12px] font-semibold tracking-wide text-zinc-950 whitespace-nowrap overflow-hidden"
                        >
                          {section.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence>
                    {!isAtTop && isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: 8, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 4, scale: 0.95 }}
                        className="absolute right-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-white/10 text-zinc-200 text-[11px] font-medium tracking-wide shadow-xl whitespace-nowrap pointer-events-none"
                      >
                        <span className="text-zinc-400">{section.icon}</span>
                        {section.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}