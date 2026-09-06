"use client";

import { motion, AnimatePresence, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
const BRAND_NAME = "wiayouhi";

let uiAudioContext: AudioContext | null = null;

const allSectionIds = Array.from(
  new Set(
    menuItems.flatMap((item) => [
      item.id,
      ...(item.subItems?.map((s) => s.id) ?? []),
    ])
  )
);

function playUiSound(type: "pop" | "click" | "hover" | "compact" | "toggle", isMuted: boolean) {
  if (isMuted || typeof window === "undefined" || document.visibilityState !== "visible") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    uiAudioContext ??= new AudioCtx();
    const ctx = uiAudioContext;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "pop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === "compact") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "toggle") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    }

    osc.addEventListener("ended", () => {
      osc.disconnect();
      gain.disconnect();
    }, { once: true });
  } catch {}
}

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

  const handleToggle = () => {
    playUiSound("toggle", isMuted);
    toggleMute();
  };

  return (
    <motion.button
      layout
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
      className={`relative flex items-center justify-center gap-2 rounded-full transition-colors duration-500 overflow-hidden ${
        compact 
          ? "w-9 h-9 bg-black/5 text-zinc-800 hover:bg-black/10 border border-black/5" 
          : "px-3 py-1.5 h-9 bg-black/5 hover:bg-black/10 border border-black/5 text-zinc-800"
      }`}
    >
      <svg width="26" height="13" viewBox="0 0 36 16" fill="none" className="shrink-0">
        <motion.path
          d={frames[0]}
          animate={{ d: frames }}
          stroke={isMuted ? "#a1a1aa" : "#059669"}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          transition={
            isMuted
              ? { duration: 0.5, ease: "easeOut" }
              : { duration: 1.8, repeat: Infinity, ease: "linear" }
          }
        />
      </svg>
      <AnimatePresence>
        {!compact && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-xs font-bold tracking-wider text-zinc-600 whitespace-nowrap ml-0.5"
          >
            {isMuted ? "OFF" : "ON"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// อนิเมชันสมูทขึ้น: ลดความแข็ง เพิ่มความลื่นไหลในการยืดหด
const fluidSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
  mass: 0.7,
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 24, delayChildren: 0.05, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 10, scale: 0.95, filter: "blur(8px)", transition: { duration: 0.2, ease: "easeOut" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10, filter: "blur(5px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 250, damping: 20 } },
};

const mobileNavVariants: Variants = {
  hidden: { opacity: 0, height: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.98,
    transition: { duration: 0.35, ease: "easeInOut" }
  }
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
  exit: { opacity: 0, x: -10 }
};

const SCROLL_OFFSET = 110;

export default function FloatingMenu() {
  const [activeId, setActiveId] = useState("home");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { isMuted } = useAudio();
  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = useState(false);

  const isManualScroll = useRef(false);
  const manualScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    
    if (latest > 120 && diff > 8) {
      if (!isCompact) {
        setIsCompact(true);
        playUiSound("compact", isMuted);
      }
      if (isMobileOpen) setIsMobileOpen(false);
    } else if ((diff < -12 || latest <= 50) && latest > 0) {
      if (isCompact) {
        setIsCompact(false);
        playUiSound("compact", isMuted);
      }
    }
  });

  useEffect(() => {
    const handleGalleryToggle = (event: Event) => {
      const isOpen = (event as CustomEvent<{ isOpen: boolean }>).detail.isOpen;
      setIsGalleryOpen(isOpen);
      if (isOpen) {
        setIsMobileOpen(false);
        setHoveredMenu(null);
        setMobileExpanded(null);
      }
    };
    window.addEventListener("gallery-fullscreen", handleGalleryToggle);
    return () => window.removeEventListener("gallery-fullscreen", handleGalleryToggle);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    playUiSound("click", isMuted);
    setIsMobileOpen(false);
    setHoveredMenu(null);

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
  }, [isMuted]);

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

  useEffect(() => {
    return () => {
      if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    };
  }, []);

  const isItemActive = (item: MenuItem) => activeId === item.id || (item.subItems?.some((s) => s.id === activeId) ?? false);
  const shouldHide = isFooterVisible || isGalleryOpen;

  return (
    <>
      {/* Desktop Menu */}
      <div className="fixed top-6 left-0 right-0 z-50 justify-center pointer-events-none hidden md:flex">
        <motion.nav
          layout
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{
            y: shouldHide ? -100 : 0,
            opacity: shouldHide ? 0 : 1,
            scale: shouldHide ? 0.95 : 1,
          }}
          transition={fluidSpring}
          // เปลี่ยนเป็น Light Glassmorphism
          className={`pointer-events-auto flex items-center justify-between rounded-full bg-white/40 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${
            isCompact 
              ? "px-3 py-1.5 min-w-[160px] gap-3" 
              : "px-6 py-2.5 w-[90%] max-w-5xl gap-4"
          }`}
        >
          {/* Logo Brand */}
          <motion.button
            layout="position"
            onClick={() => scrollToSection("home")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <motion.div
              layout
              transition={fluidSpring}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 flex items-center justify-center shadow-md group-hover:shadow-black/20 transition-all duration-500"
            >
              <span className="text-white font-black text-sm tracking-tighter">W.</span>
            </motion.div>
            <AnimatePresence mode="popLayout">
              {!isCompact && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden ml-0.5 flex items-center"
                >
                  <div className="text-zinc-900 font-black tracking-widest text-base whitespace-nowrap">
                    {BRAND_NAME.split("").map((char, index) => (
                      <motion.span
                        key={index}
                        animate={{ y: [-1, 1, -1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Navigation Items */}
          <AnimatePresence mode="popLayout">
            {!isCompact && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-1 overflow-visible"
              >
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredMenu(item.id);
                      playUiSound("hover", isMuted);
                    }}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-1.5 ${
                        isItemActive(item) ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {isItemActive(item) && (
                        <motion.div
                          layoutId="desktop-liquid"
                          className="absolute inset-0 bg-white/70 shadow-[inset_0_1px_3px_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] rounded-full border border-white/80"
                          transition={fluidSpring}
                          style={{ zIndex: -1 }}
                        />
                      )}
                      {item.name}
                      {item.subItems && (
                        <motion.svg
                          animate={{ rotate: hoveredMenu === item.id ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 250, damping: 20 }}
                          className="w-3.5 h-3.5 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      )}
                    </button>

                    {/* Submenu Dropdown (Light Glass) */}
                    <AnimatePresence>
                      {hoveredMenu === item.id && item.subItems && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full mt-3 right-0 flex flex-col p-2 rounded-2xl bg-white/60 backdrop-blur-3xl backdrop-saturate-[200%] border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.1)] min-w-[180px] z-50"
                        >
                          {item.subItems.map((sub) => (
                            <motion.button
                              key={sub.id}
                              variants={itemVariants}
                              whileHover={{ x: 4 }}
                              onClick={() => scrollToSection(sub.id)}
                              className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeId === sub.id ? "text-zinc-900 bg-white/80 shadow-sm" : "text-zinc-500 hover:text-zinc-900 hover:bg-white/40"
                              }`}
                            >
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

          {/* Sound Toggle */}
          <motion.div layout="position" transition={fluidSpring} className="flex items-center gap-2 shrink-0">
            <AnimatePresence mode="popLayout">
              {!isCompact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-[1px] h-5 bg-black/10 mx-1"
                />
              )}
            </AnimatePresence>
            <SoundToggleButton compact={isCompact} />
          </motion.div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:hidden">
        <motion.div
          layout
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{
            y: shouldHide ? -100 : 0,
            opacity: shouldHide ? 0 : 1,
            scale: shouldHide ? 0.95 : 1,
          }}
          transition={fluidSpring}
          style={{ transformOrigin: "top center" }}
          // Light Glassmorphism for Mobile
          className={`pointer-events-auto flex flex-col overflow-hidden bg-white/50 backdrop-blur-3xl backdrop-saturate-[180%] border border-white/60 shadow-[0_15px_40px_rgba(0,0,0,0.12)] ${
            isCompact && !isMobileOpen
              ? "rounded-full w-auto min-w-[130px] px-2 py-1.5"
              : "rounded-[1.75rem] w-full max-w-sm p-1.5"
          }`}
        >
          {/* Header Bar */}
          <motion.div
            layout="position"
            transition={fluidSpring}
            className={`flex items-center justify-between ${
              isCompact && !isMobileOpen ? "gap-2" : "gap-3 px-2 py-1"
            }`}
          >
            <button
              onClick={() => {
                if (isCompact) {
                  setIsCompact(false);
                  playUiSound("compact", isMuted);
                } else {
                  scrollToSection("home");
                }
              }}
              className="flex items-center gap-2.5 shrink-0 active:scale-95 transition-transform"
            >
              <motion.div
                layout
                transition={fluidSpring}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 flex items-center justify-center shadow-md"
              >
                <span className="text-white font-black text-xs">W.</span>
              </motion.div>
              <AnimatePresence mode="popLayout">
                {(!isCompact || isMobileOpen) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden origin-left flex items-center"
                  >
                    <div className="text-zinc-900 font-black tracking-widest text-xs whitespace-nowrap">
                      {BRAND_NAME.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          animate={{ y: [-1, 1, -1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
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

            <motion.div layout="position" transition={fluidSpring} className="flex items-center gap-2 shrink-0">
              <AnimatePresence mode="popLayout">
                {(!isCompact || isMobileOpen) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SoundToggleButton compact />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hamburger Toggle Button (Light Theme) */}
              <button
                onClick={() => {
                  playUiSound("pop", isMuted);
                  if (isCompact) setIsCompact(false);
                  setIsMobileOpen(!isMobileOpen);
                }}
                className="relative bg-black/5 hover:bg-black/10 w-9 h-9 rounded-full flex items-center justify-center active:scale-85 transition-all border border-black/5 shrink-0"
              >
                <div className="flex flex-col items-center justify-center gap-1 w-4 h-4">
                  <motion.span
                    animate={{ rotate: isMobileOpen ? 45 : 0, y: isMobileOpen ? 5 : 0 }}
                    className="w-full h-[2px] bg-zinc-800 rounded-full block transform-gpu origin-center transition-all duration-400 ease-out"
                  />
                  <motion.span
                    animate={{ opacity: isMobileOpen ? 0 : 1, x: isMobileOpen ? 8 : 0 }}
                    className="w-full h-[2px] bg-zinc-800 rounded-full block transform-gpu transition-all duration-400 ease-out"
                  />
                  <motion.span
                    animate={{ rotate: isMobileOpen ? -45 : 0, y: isMobileOpen ? -5 : 0 }}
                    className="w-full h-[2px] bg-zinc-800 rounded-full block transform-gpu origin-center transition-all duration-400 ease-out"
                  />
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Mobile Navigation List */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                variants={mobileNavVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-1.5 pt-3 pb-2 px-1 border-t border-black/5 mt-2"
              >
                {menuItems.map((item) => (
                  <motion.div key={item.id} variants={mobileItemVariants} className="flex flex-col">
                    <button
                      onClick={() => {
                        playUiSound("click", isMuted);
                        if (item.subItems) {
                          setMobileExpanded(mobileExpanded === item.id ? null : item.id);
                        } else {
                          scrollToSection(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        isItemActive(item)
                          ? "bg-white/80 text-zinc-900 border border-white/60 shadow-sm"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-white/40"
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.subItems && (
                        <motion.svg
                          animate={{ rotate: mobileExpanded === item.id ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className="w-4 h-4 shrink-0 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      )}
                    </button>

                    {/* Submenu Mobile */}
                    <AnimatePresence>
                      {item.subItems && mobileExpanded === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="flex flex-col gap-1 mt-1 ml-3 pl-3 border-l border-black/10 overflow-hidden"
                        >
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => scrollToSection(sub.id)}
                              className={`text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                                activeId === sub.id
                                  ? "text-zinc-900 bg-white/60 shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-900 hover:bg-white/40"
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