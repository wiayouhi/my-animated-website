// npx shadcn@latest add @react-bits/ScrollReveal-JS-CSS

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Image from "next/image"; // Make sure to import this if you use Next.js Image
import SplitText from "@/components/ui/SplitText";
import ShinyText from "@/components/ui/ShinyText";
import ScrollReveal from "@/components/ui/ScrollReveal";

// =========================================
// Hack Text Component
// =========================================
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

function HackText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          scramble();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [scramble, hasAnimated]);

  return (
    <span ref={containerRef} className={`inline-block font-mono ${className}`}>
      {displayText}
    </span>
  );
}

// =========================================
// ข้อมูล Data สำหรับ Timeline (อัปเดตสายการเรียน + โลโก้ใหญ่ขึ้น + Mobile UI)
// =========================================
const timelineData = [
  {
    title: "2569-2567",
    content: (
      <div className="relative group p-6 sm:p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden">
        <GlowingEffect blur={0} borderWidth={1.5} spread={40} glow={true} disabled={false} proximity={160} inactiveZone={0.01} />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
        
        {/* จัด Layout ใหม่: มือถือให้อยู่ตรงกลาง (items-center, text-center) คอมพิวเตอร์ชิดซ้าย (sm:items-start, sm:text-left) */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          
          {/* Logo Container: ขยายขนาด w-24 h-24 สำหรับมือถือ และ w-32 h-32 สำหรับคอมพิวเตอร์ */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-[2rem] bg-white/5 border border-zinc-700/50 p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-xl">
            <img src="/logo/spa.png" alt="High School Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          
          <div className="space-y-4 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-4 py-1.5 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                High School // Mathayom 6/14
              </span>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-emerald-300 transition-colors">
                โรงเรียนสภาราชินี จังหวัดตรัง
              </h4>
              <h5 className="text-zinc-400 text-sm md:text-base font-medium">ระดับมัธยมศึกษาตอนปลาย</h5>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
              สายการเรียน: อังกฤษ - คณิต
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2566-2564",
    content: (
      <div className="relative group p-6 sm:p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden">
        <GlowingEffect blur={0} borderWidth={1.5} spread={40} glow={true} disabled={false} proximity={160} inactiveZone={0.01} />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          
          {/* Logo Container */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-[2rem] bg-white/5 border border-zinc-700/50 p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-xl">
            <img src="/logo/spa.png" alt="Middle School Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>

          <div className="space-y-4 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-4 py-1.5 text-xs font-mono font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Middle School
              </span>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors">
                โรงเรียนสภาราชินี จังหวัดตรัง
              </h4>
              <h5 className="text-indigo-300/90 text-sm md:text-base font-medium">ระดับมัธยมศึกษาตอนต้น</h5>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
              สายการเรียน: วิทย์ - คณิต - คอมพิวเตอร์
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2563-2558",
    content: (
      <div className="relative group p-6 sm:p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden">
        <GlowingEffect blur={0} borderWidth={1.5} spread={40} glow={true} disabled={false} proximity={160} inactiveZone={0.01} />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          
          {/* Logo Container */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-[2rem] bg-white/5 border border-zinc-700/50 p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-xl">
            <img src="/logo/au.png" alt="Elementary School Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>

          <div className="space-y-4 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-4 py-1.5 text-xs font-mono font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Elementary School
              </span>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors">
                โรงเรียนอนุบาลตรัง
              </h4>
              <h5 className="text-zinc-400 text-sm md:text-base font-medium">ระดับประถมศึกษา (ป.1 - ป.6)</h5>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

// =========================================
// Main Component
// =========================================
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="relative w-full bg-zinc-950 text-zinc-100 overflow-hidden py-24 sm:py-32">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3f424a_1px,transparent_1px)] [background-size:28px_28px] opacity-20 z-0 pointer-events-none" />

      <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-40 pointer-events-none z-0 flex justify-center items-center">
        <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] bg-indigo-600/15 blur-[180px] rounded-full" />
        <div className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] bg-emerald-600/10 blur-[180px] rounded-full" />
      </motion.div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <ShinyText text="SYSTEM_LOG // CHRONICLE" speed={4} />
          </div>

          <div className="min-h-[60px] md:min-h-[80px] w-full flex items-center justify-center overflow-visible">
            <SplitText
              text="Education Journey"
              as="h2"
              className="text-[28px] sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight leading-none"
              charClassName=""
              delay={25}
              duration={0.55}
              animateBy="chars"
              fromY={35}
            />
          </div>

          <ScrollReveal delay={0.1} direction="up" distance={20}>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-2 px-4">
              เส้นทางการศึกษาตั้งแต่ประถมศึกษาจนถึงมัธยมศึกษาตอนปลาย เลื่อนเพื่อสำรวจประวัติการเรียน
            </p>
          </ScrollReveal>

          <div className="w-full max-w-3xl mt-8 p-4 sm:p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 items-center divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80">
            <div className="text-center p-2">
              <p className="text-[10px] sm:text-xs font-mono text-zinc-500 mb-1">GPAX</p>
              <p className="text-xl sm:text-3xl font-black text-white font-mono">3.26</p>
            </div>
            <div className="text-center p-2">
              <p className="text-[10px] sm:text-xs font-mono text-zinc-500 mb-1">EXPERIENCE</p>
              <p className="text-xl sm:text-3xl font-black text-indigo-400 font-mono">2+ YRS</p>
            </div>
            <div className="text-center p-2">
              <p className="text-[10px] sm:text-xs font-mono text-zinc-500 mb-1">PROJECTS</p>
              <p className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">10+</p>
            </div>
            <div className="text-center p-2">
              <p className="text-[10px] sm:text-xs font-mono text-zinc-500 mb-1">FOCUS</p>
              <p className="text-xl sm:text-3xl font-black text-purple-400 font-mono">STACK</p>
            </div>
          </div>
        </motion.div>

        <div className="w-full">
          <Timeline data={timelineData} />
        </div>
      </div>
    </section>
  );
}