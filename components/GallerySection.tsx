"use client";

import React, { useMemo } from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";

const generateImages = (folderPath: string, count: number, extension: string = "jpg") => {
  return Array.from({ length: count }, (_, i) => `${folderPath}/${i + 1}.${extension}`);
};

const rawActivitiesData = [
  { id: "act-1", title: "ค่าย Young Guide 2569", folderPath: "/eng2569", imageCount: 8, extension: "jpg" },
  { id: "act-2", title: "English Camp", folderPath: "/english-camp", imageCount: 4, extension: "jpg" },
  { id: "act-3", title: "Math Camp", folderPath: "/math-camp", imageCount: 5, extension: "jpg" },
  { id: "act-3", title: "images", folderPath: "/images", imageCount: 4, extension: "jpg" },
  { id: "act-4", title: "AV Club", folderPath: "/av-club", imageCount: 1, extension: "jpg" }
];

export default function GallerySection() {
  const words = ["MOMENTS", "MEMORIES", "JOURNEY", "LIFESTYLE"];

  const images = useMemo(() => {
    return rawActivitiesData.flatMap((activity) => 
      generateImages(activity.folderPath, activity.imageCount, activity.extension)
    );
  }, []);

  const cards = useMemo(() => {
    if (images.length === 0) return [];
    
    return images.map((img, index) => {
      const isWide = index % 5 === 0;
      const isTall = index % 5 === 2;
      
      let className = "col-span-1 h-[320px] md:h-[380px]";
      if (isWide) {
        className = "md:col-span-2 col-span-1 h-[320px] md:h-[380px]";
      } else if (isTall) {
        className = "col-span-1 h-[400px] md:h-[500px]";
      }
      
      const fileName = img.split('/').pop()?.split('.')[0] || `Image ${index + 1}`;
      
      return {
        id: index + 1,
        className,
        thumbnail: img,
        content: (
          <div className="bg-black/60 p-4 md:p-6 rounded-xl backdrop-blur-md border border-white/10 w-full">
            <p className="font-bold md:text-3xl text-xl text-white drop-shadow-lg capitalize">
              {fileName.replace(/-/g, ' ')}
            </p>
            <p className="font-normal text-sm md:text-base my-2 max-w-lg text-neutral-300 drop-shadow">
              Captured aesthetic moments from our latest collections.
            </p>
          </div>
        ),
      };
    });
  }, [images]);

  return (
    <div className="relative py-20 bg-zinc-950 text-white w-full border-t border-zinc-800/50 overflow-hidden min-h-screen">
      <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} // 🌟 เล่นอนิเมชันแค่ครั้งเดียว ป้องกันอาการกระตุกเวลาเลื่อนผ่าน
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold tracking-[0.2em] text-emerald-300 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-md">
            CURATED GALLERY
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} // 🌟 เล่นอนิเมชันแค่ครั้งเดียว
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-50 flex flex-col md:flex-row md:items-center gap-1 md:gap-3"
        >
          <span>VISUAL</span>
          {/* ล็อคความสูงและขนาดให้เสถียรบนมือถือ ป้องกัน Layout ขยับ */}
          <span className="h-[45px] md:h-auto w-full md:w-[400px] relative flex items-center justify-start text-emerald-400 overflow-hidden">
            <FlipWords words={words} />
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }} // 🌟 เล่นอนิเมชันแค่ครั้งเดียว
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 mt-4 max-w-2xl text-sm md:text-lg leading-relaxed font-light"
        >
          สำรวจคอลเลกชันภาพถ่าย แตะหรือคลิกที่รูปภาพเพื่อขยายดูรายละเอียดแบบเต็มจอ
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // 🌟 เล่นอนิเมชันแค่ครั้งเดียว
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 h-full pb-24"
      >
        {cards.length > 0 ? (
          <LayoutGrid cards={cards} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
            <p className="text-zinc-500">กำลังโหลดรูปภาพ...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}