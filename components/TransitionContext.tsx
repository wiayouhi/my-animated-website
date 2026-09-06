"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageTransitionOverlay from "./PageTransitionOverlay";

interface TransitionContextType {
  triggerTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  triggerTransition: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const triggerTransition = (href: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    // 1. ล็อคไม่ให้ผู้ใช้ไถหน้าจอต่อระหว่างเล่นอนิเมชัน
    document.body.style.overflow = "hidden";

    // 2. รอให้จอฟ้าขยายจนบังมิดจอ (800ms) แล้วค่อยเปลี่ยนหน้า
    setTimeout(() => {
      // แอบรีเซ็ต Scroll ไปบนสุดเบื้องหลังแผ่นสีฟ้า
      window.scrollTo(0, 0);
      
      // ปิด scroll: false เพื่อไม่ให้ Next.js ดีดหน้าจอเองแบบกระตุก
      router.push(href, { scroll: false });
    }, 800);
  };

  useEffect(() => {
    if (isTransitioning) {
      // 3. หน่วงเวลาเพิ่มเล็กน้อยเพื่อให้ React เรนเดอร์ DOM ของหน้าใหม่เสร็จสมบูรณ์ก่อนเอาแผ่นสีฟ้าออก
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        // ปลดล็อค Scroll ให้กลับมาไถได้ปกติ
        document.body.style.overflow = "";
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <PageTransitionOverlay isVisible={isTransitioning} />
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);