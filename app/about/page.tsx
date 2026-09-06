"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  // Variants สำหรับอนิเมชันตอนโหลดหน้าเว็บ
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 font-sans relative overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* 1. Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none fixed"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* 2. Animated Glowing Orbs (Aurora Effect) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-20 left-[10%] w-[30rem] h-[30rem] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-20 right-[10%] w-[25rem] h-[25rem] bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none z-0"
      />
      {/* ------------------------ */}

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all uppercase tracking-widest text-sm font-bold group bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800/80 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Home System
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-24"
        >
          {/* Header Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              System Architecture
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              Behind The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Experience
              </span>
            </h1>
          </motion.section>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <motion.section variants={itemVariants} className="space-y-5">
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-zinc-800 pb-4 text-zinc-100 flex items-center gap-3">
                <span className="text-blue-500">01</span> The Purpose
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed text-sm md:text-base">
                <p>
                  <strong className="text-zinc-200">เป้าหมายโปรเจกต์:</strong> เว็บไซต์นี้ถูกสร้างขึ้นมาเพื่อเป็นทั้งผลงานสะสม (Personal Portfolio) และเป็นพื้นที่ทดลอง (Interactive Playground) สำหรับผสมผสานงานออกแบบ Web UI ยุคใหม่เข้ากับเทคโนโลยี WebGL กราฟิกสามมิติบนเบราว์เซอร์
                </p>
                <p>
                  เพื่อยกระดับการท่องเว็บแบบเดิมๆ ให้กลายเป็นประสบการณ์ที่ผู้เยี่ยมชมสามารถมีส่วนร่วมและโต้ตอบ (Interactive Experience) ได้จริงในแบบ Real-time
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-5">
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-zinc-800 pb-4 text-zinc-100 flex items-center gap-3">
                <span className="text-indigo-500">02</span> Core Vision
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed text-sm md:text-base">
                <p>
                  หัวใจสำคัญของเว็บนี้คือความราบรื่นในการใช้งานแบบ <strong className="text-zinc-200">Seamless Transition</strong>
                </p>
                <p>
                  องค์ประกอบ กราฟิก และระบบอนุภาค (Particle Systems) ทั้งหมดประมวลผลสดบนเครื่องของผู้ใช้ (Client-side Rendering) ร่วมกับการเปลี่ยนหน้าที่นุ่มนวล เพื่อให้ความรู้สึกใกล้เคียงกับการใช้งานแอปพลิเคชันระดับสูงมากกว่าเว็บไซต์ทั่วไป
                </p>
              </div>
            </motion.section>
          </div>

          {/* Tech Stack Cards */}
          <motion.section variants={itemVariants} className="space-y-8 relative">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-zinc-800 pb-4 text-zinc-100 flex items-center gap-3">
              <span className="text-purple-500">03</span> Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Next.js", desc: "React Framework & App Router", icon: "🚀" },
                { name: "Three.js", desc: "3D WebGL Graphics Rendering", icon: "🧊" },
                { name: "Framer Motion", desc: "Fluid Physics & Animations", icon: "✨" },
                { name: "Tailwind CSS", desc: "Modern Utility-First Styling", icon: "🎨" },
              ].map((tech, idx) => (
                <div
                  key={tech.name}
                  className="group relative p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:border-blue-500/50 cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-2xl mb-3">{tech.icon}</span>
                    <h3 className="font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Creator & Rights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-zinc-800 pb-4 text-zinc-100 flex items-center gap-3">
                <span className="text-blue-400">04</span> The Creator
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl"></div>
                  <span className="relative z-10">⚔️</span>
                </motion.div>
                
                <div className="text-zinc-400 leading-relaxed text-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">Thanawat</h3>
                    <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-blue-400 font-mono tracking-wider">@WiaYouHi</span>
                  </div>
                  <p>
                    Developer ผู้หลงใหลในการสร้างสรรค์ประสบการณ์บนเว็บ การเขียนโค้ดเพื่อสร้าง Interactive UI การทดลองเกี่ยวกับ WebGL และ Micro-interactions ต่างๆ
                  </p>
                  <div className="pt-3">
                    <a
                      href="https://instagram.com/Thanawat.wia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-xs text-zinc-300 hover:text-white transition-all font-mono bg-zinc-950 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800"
                    >
                      <span className="text-pink-500 group-hover:scale-110 transition-transform duration-300">📸</span> 
                      <span>Instagram: @Thanawat.wia</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-zinc-800 pb-4 text-zinc-100 flex items-center gap-3">
                <span className="text-blue-400">05</span> Ownership
              </h2>
              <div className="h-full bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-md text-zinc-400 text-sm leading-relaxed space-y-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                <p className="relative z-10">
                  <strong className="text-zinc-200 block mb-1">Intellectual Property:</strong> 
                  โค้ด คอนเซปต์ การออกแบบ และสื่อทั้งหมดบนเว็บไซต์นี้ เป็นผลงานการพัฒนาของ <span className="text-blue-400 font-semibold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span> Thanawat (WiaYouHi)</span>
                </p>
                <div className="w-full h-px bg-zinc-800/50 relative z-10"></div>
                <p className="relative z-10">
                  <strong className="text-zinc-200 block mb-1">Usage Rights:</strong> 
                  จัดทำขึ้นเพื่อจุดประสงค์ในการเป็น Portfolio และการศึกษา (Educational Purposes) ไม่อนุญาตให้นำไปคัดลอก ทำซ้ำ หรือใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต
                </p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}