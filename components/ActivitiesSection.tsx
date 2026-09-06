"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// =========================================
// ระบบสร้างเสียงเอฟเฟกต์ (UI Audio Synthesizer)
// =========================================
const playSound = (type: "hover" | "pop" | "slide" | "close") => {
  if (typeof window === "undefined") return;
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "pop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "slide") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "close") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch {
    // ป้องกัน Error ในเบราว์เซอร์ที่ไม่รองรับ Web Audio API
  }
};

// =========================================
// ฟังก์ชันช่วยสร้างลิงก์รูปภาพอัตโนมัติจากโฟลเดอร์
// =========================================
const generateImages = (folderPath: string, count: number, extension: string = "jpg") => {
  return Array.from({ length: count }, (_, i) => `${folderPath}/${i + 1}.${extension}`);
};

// =========================================
// ข้อมูลส่วนที่ 1: กิจกรรม (Activities)
// =========================================
const rawActivitiesData = [
  {
    id: "act-1",
    type: "Activity", 
    title: "ค่าย Young Guide 2569",
    date: "ปี 2569",
    description: "เข้าร่วมรับฟังการบรรยายเกี่ยวกับการท่องเที่ยว การจัดการโรงแรม และธุรกิจสายการบิน เพื่อเปิดมุมมองสายอาชีพ ณ จังหวัดกระบี่",
    folderPath: "/eng2569",
    imageCount: 8, 
  },
  {
    id: "act-2",
    type: "Activity",
    title: "ค่ายคณิตศาสตร์ ม.5/13 - ม.5/14",
    date: "ปี 2568",
    description: "เดินทางไปร่วมกิจกรรมและเรียนรู้ทักษะทางคณิตศาสตร์เพิ่มเติม ร่วมกับรุ่นพี่และคณาจารย์ ณ มหาวิทยาลัยในจังหวัดสงขลา",
    folderPath: "/math-camp",
    imageCount: 5, 
  },
  {
    id: "act-3",
    type: "Activity",
    title: "English Camp",
    date: "8 กันยายน",
    description: "เข้าค่ายภาษาอังกฤษเพื่อศึกษาเส้นทางการประกอบอาชีพในสายภาษา แลกเปลี่ยนประสบการณ์กับรุ่นพี่และอาจารย์ ณ มหาวิทยาลัยในหาดใหญ่",
    folderPath: "/english-camp",
    imageCount: 4, 
  },
  {
    id: "act-4",
    type: "Activity",
    title: "คณะทำงานฝ่ายโสตทัศนศึกษาโรงเรียน",
    date: "ตลอดปีการศึกษา",
    description: "ปฏิบัติหน้าที่ในฝ่ายโสตทัศนศึกษาของโรงเรียน รับผิดชอบการควบคุมระบบภาพ เครื่องเสียง และสื่อมัลติมีเดียต่างๆ ภายในกิจกรรมสำคัญของโรงเรียน",
    folderPath: "av-club",
    imageCount: 1, 
  }
];

// =========================================
// ข้อมูลส่วนที่ 2: เกียรติบัตร (Certificates)
// =========================================
const rawCertificatesData = [
  {
    id: "cert-1",
    type: "Certificate", 
    title: "Young Guide Camp for Tourism 2026",
    date: "28 สิงหาคม 2569",
    description: "ได้รับเกียรติบัตรเข้าร่วมกิจกรรม Young Guide Camp for Tourism 2026 สำหรับนักเรียนแผนการเรียนภาษาอังกฤษ-คณิตศาสตร์ (M.6/13 - M.6/14) ณ จังหวัดกระบี่",
    folderPath: "/cert/cert-young-guide",
    imageCount: 1, 
  },
  {
    id: "cert-2",
    type: "Certificate", 
    title: "ค่ายคณิตศาสตร์ มหาวิทยาลัยทักษิณ",
    date: "7 พฤศจิกายน 2568",
    description: "เข้าร่วมโครงการค่ายคณิตศาสตร์สำหรับนักเรียนแผนการเรียนภาษาอังกฤษ-คณิตศาสตร์ ณ อาคารศูนย์ปฏิบัติการวิชาชีพครู คณะศึกษาศาสตร์ มหาวิทยาลัยทักษิณ",
    folderPath: "/cert/cert-math-camp",
    imageCount: 1, 
  },
  {
    id: "cert-3",
    type: "Certificate", 
    title: "English Camp 2025",
    date: "2 สิงหาคม 2568",
    description: "เข้าร่วมกิจกรรมค่าย English Camp 2025 สำหรับนักเรียนแผนการเรียนภาษาอังกฤษ-คณิตศาสตร์ ระหว่างวันที่ 1-2 สิงหาคม 2568 ณ จังหวัดสงขลา",
    folderPath: "/cert/cert-english-camp",
    imageCount: 1,
  },
  {
    id: "cert-4",
    type: "Certificate", 
    title: "กิจกรรมวันตรุษจีน ประจำปี 2567",
    date: "30 มกราคม 2568",
    description: "ได้รับเกียรติบัตรเข้าร่วมกิจกรรมเนื่องในวันตรุษจีน ประจำปีการศึกษา 2567 จัดโดยโรงเรียนสภาราชินี จังหวัดตรัง",
    folderPath: "/cert/cert-chinese-new-year",
    imageCount: 1, 
  }
];

