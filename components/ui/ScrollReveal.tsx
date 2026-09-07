"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  threshold = 0.15,
  delay = 0,
  duration = 0.65,
  direction = "up",
  distance = 30,
  once = true,
}: ScrollRevealProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, once]);

  const initial: Record<string, unknown> = { opacity: 0 };
  const animate: Record<string, unknown> = { opacity: inView ? 1 : 0 };

  if (direction === "up") {
    initial.y = distance;
    animate.y = inView ? 0 : distance;
  } else if (direction === "down") {
    initial.y = -distance;
    animate.y = inView ? 0 : -distance;
  } else if (direction === "left") {
    initial.x = distance;
    animate.x = inView ? 0 : distance;
  } else if (direction === "right") {
    initial.x = -distance;
    animate.x = inView ? 0 : -distance;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
