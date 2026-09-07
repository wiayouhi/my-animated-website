"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  duration?: number;
  animateBy?: "chars" | "words";
  threshold?: number;
  fromY?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export default function SplitText({
  text,
  className = "",
  charClassName = "",
  delay = 30,
  duration = 0.5,
  animateBy = "chars",
  threshold = 0.2,
  fromY = 40,
  as: Tag = "h2",
}: SplitTextProps) {
  const [inView, setInView] = useState(false);
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

  // Split into words, each word into chars (keep spaces between words)
  const words = text.split(" ");

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      className={`overflow-visible ${className}`}
      aria-label={text}
    >
      {words.map((word, wIdx) => {
        const elements = animateBy === "chars" ? word.split("") : [word];
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {elements.map((char, cIdx) => {
              const globalIdx =
                animateBy === "chars"
                  ? words.slice(0, wIdx).join("").length + wIdx + cIdx
                  : wIdx;
              return (
                <span key={cIdx} className="inline-block overflow-hidden leading-tight">
                  <motion.span
                    className={`inline-block ${charClassName}`}
                    initial={{ y: fromY, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{
                      duration,
                      delay: globalIdx * (delay / 1000),
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