// แปลงข้อมูล
const activitiesData = rawActivitiesData.map((item) => ({
  ...item,
  images: generateImages(item.folderPath, item.imageCount),
}));

const certificatesData = rawCertificatesData.map((item) => ({
  ...item,
  images: generateImages(item.folderPath, item.imageCount),
}));

// =========================================
// Animation Variants
// =========================================
const cardVariants: Variants = {
  initial: (index: number) => ({
    rotate: index === 0 ? -6 : index === 1 ? 4 : 8,
    x: index === 0 ? -10 : index === 1 ? 5 : 15,
    y: index === 0 ? 5 : index === 1 ? -5 : 10,
    opacity: 1 - index * 0.12,
    zIndex: 10 - index,
    scale: 1 - index * 0.03,
  }),
  hover: (index: number) => ({
    rotate: index === 0 ? -15 : index === 1 ? 0 : 15,
    x: index === 0 ? -50 : index === 1 ? 0 : 50,
    y: index === 0 ? -20 : index === 1 ? -32 : -15,
    scale: 1.06,
    transition: { type: "spring", stiffness: 380, damping: 20 },
  }),
};

const sliderVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 20 : -20,
  }),
  center: { 
    zIndex: 1, 
    x: 0, 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction === 0 ? 0 : direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 20 : -20,
  }),
};

