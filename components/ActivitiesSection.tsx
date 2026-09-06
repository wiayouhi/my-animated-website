"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

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
    opacity: 1 - index * 0.1,
    zIndex: 10 - index,
  }),
  hover: (index: number) => ({
    rotate: index === 0 ? -15 : index === 1 ? 0 : 15,
    x: index === 0 ? -40 : index === 1 ? 0 : 40,
    y: index === 0 ? -15 : index === 1 ? -25 : -10,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  }),
};

const sliderVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 800 : -800,
    opacity: 0,
    scale: direction === 0 ? 0.3 : 0.8,
  }),
  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction === 0 ? 0 : direction < 0 ? 800 : -800,
    opacity: 0,
    scale: direction === 0 ? 0.5 : 0.8,
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

  const paginate = (newDirection: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex >= selectedItem.images.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = selectedItem.images.length - 1;
      return nextIndex;
    });
  };

  const handleOpenItem = (item: any) => {
    setDirection(0);
    setCurrentImageIndex(0);
    setSelectedItem(item);
  };

  // ฟังก์ชันแยกสำหรับ Render การ์ด เพื่อลดความซ้ำซ้อนของโค้ด
  const renderCard = (item: any, idx: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="flex flex-col items-center group cursor-pointer"
      onClick={() => handleOpenItem(item)}
    >
      <motion.div
        className="relative w-full aspect-[4/3] mb-8"
        initial="initial"
        whileHover="hover"
      >
        {/* ดึงมาโชว์เป็นหน้าปกแค่ 3 รูปแรก */}
        {item.images.slice(0, 3).map((img: string, index: number) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            className="absolute inset-0 bg-zinc-100 p-2 rounded-2xl shadow-xl border border-zinc-200"
          >
            <div className="w-full h-full relative overflow-hidden rounded-xl bg-zinc-200">
              <img 
                src={img} 
                alt={`img-${index}`} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; 
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </motion.div>
        ))}
        
        {item.images.length > 1 && (
          <div className="absolute -bottom-4 right-4 z-20 bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            ดูทั้งหมด {item.images.length} รูป
          </div>
        )}
        
        <div className={`absolute -top-3 -left-3 z-30 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg transform transition-transform group-hover:scale-110
          ${item.type === 'Certificate' ? 'bg-amber-500' : 'bg-rose-500'} text-white`}
        >
          {item.type === 'Certificate' ? '🏆 Certificate' : '🏕️ Activity'}
        </div>
      </motion.div>

      <div className="text-center w-full px-4">
        <span className="text-sm font-bold text-zinc-400 mb-2 block">{item.date}</span>
        <h3 className={`text-xl font-bold text-zinc-900 mb-3 transition-colors ${item.type === 'Certificate' ? 'group-hover:text-amber-500' : 'group-hover:text-rose-500'}`}>
          {item.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-white pb-32">
      
      {/* ==============================================
          ส่วนที่ 1: ACTIVITIES (กิจกรรม)
          ============================================== */}
      <section className="pt-32 px-6" id="activities">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Journey</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
              รวมภาพกิจกรรมที่เข้าร่วม และประสบการณ์นอกห้องเรียน
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {activitiesData.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>
      </section>

      {/* เส้นคั่นระหว่าง Section (Optional) */}
      <div className="max-w-4xl mx-auto mt-24 mb-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
      </div>

      {/* ==============================================
          ส่วนที่ 2: CERTIFICATES (เกียรติบัตร)
          ============================================== */}
      <section className="pt-16 px-6" id="certificates">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Certificates</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
              เกียรติบัตรและรางวัลแห่งความภาคภูมิใจ
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {certificatesData.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>
      </section>

      {/* ==============================================
          ส่วนของ LIGHTBOX (เปิดดูรูปภาพ) ใช้ร่วมกันทั้ง 2 หมวด
          ============================================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="relative w-full max-w-6xl h-full md:h-[85vh] flex items-center justify-center overflow-hidden">
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
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { type: "spring", stiffness: 200, damping: 20 }
                  }}
                  className="absolute max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default bg-zinc-900"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => paginate(-1, e)}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-black/70 hover:scale-110 border border-white/10 backdrop-blur-md transition-all z-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>

                  <button
                    onClick={(e) => paginate(1, e)}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-black/70 hover:scale-110 border border-white/10 backdrop-blur-md transition-all z-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full z-20 shadow-lg tracking-widest">
                    {currentImageIndex + 1} / {selectedItem.images.length}
                  </div>
                </>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 md:bottom-auto md:top-6 left-6 md:left-8 text-white z-20 pointer-events-none drop-shadow-lg max-w-sm"
              >
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-2">
                  {selectedItem.type === 'Certificate' ? '🏆 Certificate' : '🏕️ Activity'}
                </div>
                <h4 className="text-xl md:text-3xl font-bold mb-1">{selectedItem.title}</h4>
                <p className="text-white/70 text-sm hidden md:block">{selectedItem.date}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}