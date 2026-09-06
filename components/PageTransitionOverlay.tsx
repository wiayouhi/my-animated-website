"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function PageTransitionOverlay({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ clipPath: "circle(0% at 100% 50%)" }}
          animate={{ clipPath: "circle(150% at 100% 50%)" }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
          }}
          // z-[9999] ป้องกันโดน Navbar/Header ทับ และ pointer-events-auto กันการคลิกซ้ำ
          className="fixed inset-0 z-[9999] bg-blue-600 flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase"
          >
            Entering About...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}