export default function PortfolioSection() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedItem]);

  const paginate = useCallback((newDirection: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedItem) return;
    playSound("slide");
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex >= selectedItem.images.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = selectedItem.images.length - 1;
      return nextIndex;
    });
  }, [selectedItem]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") {
        playSound("close");
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, paginate]);

  const handleOpenItem = (item: any) => {
    playSound("pop");
    setDirection(0);
    setCurrentImageIndex(0);
    setSelectedItem(item);
  };

  const handleCloseItem = () => {
    playSound("close");
    setSelectedItem(null);
  };

  // Render การ์ดพร้อมลูกเล่นอนิเมชันและเสียง
  const renderCard = (item: any, idx: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
      className="flex flex-col items-center group cursor-pointer relative"
      onClick={() => handleOpenItem(item)}
      onMouseEnter={() => playSound("hover")}
    >
      {/* Dynamic Ambient Blur Aura */}
      <div className={`absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl -z-10
        ${item.type === 'Certificate' ? 'bg-amber-500/25' : 'bg-rose-500/25'}`} 
      />

      <motion.div
        className="relative w-full aspect-[4/3] mb-8"
        initial="initial"
        whileHover="hover"
      >
        {/* รูปซ้อน 3 ชั้น */}
        {item.images.slice(0, 3).map((img: string, index: number) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            className="absolute inset-0 bg-white p-2.5 rounded-2xl shadow-lg border border-zinc-200/80 group-hover:border-zinc-300/90 transition-colors"
          >
            <div className="w-full h-full relative overflow-hidden rounded-xl bg-zinc-100">
              <img 
                src={img} 
                alt={`img-${index}`} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
        
        {/* Badge บ่งบอกจำนวนรูป */}
        {item.images.length > 1 && (
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className="absolute -bottom-3 right-3 z-20 bg-zinc-900/90 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg border border-white/10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 animate-pulse text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            ดูทั้งหมด {item.images.length} รูป
          </motion.div>
        )}
        
        {/* Tag ประเภทกิจกรรม */}
        <motion.div 
          whileHover={{ scale: 1.15, rotate: -2 }}
          className={`absolute -top-3 -left-3 z-30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border border-white/20
            ${item.type === 'Certificate' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'}`}
        >
          {item.type === 'Certificate' ? '🏆 Certificate' : '🏕️ Activity'}
        </motion.div>
      </motion.div>

      {/* ข้อความอธิบาย */}
      <div className="text-center w-full px-4">
        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase mb-1.5 block">{item.date}</span>
        <h3 className={`text-xl font-bold text-zinc-900 mb-2 transition-colors duration-300 ${item.type === 'Certificate' ? 'group-hover:text-amber-500' : 'group-hover:text-rose-500'}`}>
          {item.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-normal">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-slate-50/50 pb-32 overflow-hidden relative selection:bg-rose-500 selection:text-white">
      {/* Background Decor Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-100/50 via-rose-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ==============================================
          ส่วนที่ 1: ACTIVITIES (กิจกรรม)
          ============================================== */}
      <section className="pt-32 px-6 relative" id="activities">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center relative"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 font-medium text-xs tracking-widest uppercase mb-4 border border-orange-500/20"
            >
              Explore Experience
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 animate-gradient">Journey</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto">
              รวมภาพกิจกรรมที่เข้าร่วม และประสบการณ์นอกห้องเรียน
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {activitiesData.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto mt-28 mb-12 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
      </div>

      {/* ==============================================
          ส่วนที่ 2: CERTIFICATES (เกียรติบัตร)
          ============================================== */}
      <section className="pt-12 px-6 relative" id="certificates">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 font-medium text-xs tracking-widest uppercase mb-4 border border-amber-500/20"
            >
              Achievements
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500">Certificates</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto">
              เกียรติบัตรและรางวัลแห่งความภาคภูมิใจ
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {certificatesData.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>
      </section>

      {/* ==============================================
          ส่วนของ LIGHTBOX (เปิดดูรูปภาพ)
          ============================================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={handleCloseItem}
          >
            {/* Header / Info Bar */}
            <div className="w-full max-w-6xl flex items-center justify-between z-30 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="text-white flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border border-white/20 ${selectedItem.type === 'Certificate' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {selectedItem.type === 'Certificate' ? '🏆 Certificate' : '🏕️ Activity'}
                </span>
                <div>
                  <h4 className="text-lg md:text-xl font-bold line-clamp-1">{selectedItem.title}</h4>
                  <p className="text-white/50 text-xs">{selectedItem.date}</p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => playSound("hover")}
                onClick={handleCloseItem}
                className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </motion.button>
            </div>

            {/* Main Image Slider View */}
            <div className="relative w-full max-w-5xl flex-1 my-4 flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={true} custom={direction} mode="popLayout">
                <motion.img
                  key={currentImageIndex}
                  src={selectedItem.images[currentImageIndex]}
                  custom={direction}
                  variants={sliderVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 320, damping: 28 },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 }
                  }}
                  className="absolute max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl cursor-default border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {selectedItem.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => playSound("hover")}
                    onClick={(e) => paginate(-1, e)}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all z-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => playSound("hover")}
                    onClick={(e) => paginate(1, e)}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all z-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </motion.button>
                </>
              )}
            </div>

            {/* Bottom Interactive Thumbnail Bar */}
            <div className="w-full max-w-2xl flex flex-col items-center gap-3 z-30 pb-2" onClick={(e) => e.stopPropagation()}>
              {selectedItem.images.length > 1 && (
                <div className="flex items-center gap-2 max-w-full overflow-x-auto p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  {selectedItem.images.map((img: string, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => {
                        playSound("slide");
                        setDirection(idx > currentImageIndex ? 1 : -1);
                        setCurrentImageIndex(idx);
                      }}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${
                        idx === currentImageIndex 
                          ? 'ring-2 ring-amber-400 scale-105 opacity-100 shadow-md' 
                          : 'opacity-40 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="text-white/60 text-xs font-medium tracking-widest uppercase">
                {currentImageIndex + 1} / {selectedItem.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}