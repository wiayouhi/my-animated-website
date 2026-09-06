"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";

const projectsData = [
  {
    id: "project-1",
    title: "E-Commerce Web App",
    category: "Next.js / Tailwind CSS",
    shortDesc: "เว็บไซต์ขายของออนไลน์พร้อมระบบตะกร้าสินค้า",
    fullDesc: "โปรเจกต์นี้สร้างขึ้นเพื่อศึกษาการทำงานของระบบ E-Commerce เต็มรูปแบบ มีระบบจัดการตะกร้าสินค้า ดึงข้อมูลจาก API และรองรับ Responsive Design สำหรับทุกหน้าจอ เพื่อให้ผู้ใช้งานสามารถสั่งซื้อสินค้าได้อย่างลื่นไหลที่สุด",
    stack: ["php", "MySQL", "html", "css"],
    features: [
      "ระบบตะกร้าสินค้าและ Checkout สมบูรณ์แบบ",
      "การจัดการ State ด้วย Zustand รวดเร็ว ไม่รีเฟรช",
      "เชื่อมต่อ Payment Gateway เพื่อรับชำระเงินจริง",
      "หน้า Dashboard สำหรับจัดการสินค้าฝั่ง Admin"
    ],
    link: "https://gamehub-store.zya.me/",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
    themeColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "project-2",
    title: "CarTune — YouTube Queue",
    category: "Next.js / Socket.IO",
    shortDesc: "เว็บแอปเปิดเพลง YouTube ในรถยนต์ เพิ่มคิวผ่านมือถือได้แบบ Real-time",
    fullDesc: "ระบบฟังเพลงในรถที่ให้ผู้โดยสารเพิ่มคิวเพลงผ่านมือถือได้แบบ Real-time มีระบบสร้างห้อง กำหนดสิทธิ์ Host และซิงค์ข้อมูลทุกคนพร้อมกันผ่าน Socket.IO พร้อม Car View สำหรับหน้าจอในรถ และ Queue View สำหรับค้นหาและเพิ่มเพลงผ่านมือถือ",
    stack: ["Next.js", "Socket.IO", "MongoDB", "YouTube API", "bcryptjs"],
    features: [
      "Car View & Queue View จัดการหน้าจอตามอุปกรณ์แบบอัจฉริยะ",
      "ระบบสร้างห้องด้วยรหัสผ่าน และ Host System ควบคุมคิว",
      "Real-time Sync ข้อมูลคิวเพลงทุกคนพร้อมกันด้วย Socket.IO",
      "ค้นหาและดึงข้อมูลวิดีโอผ่าน YouTube Data API v3"
    ],
    link: "https://webshop-a5am.onrender.com/",
    image: "/pr/2.png",
    themeColor: "text-zinc-300",
    bgColor: "bg-zinc-500/10",
  },
  {
    id: "project-3",
    title: "TrueMoney Redeem Pro",
    category: "FastAPI / OAuth2",
    shortDesc: "ระบบจัดการการเติมเงินผ่านซองของขวัญ TrueMoney แบบอัตโนมัติ",
    fullDesc: "โปรเจกต์เชิงการศึกษาสำหรับเรียนรู้การพัฒนา REST API ด้วย FastAPI จัดการฐานข้อมูลผ่าน SQLite และประยุกต์ใช้การยืนยันตัวตนด้วย Discord OAuth2 พร้อมระบบแจ้งเตือนสถานะการทำงานผ่าน Discord Webhook และ LINE Messaging API",
    stack: ["FastAPI", "SQLite", "Discord OAuth2", "LINE API"],
    features: [
      "พัฒนาระบบ REST API ประสิทธิภาพสูงด้วยโครงสร้าง FastAPI",
      "ระบบ Login และยืนยันตัวตนผ่านบัญชี Discord (OAuth2)",
      "จัดการฐานข้อมูลอย่างเป็นระบบด้วย SQLite",
      "แจ้งเตือนสถานะการทำรายการผ่าน Discord Webhook & LINE"
    ],
    link: "https://truemoneyget.onrender.com/",
    image: "pr/3.png",
    themeColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "project-4",
    title: "Form-Automation",
    category: "Scripting / Automation",
    shortDesc: "สคริปต์ระบบส่งคำตอบ Google Form แบบอัตโนมัติ",
    fullDesc: "ระบบ Automation สำหรับการส่งคำตอบเข้า Google Form แบบอัตโนมัติ ช่วยลดภาระและประหยัดเวลาในการกรอกข้อมูลที่ซ้ำซากจำเจ สามารถนำไปประยุกต์ใช้สำหรับการทำ Automated Testing หรือการกรอกฟอร์มที่ต้องทำเป็นประจำ",
    stack: ["Python", "Automation", "Requests", "Scripting"],
    features: [
      "ส่งคำตอบเข้า Google Form ได้แบบอัตโนมัติโดยไม่ต้องเปิดหน้าเว็บ",
      "ลดระยะเวลาและข้อผิดพลาดในการกรอกข้อมูลซ้ำๆ",
      "สามารถกำหนดรูปแบบและชุดข้อมูลคำตอบได้ด้วยตัวเอง",
      "เหมาะสำหรับการนำไปประยุกต์ใช้กับงาน Automated Testing"
    ],
    link: "https://form-automation-3ram.onrender.com/",
    image: "/pr/4.png",
    themeColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

function TiltImage({ src, alt }: { src: string; alt: string }) {
  const [transform, setTransform] = useState("");
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTransform(`perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateY(0deg) rotateX(0deg)");
  };

  return (
    <div
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full aspect-video md:aspect-[4/3] rounded-2xl relative z-10 transition-transform duration-200 ease-out shadow-2xl"
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-black/50 blur-xl -z-10 translate-y-6 scale-95" />
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-2xl border border-zinc-800"
      />
    </div>
  );
}

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const words = ["Works", "Projects", "Designs", "Ideas"];

  // 🌟 เพิ่มคำสั่งส่ง Event (Dispatch Event) เพื่อสื่อสารกับ ScrollIndicator
  useEffect(() => {
    const navbar = document.querySelector("header") || document.querySelector("nav");
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      if (navbar) (navbar as HTMLElement).style.opacity = "0";
      
      // ส่ง Event ซ่อน UI
      window.dispatchEvent(new CustomEvent("ui-state", { detail: { isHidden: true } }));
    } else {
      document.body.style.overflow = "";
      if (navbar) (navbar as HTMLElement).style.opacity = "1";
      
      // ส่ง Event โชว์ UI
      window.dispatchEvent(new CustomEvent("ui-state", { detail: { isHidden: false } }));
    }
  }, [selectedProject]);

  const activeProject = projectsData.find((p) => p.id === selectedProject);

  return (
    <section className="relative w-full min-h-screen bg-zinc-950 py-32 px-6" id="projects">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SHOWCASE // DIRECTORY
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight flex flex-wrap justify-center md:justify-start items-center gap-x-3">
            <span>Selected</span>
            <span className="inline-block h-[50px] sm:h-[60px] md:h-[80px] min-w-[180px] sm:min-w-[220px] md:min-w-[280px] text-emerald-400">
              <FlipWords words={words} />
            </span>
          </h2>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
            ผลงานบางส่วนที่ผมตั้งใจพัฒนา ลองกดเข้าไปดูรายละเอียดได้เลยครับ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelectedProject(project.id)}
              className="group cursor-pointer rounded-3xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden shadow-lg hover:border-zinc-700 transition-colors flex flex-col h-[28rem] relative"
            >
              <motion.div
                layoutId={`project-image-${project.id}`}
                className="w-full h-[55%] overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </motion.div>

              <div className="p-8 flex flex-col justify-center flex-grow relative z-20">
                <span className={`text-[11px] font-mono font-bold ${project.themeColor} mb-2 uppercase tracking-widest inline-block`}>
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2">{project.shortDesc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && activeProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950 pointer-events-auto overflow-y-auto overflow-x-hidden"
            >
              <div className="sticky top-0 w-full px-6 py-6 flex items-center justify-between z-50 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-white rounded-full hover:bg-zinc-800 transition-all shadow-xl cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <a href={activeProject.link} target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-white text-zinc-950 font-bold text-sm rounded-full hover:bg-zinc-200 transition-colors shadow-lg">
                  Visit Project
                </a>
              </div>

              <div className="max-w-6xl w-full mx-auto px-6 pb-32 pt-4 md:pt-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                
                <div className="w-full lg:w-5/12 flex flex-col items-center justify-center sticky top-32">
                  <motion.div layoutId={`project-image-${activeProject.id}`} className="w-full z-20">
                    <TiltImage src={activeProject.image} alt={activeProject.title} />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full lg:w-7/12 flex flex-col gap-10"
                >
                  <div>
                    <span className={`inline-block px-3 py-1 ${activeProject.bgColor} border border-zinc-800/50 ${activeProject.themeColor} text-xs font-mono font-bold rounded-full mb-4 uppercase tracking-widest`}>
                      {activeProject.category}
                    </span>
                    <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
                      {activeProject.title}
                    </h3>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">Overview</h4>
                    <p className="text-lg text-zinc-300 leading-relaxed">
                      {activeProject.fullDesc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.stack.map((tech) => (
                        <span key={tech} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">Key Features</h4>
                    <ul className="space-y-4">
                      {activeProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                          <div className={`mt-1 ${activeProject.themeColor}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <p className="text-zinc-300">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}