"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEM_LOGS = [
  "INITIALIZING KERNEL...",
  "BYPASSING SECURITY...",
  "FETCHING ASSETS...",
  "COMPILING SHADERS...",
  "RESOLVING DEPENDENCIES...",
  "DECRYPTING DATA...",
  "ESTABLISHING CONNECTION...",
  "RENDERING SCENE...",
];

export default function PageLoader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    let current = 0;
    const updateProgress = () => {
      // สุ่มตัวเลขให้พุ่งขึ้นแบบไม่สม่ำเสมอ สร้างความรู้สึกเหมือนกำลังประมวลผล
      current += Math.random() * 12 + 2;

      if (current >= 100) {
        setProgress(100);
        setLogIndex(SYSTEM_LOGS.length - 1);
        setTimeout(() => setIsLoading(false), 1400); // ค้าง 100% ไว้สักพักให้สมจริง
      } else {
        setProgress(current);
        setLogIndex(Math.floor(Math.random() * (SYSTEM_LOGS.length - 1)));
        setTimeout(updateProgress, Math.random() * 120 + 30);
      }
    };
    
    // ดีเลย์เล็กน้อยก่อนเริ่มรันเปอร์เซ็นต์
    setTimeout(updateProgress, 500);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center font-mono text-white overflow-hidden pointer-events-none bg-zinc-950">
          
          {/* 1. ม่านฉากหลัง แยกบน-ล่างตอนโหลดเสร็จ */}
          <motion.div
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }}
            className="absolute top-0 left-0 w-full h-1/2 bg-zinc-950 pointer-events-auto z-0"
          />
          <motion.div
            exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-zinc-950 pointer-events-auto z-0"
          />

          {/* 2. พื้นหลังตาราง Grid + Scanline Effect */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 z-0"
          >
            {/* Grid */}
            <div 
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            {/* Scanline เคลื่อนที่จากบนลงล่าง */}
            <motion.div 
              animate={{ y: ["-100vh", "100vh"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
            />
          </motion.div>

          {/* 3. เนื้อหาหลัก */}
          <motion.div
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.5 } }}
            className="relative z-10 w-full h-full flex flex-col p-6 md:p-10 justify-between"
          >
            {/* ส่วนหัว HUD (Mobile & Desktop) */}
            <div className="flex justify-between items-start w-full uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
              <div className="flex flex-col gap-1 text-white/40">
                <div className="flex items-center gap-2">
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                  <span className="text-white/80">SYSTEM.BOOT_SEQ</span>
                </div>
                <span>LAT: 11.5564° N</span>
                <span>LON: 104.9282° E</span>
              </div>
              <div className="text-right flex flex-col gap-1 text-white/40">
                <span>V 2.0.24</span>
                <span>MEM: {Math.floor(progress * 1.28)} MB</span>
              </div>
            </div>

            {/* เอฟเฟกต์ Typography ตรงกลางจอ */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative text-[16vw] sm:text-[14vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none select-none">
                
                {/* ตัวอักษรแบบเส้นขอบ (Outline) */}
                <span 
                  style={{ 
                    WebkitTextStroke: "1px rgba(255,255,255,0.15)", 
                    color: "transparent" 
                  }}
                  className="opacity-50 md:opacity-100"
                >
                  THANAWAT
                </span>

                {/* ตัวอักษรสีทึบโผล่มาจากข้างล่าง (Mask Fill) พร้อม Glitch สั่นๆ */}
                <motion.span
                  className="absolute left-0 top-0 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                >
                  THANAWAT
                </motion.span>
                
                {/* Glitch Overlay สุ่มกะพริบ */}
                <motion.span
                  className="absolute left-0 top-0 text-white/30 mix-blend-overlay"
                  animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 + 1 }}
                >
                  THANAWAT
                </motion.span>
              </div>
            </div>

            {/* กล่อง Status ด้านล่าง (จัด Layout ใหม่ให้รอดบนมือถือ) */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 sm:gap-0 w-full">
              
              {/* ข้อความสุ่มแบบ Hacker */}
              <div className="flex flex-col gap-2 w-full sm:w-1/2">
                <div className="h-4 overflow-hidden text-[9px] sm:text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={logIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap truncate"
                    >
                      {">"} {SYSTEM_LOGS[logIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* แถบ Progress Bar */}
                <div className="h-[2px] w-full max-w-full sm:max-w-[200px] bg-white/10 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_#fff]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
              </div>

              {/* ตัวเลขเปอร์เซ็นต์ใหญ่ๆ */}
              <div className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter flex items-start self-end sm:self-auto leading-none">
                {Math.floor(progress)}
                <span className="text-base sm:text-xl md:text-2xl text-white/40 mt-1 ml-1">%</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}