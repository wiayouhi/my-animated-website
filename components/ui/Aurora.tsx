"use client";

import { motion } from "framer-motion";

interface AuroraProps {
  className?: string;
  colorStops?: string[];
  blur?: number;
  opacity?: number;
  speed?: number;
}

export default function Aurora({
  className = "",
  colorStops = ["#3b82f6", "#8b5cf6", "#06b6d4"],
  blur = 80,
  opacity = 0.35,
  speed = 8,
}: AuroraProps) {
  const [c1, c2, c3] = [
    colorStops[0] ?? "#3b82f6",
    colorStops[1] ?? "#8b5cf6",
    colorStops[2] ?? "#06b6d4",
  ];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      {/* Blob 1 — large, slow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${c1}cc 0%, transparent 70%)`,
          width: "70%",
          height: "70%",
          top: "-20%",
          left: "-10%",
          filter: `blur(${blur}px)`,
          opacity,
          willChange: "transform",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{
          duration: speed * 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Blob 2 — medium, medium speed */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${c2}bb 0%, transparent 70%)`,
          width: "60%",
          height: "60%",
          bottom: "-10%",
          right: "0%",
          filter: `blur(${blur * 0.9}px)`,
          opacity: opacity * 0.85,
          willChange: "transform",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: speed * 1.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: speed * 0.3,
        }}
      />
      {/* Blob 3 — small, fast, center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${c3}99 0%, transparent 70%)`,
          width: "45%",
          height: "45%",
          top: "30%",
          left: "30%",
          filter: `blur(${blur * 0.7}px)`,
          opacity: opacity * 0.7,
          willChange: "transform",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: speed * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: speed * 0.6,
        }}
      />
    </div>
  );
}
