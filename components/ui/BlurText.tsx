"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "chars";
  direction?: "top" | "bottom";
  threshold?: number;
  onAnimationComplete?: () => void;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export default function BlurText({
  text,
  className = "",
  delay = 80,
  animateBy = "words",
  direction = "bottom",
  threshold = 0.1,
  onAnimationComplete,
  as: Tag = "div",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const [completed, setCompleted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const fromY = direction === "top" ? -20 : 20;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      className={`inline ${className}`}
      aria-label={text}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: fromY }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{
            duration: 0.55,
            delay: i * (delay / 1000),
            ease: [0.215, 0.61, 0.355, 1],
          }}
          onAnimationComplete={
            i === elements.length - 1 && onAnimationComplete
              ? () => {
                  if (!completed) {
                    setCompleted(true);
                    onAnimationComplete();
                  }
                }
              : undefined
          }
          className="inline-block"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {el}
          {animateBy === "words" && i < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
