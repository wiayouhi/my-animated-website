"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLoader from "./PageLoader";

export default function InitialLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClientCheckDone, setIsClientCheckDone] = useState(false);

  useEffect(() => {
    // เช็กว่าใน Session นี้ (แท็บนี้) เคยโหลดเสร็จไปแล้วหรือยัง
    const hasLoadedBefore = sessionStorage.getItem("first_load_done");
    
    if (!hasLoadedBefore) {
      setIsFirstVisit(true); // เข้าเว็บครั้งแรก ให้โชว์ Loader
    } else {
      setIsLoaded(true); // เคยโหลดแล้ว ให้ข้ามไปเลย
    }
    
    setIsClientCheckDone(true);
  }, []);

  // ล็อค Scroll เฉพาะตอนที่กำลังโหลดครั้งแรกเท่านั้น
  useEffect(() => {
    if (isFirstVisit && !isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFirstVisit, isLoaded]);

  const handleFinish = () => {
    setIsLoaded(true);
    // บันทึกไว้ว่าโหลดเสร็จแล้ว ไปหน้าอื่นแล้วกลับมาจะได้ไม่โหลดซ้ำ
    sessionStorage.setItem("first_load_done", "true"); 
  };

  // ป้องกัน Hydration Error ของ Next.js ตอนเรนเดอร์ครั้งแรก
  if (!isClientCheckDone) return <>{children}</>;

  // ถ้าไม่ใช่การเข้าเว็บครั้งแรก (เช่น กลับมาจากหน้า About) ให้แสดงเนื้อหาปกติเลยแบบไม่ใช้เฟดอิน
  if (!isFirstVisit) {
    return <>{children}</>;
  }

  // สำหรับการเข้าเว็บครั้งแรกเท่านั้น (มีแอนิเมชัน Loader และหน้าเว็บค่อยๆ เฟดขึ้นมา)
  return (
    <>
      {!isLoaded && <PageLoader onFinish={handleFinish} />}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}