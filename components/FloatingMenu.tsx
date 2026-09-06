"use client";

import { motion, AnimatePresence, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAudio } from "./AudioManager";

type SubItem = { name: string; id: string };
type MenuItem = { name: string; id: string; subItems?: SubItem[] };

const menuItems: MenuItem[] = [
  { name: "Home", id: "home" },
  {
    name: "About",
    id: "about",
    subItems: [
      { name: "Profile", id: "profile" },
      { name: "About Me", id: "about" },
    ],
  },
  {
    name: "Projects",
    id: "projects",
    subItems: [
      { name: "Projects", id: "projects" },
      { name: "GitHub", id: "github" },
      { name: "Widgets", id: "widgets" },
    ],
  },
  { name: "Activities", id: "activities" },
  { name: "Contact", id: "contact" },
];

const FOOTER_ID = "site-footer";

const allSectionIds = Array.from(
  new Set(
    menuItems.flatMap((item) => [
      item.id,
      ...(item.subItems?.map((s) => s.id) ?? []),
    ])
  )
);

function buildWavePath(phase: number, amplitude: number) {
  const width = 36;
  const height = 16;
  const points = 8;
  const step = width / points;

  const pts: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const x = i * step;
    const y = height / 2 + amplitude * Math.sin((i / points) * Math.PI * 2 + phase);
    pts.push([x, y]);
  }

  let d = `M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += ` Q ${x0.toFixed(2)},${y0.toFixed(2)} ${mx.toFixed(2)},${my.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0].toFixed(2)},${last[1].toFixed(2)}`;
  return d;
}

const PHASE_STEPS = 6;
const activeFrames = Array.from({ length: PHASE_STEPS + 1 }, (_, i) =>
  buildWavePath((i / PHASE_STEPS) * Math.PI * 2, 4.5)
);
const idleFrame = buildWavePath(0, 0.8);

function SoundToggleButton({ compact = false }: { compact?: boolean }) {
  const { isMuted, toggleMute } = useAudio();
  const frames = useMemo(() => (isMuted ? [idleFrame] : activeFrames), [isMuted]);

  return (
    <motion.button
      layout
      type="button"
      onClick={toggleMute}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
      className={`relative flex items-center justify-center gap-2 rounded-xl transition-all duration-300 overflow-hidden ${
        compact 
          ? "w-10 h-10 bg-white/10 text-white hover:bg-white/20" 
          : "px-3 py-1.5 h-10 bg-white/5 hover:bg-white/15 border border-white/10 text-white"
      }`}
    >
      <svg width="28" height="14" viewBox="0 0 36 16" fill="none" className="shrink-0">
        <motion.path
          d={frames[0]}
          animate={{ d: frames }}
          stroke={isMuted ? "#a1a1aa" : "#10b981"}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          transition={
            isMuted
              ? { duration: 0.35, ease: "easeOut" }
              : { duration: 1.6, repeat: Infinity, ease: "linear" }
          }
        />
      </svg>
      <AnimatePresence>
        {!compact && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-xs font-medium tracking-wide text-zinc-300 whitespace-nowrap ml-1"
          >
            {isMuted ? "OFF" : "ON"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring", bounce: 0, duration: 0.4, delayChildren: 0.05, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10, filter: "blur(5px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const mobileNavVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98], staggerChildren: 0.05 }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -10 }
};

const SCROLL_OFFSET = 110;

const smoothTransition = { 
  type: "spring" as const, 
  stiffness: 250, 
  damping: 28, 
  mass: 0.8,
  bounce: 0 
};

export default function FloatingMenu() {
  const [activeId, setActiveId] = useState("home");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = useState(false); 

  const isManualScroll = useRef(false);
  const manualScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    
    if (latest > 120 && diff > 8) {
      if (!isCompact) setIsCompact(true);
      if (isMobileOpen) setIsMobileOpen(false);
    } else if ((diff < -12 || latest <= 50) && latest > 0) {
      if (isCompact) setIsCompact(false);
    }
  });

  useEffect(() => {
    const handleGalleryToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
      setIsGalleryOpen(e.detail.isOpen);
      if (e.detail.isOpen) {
        setIsMobileOpen(false);
        setHoveredMenu(null);
        setMobileExpanded(null);
      }
    };
    window.addEventListener("gallery-fullscreen" as any, handleGalleryToggle);
    return () => window.removeEventListener("gallery-fullscreen" as any, handleGalleryToggle);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileOpen(false);
    setHoveredMenu(null);
    setIsCompact(false);

    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;

      isManualScroll.current = true;
      if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);

      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });

      setActiveId(id);

      manualScrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
      }, 1000);
    }, 150);
  };

  useEffect(() => {
    const sections = allSectionIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -60% 0px`, threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.getElementById(FOOTER_ID);
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsMobileOpen(false);
          setIsCompact(false);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const isItemActive = (item: MenuItem) => activeId === item.id || (item.subItems?.some((s) => s.id === activeId) ?? false);
  const shouldHide = isFooterVisible || isGalleryOpen; 

  return (
    <>
      {/* Desktop Menu */}
      <div className="fixed top-6 left-0 right-0 z-50 justify-center pointer-events-none hidden md:flex">
        <motion.nav
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: shouldHide ? -100 : 0, opacity: shouldHide ? 0 : 1 }}
          transition={smoothTransition}
          className={`pointer-events-auto flex items-center justify-between rounded-full bg-zinc-900/60 backdrop-blur-2xl border-t border-white/20 border-l border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.3)] ${
            isCompact ? "px-4 py-2 gap-4" : "px-6 py-2.5 w-[90%] max-w-5xl gap-4"
          }`}
          style={{ width: isCompact ? "auto" : undefined }}
        >
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2 group shrink-0">
            <motion.div layout transition={smoothTransition} className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-300 to-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-zinc-900 font-black text-sm">W.</span>
            </motion.div>
            <AnimatePresence mode="popLayout">
              {!isCompact && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden ml-1 flex items-center"
                >
                  <div className="text-white font-bold tracking-widest text-lg whitespace-nowrap">
                    {"WEBDEV".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence mode="popLayout">
            {!isCompact && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1 overflow-visible"
              >
                {menuItems.map((item) => (
                  <div key={item.id} className="relative" onMouseEnter={() => setHoveredMenu(item.id)} onMouseLeave={() => setHoveredMenu(null)}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                        isItemActive(item) ? "text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isItemActive(item) && (
                        <motion.div layoutId="desktop-liquid" className="absolute inset-0 bg-white/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] rounded-full border border-white/10" transition={smoothTransition} style={{ zIndex: -1 }} />
                      )}
                      {item.name}
                      {item.subItems && (
                        <motion.svg animate={{ rotate: hoveredMenu === item.id ? 180 : 0 }} className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      )}
                    </button>

                    <AnimatePresence>
                      {hoveredMenu === item.id && item.subItems && (
                        <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full mt-4 right-0 flex flex-col p-2 rounded-2xl bg-zinc-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl min-w-[180px]">
                          {item.subItems.map((sub) => (
                            <motion.button key={sub.id} variants={itemVariants} onClick={() => scrollToSection(sub.id)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeId === sub.id ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5 hover:pl-5"}`}>
                              {sub.name}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout transition={smoothTransition} className="flex items-center gap-3 shrink-0">
            <AnimatePresence mode="popLayout">
              {!isCompact && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-[1px] h-6 bg-white/15 mx-1" />}
            </AnimatePresence>
            <SoundToggleButton compact={isCompact} />
          </motion.div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:hidden">
        <motion.div
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: shouldHide ? -100 : 0, opacity: shouldHide ? 0 : 1 }}
          transition={smoothTransition}
          style={{ originY: 0, originX: 0.5 }}
          className={`pointer-events-auto flex flex-col overflow-hidden bg-zinc-900/85 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
            isCompact && !isMobileOpen ? "rounded-full w-[max-content]" : "rounded-[1.5rem] w-full max-w-sm"
          }`}
        >
          {/* Header Bar */}
          <motion.div layout transition={smoothTransition} className={`flex justify-between items-center ${isCompact && !isMobileOpen ? "px-2 py-2 gap-3" : "px-3 py-2 gap-4"}`}>
            <button onClick={() => { if (isCompact) setIsCompact(false); else scrollToSection("home"); }} className="flex items-center gap-2.5 shrink-0">
              <motion.div layout transition={smoothTransition} className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-300 to-white flex items-center justify-center shadow-md">
                <span className="text-zinc-900 font-black text-sm">W.</span>
              </motion.div>
              <AnimatePresence mode="popLayout">
                {(!isCompact || isMobileOpen) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden origin-left flex items-center"
                  >
                    <div className="text-white font-bold tracking-widest text-sm whitespace-nowrap">
                      {"WEBDEV".split("").map((char, index) => (
                        <motion.span
                          key={index}
                          animate={{ y: [-1.5, 1.5, -1.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <motion.div layout transition={smoothTransition} className="flex items-center gap-2 shrink-0">
              <AnimatePresence mode="popLayout">
                {(!isCompact || isMobileOpen) && (
                  <motion.div initial={{ opacity: 0, scale: 0, width: 0 }} animate={{ opacity: 1, scale: 1, width: "auto" }} exit={{ opacity: 0, scale: 0, width: 0 }} transition={{ duration: 0.3 }}>
                    <SoundToggleButton compact />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hamburger Button */}
              <button
                onClick={() => {
                  if (isCompact) setIsCompact(false);
                  setIsMobileOpen(!isMobileOpen);
                }}
                className="relative bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all border border-white/5"
              >
                <div className="flex flex-col items-center justify-center gap-1.5 w-5 h-5">
                  <motion.span animate={{ rotate: isMobileOpen ? 45 : 0, y: isMobileOpen ? 8 : 0 }} className="w-full h-[2px] bg-white rounded-full block transform-gpu origin-center transition-all duration-300" />
                  <motion.span animate={{ opacity: isMobileOpen ? 0 : 1, x: isMobileOpen ? 10 : 0 }} className="w-full h-[2px] bg-white rounded-full block transform-gpu transition-all duration-300" />
                  <motion.span animate={{ rotate: isMobileOpen ? -45 : 0, y: isMobileOpen ? -8 : 0 }} className="w-full h-[2px] bg-white rounded-full block transform-gpu origin-center transition-all duration-300" />
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Items List */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                variants={mobileNavVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-1.5 pt-4 pb-3 px-2 border-t border-white/10"
              >
                {menuItems.map((item) => (
                  <motion.div key={item.id} variants={mobileItemVariants} className="flex flex-col">
                    <button
                      onClick={() => {
                        if (item.subItems) {
                          setMobileExpanded(mobileExpanded === item.id ? null : item.id);
                        } else {
                          scrollToSection(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-[15px] transition-colors ${
                        isItemActive(item) ? "bg-white/10 text-white border border-white/5" : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.subItems && (
                        <motion.svg animate={{ rotate: mobileExpanded === item.id ? 180 : 0 }} className="w-4 h-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      )}
                    </button>

                    <AnimatePresence>
                      {item.subItems && mobileExpanded === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-1 mt-1.5 ml-4 pl-4 border-l border-white/10 overflow-hidden"
                        >
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => scrollToSection(sub.id)}
                              className={`text-left px-4 py-3 rounded-lg text-sm transition-all ${
                                activeId === sub.id ? "text-white font-semibold bg-white/5" : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}