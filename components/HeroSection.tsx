"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAudio } from "./AudioManager";

const IMAGES = [
  "/me.jpg", 
  "/me/me3.png",
  "/me/me4.png"
];

const NAV_ITEMS = [
  { id: "01", label: "Profile", href: "#profile" },
  { id: "02", label: "About", href: "#about" },
  { id: "03", label: "Projects", href: "#projects" },
  { id: "04", label: "Contact", href: "#contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// 💡 เสียงสไตล์นุ่มนวล (Soft Pop & Clean Tick)
const SOUNDS = {
  click: "https://www.soundjay.com/buttons/sounds/button-09a.mp3", 
  hover: "https://www.soundjay.com/buttons/sounds/button-07.mp3"  
};

const playUISound = (type: "click" | "hover") => {
  if (typeof window !== "undefined") {
    try {
      const audio = new Audio(SOUNDS[type]);
      audio.volume = type === "click" ? 0.3 : 0.05;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn("Audio playback failed", error);
    }
  }
};

export default function HeroSection() {
  const [expanded, setExpanded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const { changeSound } = useAudio();
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 }); 

  useEffect(() => {
    if (expanded) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [expanded]);

  const handleExpand = () => {
    playUISound("click");
    setExpanded(true);
    changeSound("explore");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero-state", { detail: { expanded: true } }));
    }
  };

  const handleCollapse = () => {
    playUISound("click");
    setExpanded(false);
    changeSound("home");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero-state", { detail: { expanded: false } }));
    }
  };

  return (
    <section
      ref={sectionRef}
      data-sound={expanded ? "explore" : "home"}
      className={`relative flex min-h-screen w-full items-end justify-center overflow-hidden transition-colors duration-1000 ${
        expanded ? "bg-zinc-950" : "bg-zinc-50"
      }`}
    >
      <AnimatePresence mode="sync" initial={false}>
        {!expanded ? (
          <motion.div
            key="collapsed"
            className="absolute inset-0 z-10 flex items-end justify-center"
          >
            <div className="pointer-events-none absolute left-0 top-1/2 z-0 flex -translate-y-1/2 whitespace-nowrap opacity-[0.04]">
              <motion.div
                layoutId="marquee-text"
                transition={{ duration: 1, ease: EASE }}
                className="flex"
              >
                <MarqueeLoop />
              </motion.div>
            </div>

            <motion.button
              type="button"
              onClick={handleExpand}
              onMouseEnter={() => playUISound("hover")}
              initial={{ opacity: 0, y: 150, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: 150,
                filter: "blur(15px)",
                transition: { duration: 0.6, ease: EASE },
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
              className="group relative z-10 flex h-[65vh] w-[90vw] max-w-[500px] cursor-pointer items-end justify-center md:h-[95vh] md:w-[750px]"
              aria-label="Open full profile"
            >
              <div className="relative flex h-full w-full items-end justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={imgIndex}
                    src={IMAGES[imgIndex]}
                    alt={`My Profile ${imgIndex + 1}`}
                    // 💡 เปลี่ยนรูปแบบการเปลี่ยนรูปเป็น Blur + Slide พรีเมียมๆ
                    initial={{ opacity: 0, y: 40, scale: 1.05, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(12px)" }}
                    transition={{ duration: 1.2, ease: EASE }}
                    className="absolute max-h-full max-w-full origin-bottom transform object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] md:scale-125"
                  />
                </AnimatePresence>
              </div>

              <div className="absolute bottom-6 flex gap-2 z-20 md:bottom-10">
                {IMAGES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${
                      i === imgIndex ? "w-6 bg-black/60 md:bg-white/80" : "w-1.5 bg-black/20 md:bg-white/30"
                    }`} 
                  />
                ))}
              </div>

              <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2 scale-90 rounded-full bg-black/60 px-5 py-2 text-sm text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 z-30">
                Click to Expand
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="absolute inset-0 z-20 flex flex-col items-center justify-end"
          >
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.6 } }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              src="/hero-bg.mp4"
              poster="/hero-bg-poster.jpg"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-zinc-950/40 mix-blend-multiply"
            />
            
            <motion.div className="relative z-20 flex w-full max-w-3xl flex-col items-center px-6 pb-48 text-center text-white">
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.3 } }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium tracking-wide backdrop-blur-md md:text-sm"
              >
                Building robust full-stack systems with product-level clarity.
              </motion.span>

              <motion.div
                layoutId="marquee-text"
                transition={{ duration: 1, ease: EASE }}
                className="relative py-2"
              >
                {/* 💡 คอมโพเนนต์ตัวอักษรใหม่ */}
                <StaggeredText text="HI! I AM Wia" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.3 } }}
                transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
                className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base"
              >
                A computer science student with hands-on full-stack experience,
                building functional applications from initial idea to
                production-style interfaces.
              </motion.p>

              <motion.nav className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={handleCollapse} 
                    onMouseEnter={() => playUISound("hover")}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: EASE }}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/90 transition-all hover:bg-white/15 hover:pr-4"
                  >
                    <span className="text-white/40 transition-colors group-hover:text-white/70">{item.id}</span>
                    {item.label}
                    <span className="translate-x-0 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden>
                      ↗
                    </span>
                  </motion.a>
                ))}
              </motion.nav>
            </motion.div>

            <StatusBar onNavClick={handleCollapse} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="fixed bottom-20 right-6 z-50 md:bottom-24 md:right-10"
          >
            <div
              className={`flex items-center gap-6 ${
                expanded ? "text-white" : "text-zinc-900"
              }`}
            >
              <button
                onClick={handleCollapse}
                onMouseEnter={() => playUISound("hover")}
                className={`relative pb-1.5 text-xs font-bold uppercase tracking-widest transition-opacity duration-300 md:text-sm ${
                  !expanded ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                Portrait
                {!expanded && (
                  <motion.div
                    layoutId="active-line"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-current"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={handleExpand}
                onMouseEnter={() => playUISound("hover")}
                className={`relative pb-1.5 text-xs font-bold uppercase tracking-widest transition-opacity duration-300 md:text-sm ${
                  expanded ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                Explore
                {expanded && (
                  <motion.div
                    layoutId="active-line"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-current"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// 💡 เอฟเฟกต์ตัวหนังสือแบบแยกตัวอักษร เคลื่อนไหวสมูทและสะอาดตา
function StaggeredText({ text }: { text: string }) {
  const words = text.split(" ");
  
  return (
    <h1 className="flex flex-wrap justify-center gap-x-3 font-mono text-5xl font-black uppercase tracking-tight text-white md:gap-x-5 md:text-7xl">
      {words.map((word, i) => (
        <span key={i} className="flex">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{
                duration: 0.8,
                ease: EASE,
                delay: 0.4 + (i * 0.1) + (j * 0.04) // ไล่ระดับความหน่วงแต่ละตัวอักษร
              }}
              className="inline-block bg-[linear-gradient(180deg,#fff,#a1a1aa)] bg-clip-text text-transparent drop-shadow-sm"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function MarqueeLoop() {
  const text = "CREATIVE DEVELOPER • UI/UX DESIGNER • NEXT.JS EXPERT • ";
  return (
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      className="flex"
    >
      <h2 className="mr-8 text-[100px] font-black uppercase tracking-tighter text-zinc-900 md:text-[220px]">
        {text}
      </h2>
      <h2 className="text-[100px] font-black uppercase tracking-tighter text-zinc-900 md:text-[220px]">
        {text}
      </h2>
    </motion.div>
  );
}

function StatusBar({ onNavClick }: { onNavClick: () => void }) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      className="absolute bottom-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-black/40 px-6 py-4 font-mono text-xs text-white/60 backdrop-blur-md"
    >
      <span>
        Home. {time} — Phnom Penh, KH
      </span>
      <span className="flex gap-6">
        <a href="#profile" onClick={onNavClick} onMouseEnter={() => playUISound("hover")} className="transition-colors hover:text-white">profile</a>
        <a href="#about" onClick={onNavClick} onMouseEnter={() => playUISound("hover")} className="transition-colors hover:text-white">about</a>
        <a href="#projects" onClick={onNavClick} onMouseEnter={() => playUISound("hover")} className="transition-colors hover:text-white">projects</a>
        <a href="#contact" onClick={onNavClick} onMouseEnter={() => playUISound("hover")} className="transition-colors hover:text-white">contact</a>
      </span>
    </motion.div>
  );
}