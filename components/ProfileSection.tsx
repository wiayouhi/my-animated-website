"use client";

import { motion } from "framer-motion";
import BlurText from "@/components/ui/BlurText";
import ShinyText from "@/components/ui/ShinyText";
import ScrollReveal from "@/components/ui/ScrollReveal";

// ข้อมูลส่วนตัวพื้นฐาน (แก้ตรงนี้ให้เป็นข้อมูลของคุณได้เลย)
const personalInfo = [
  { label: "ชื่อ-นามสกุล", value: "นาย ธนวัฒน์ นวนจันทร์" },
  { label: "ชื่อเล่น", value: "เวียร์" },
  { label: "วันเกิด", value: "17 กุมภาพันธ์ 2552" },
  { label: "สัญชาติ/เชื้อชาติ", value: "ไทย / ไทย" },
  { label: "แผนการเรียน", value: "ภาษาอังกฤษ-คณิตศาสตร์" },
  { label: "งานอดิเรก", value: "เขียนโค้ด, อ่านหนังสือ, ฟังเพลง" },
];

export default function ProfileSection() {
  return (
    <section className="relative w-full min-h-[80vh] bg-white py-24 px-6 flex items-center justify-center" id="profile">
      
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* =========================================
            ฝั่งซ้าย: ทักทาย & ข้อความสั้นๆ
        ========================================= */}
        <div className="flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-zinc-400 font-bold tracking-widest uppercase mb-4 text-sm"
          >
            <ShinyText text="Introduction" speed={4} />
          </motion.span>
          
          <div className="mb-6">
            <BlurText
              text="Hello, I'm Wia."
              as="h2"
              className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-tight"
              delay={70}
              animateBy="words"
              direction="bottom"
            />
          </div>

          <ScrollReveal delay={0.15} direction="up" distance={24}>
            <p className="text-lg text-zinc-600 font-light leading-relaxed mb-6">
              "ความพยายามในวันนี้ คือความสำเร็จในวันหน้า"
            </p>
          </ScrollReveal>
          
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-zinc-500 text-sm">
              ช่องทางการติดต่อ: <br/>
              Email: jaceva3091@gmail.com <br/>
              Tel: 064-4710462
            </p>
          </motion.div>
        </div>

        {/* =========================================
            ฝั่งขวา: การ์ดข้อมูลส่วนตัว
        ========================================= */}
        <div className="relative w-full">
          {/* พื้นหลังเบลอตกแต่ง */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-zinc-100 rounded-[2rem] rotate-3 scale-105 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
            className="relative bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-xl w-full"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Personal Info</h3>
            
            <ul className="space-y-4">
              {personalInfo.map((info, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4"
                >
                  <span className="text-zinc-400 text-sm font-medium min-w-[120px]">
                    {info.label}
                  </span>
                  <span className="text-zinc-800 text-sm font-medium">
                    {info.value}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}