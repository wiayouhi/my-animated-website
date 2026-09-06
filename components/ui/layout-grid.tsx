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

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  const currentIndex = selected ? cards.findIndex((c) => c.id === selected.id) : -1;

  const handleSelect = (card: Card | null) => {
    setSelected(card);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gallery-fullscreen", { detail: { isOpen: !!card } })
      );
    }
  };

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (cards.length === 0) return;
    const nextIndex = (currentIndex + 1) % cards.length;
    setSelected(cards[nextIndex]);
  }, [currentIndex, cards]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (cards.length === 0) return;
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

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "overflow-hidden rounded-2xl transition-all duration-300")}>
          <motion.div
            onClick={() => handleSelect(card)}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={() => handleSelect(null)}
          >
            <button
              onClick={() => handleSelect(null)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {cards.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 z-50 p-3.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  src={selected.thumbnail}
                  className="max-h-[88vh] md:max-h-[92vh] w-auto max-w-full object-contain rounded-xl shadow-2xl select-none"
                  alt="fullscreen-thumbnail"
                />
              </AnimatePresence>
            </motion.div>

            {cards.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 z-50 p-3.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
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
        "object-cover object-center absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105"
      )}
      alt="thumbnail"
    />
  );
};