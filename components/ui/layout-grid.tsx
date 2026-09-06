"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Card = {
  id: number;
  content: React.JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

// ระบบจัดการเสียง
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

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [direction, setDirection] = useState(0);

  const currentIndex = selected ? cards.findIndex((c) => c.id === selected.id) : -1;

  // 🌟 [ส่วนที่เพิ่มใหม่] จัดการล็อคการเลื่อนหน้าเว็บเวลาเปิดรูป
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden"; // ล็อคไม่ให้เว็บเลื่อน
    } else {
      document.body.style.overflow = "unset";  // ปลดล็อคเมื่อปิดรูป
    }
    
    // คืนค่าเมื่อเปลี่ยนหน้าหรือ Unmount ป้องกันเว็บค้าง
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selected]);

  const handleSelect = (card: Card | null) => {
    setSelected(card);
    setDirection(0);
    
    if (typeof window !== "undefined") {
      // ส่งสัญญาณให้ Floating Menu ซ่อนตัว
      window.dispatchEvent(
        new CustomEvent("gallery-fullscreen", { detail: { isOpen: !!card } })
      );
      
      // ส่งค่าไปบอกระบบ UI อื่นๆ (ถ้ามี)
      window.dispatchEvent(
        new CustomEvent("ui-state", { detail: { isHidden: !!card } })
      );
      
      if (card) playSound("pop");
      else playSound("swoosh");
    }
  };

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (cards.length === 0) return;
    playSound("tick");
    setDirection(1);
    const nextIndex = (currentIndex + 1) % cards.length;
    setSelected(cards[nextIndex]);
  }, [currentIndex, cards]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (cards.length === 0) return;
    playSound("tick");
    setDirection(-1);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setSelected(cards[prevIndex]);
  }, [currentIndex, cards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Escape") handleSelect(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, handleNext, handlePrev]);

  const springConfig = { type: "spring" as const, stiffness: 350, damping: 25, mass: 1 };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "overflow-hidden rounded-2xl transition-all duration-300")}>
          <motion.div
            onClick={() => handleSelect(card)}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden cursor-pointer rounded-2xl h-full w-full bg-zinc-900/80 border border-white/10 group shadow-lg"
            layoutId={`card-${card.id}`}
          >
            <ImageComponent card={card} />
          </motion.div>
        </div>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            // 🌟 เปลี่ยนจาก z-[110] เป็น z-[9999] เพื่อให้ลอยอยู่หน้าสุดจริงๆ ไม่โดนส่วนอื่นบัง
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={() => handleSelect(null)}
          >
            <button
              onClick={() => handleSelect(null)}
              className="absolute top-6 right-6 z-[10000] p-3 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {cards.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 z-[10000] p-4 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 hover:scale-110 active:scale-90 transition-all backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={springConfig}
              className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={selected.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 1 ? 60 : direction === -1 ? -60 : 0, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction === 1 ? -60 : direction === -1 ? 60 : 0, scale: 0.95 }}
                  transition={springConfig}
                  src={selected.thumbnail}
                  className="max-h-[88vh] md:max-h-[92vh] w-auto max-w-full object-contain rounded-xl shadow-2xl select-none"
                  alt="fullscreen-thumbnail"
                />
              </AnimatePresence>
            </motion.div>

            {cards.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 z-[10000] p-4 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 hover:scale-110 active:scale-90 transition-all backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      className={cn(
        "object-cover object-center absolute inset-0 h-full w-full transition duration-500 group-hover:scale-110"
      )}
      alt="thumbnail"
    />
  );
};