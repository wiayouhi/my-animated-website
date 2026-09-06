"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTransition } from "./TransitionContext"; // นำเข้าจาก Context กลาง

// รายชื่อไฟล์ภาพในโฟลเดอร์ public/images/ ของคุณ
const LOCAL_IMAGES = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
];

const playWarpSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.addEventListener("ended", () => {
      void ctx.close();
    }, { once: true });
  } catch (e) {
    console.error("Audio API not supported", e);
  }
};

/**
 * Pixelated Canvas Component
 * ดึงภาพจาก public/images/ แสดงผลเต็มกรอบ (Full Cover) สลับภาพอัตโนมัติ
 */
function PixelatedCanvas({
  images = LOCAL_IMAGES,
  pixelSize = 6,
  interval = 4000,
}: {
  images?: string[];
  pixelSize?: number;
  interval?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 80 });

  // สลับรูปภาพตามช่วงเวลา (Interval)
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // วาดและทำ Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === "visible";
    let disposed = false;
    let particles: Array<{
      x: number;
      y: number;
      originX: number;
      originY: number;
      color: string;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[activeImageIndex] || images[0];

    img.onload = () => {
      const w = canvas.parentElement?.clientWidth || 400;
      const h = canvas.parentElement?.clientHeight || 400;
      canvas.width = w;
      canvas.height = h;

      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");
      const renderWidth = Math.floor(w / pixelSize);
      const renderHeight = Math.floor(h / pixelSize);

      offCanvas.width = renderWidth;
      offCanvas.height = renderHeight;

      if (offCtx) {
        // คำนวณแบบ COVER (ขยายขอบภาพให้เต็มกรอบพอดี)
        const imgAspect = img.width / img.height;
        const canvasAspect = renderWidth / renderHeight;
        let drawW, drawH, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          drawH = renderHeight;
          drawW = drawH * imgAspect;
          offsetX = (renderWidth - drawW) / 2;
          offsetY = 0;
        } else {
          drawW = renderWidth;
          drawH = drawW / imgAspect;
          offsetX = 0;
          offsetY = (renderHeight - drawH) / 2;
        }

        offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
        const imgData = offCtx.getImageData(0, 0, renderWidth, renderHeight).data;

        particles = [];
        for (let y = 0; y < renderHeight; y++) {
          for (let x = 0; x < renderWidth; x++) {
            const i = (y * renderWidth + x) * 4;
            const alpha = imgData[i + 3];

            if (alpha > 10) {
              const r = imgData[i];
              const g = imgData[i + 1];
              const b = imgData[i + 2];
              const posX = x * pixelSize;
              const posY = y * pixelSize;

              particles.push({
                x: posX + (Math.random() - 0.5) * 50,
                y: posY + (Math.random() - 0.5) * 50,
                originX: posX,
                originY: posY,
                color: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`,
                vx: 0,
                vy: 0,
                size: pixelSize - 0.5,
              });
            }
          }
        }
      }
    };

    const render = () => {
      if (disposed || !isVisible || !isDocumentVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction เมาส์
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx -= Math.cos(angle) * force * 5;
          p.vy -= Math.sin(angle) * force * 5;
        }

        // สปริงพิกเซลกลับที่เดิม
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * 0.08;
        p.vy += homeDy * 0.08;

        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (!animationFrameId && isVisible && isDocumentVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startRendering();
    }, { threshold: 0 });
    visibilityObserver.observe(canvas);

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";
      if (isDocumentVisible) startRendering();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    startRendering();

    return () => {
      disposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeImageIndex, images, pixelSize]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-crosshair"
      />

      {/* จุดบอกสไลด์ภาพ */}
      <div className="absolute bottom-3 right-3 flex gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeImageIndex
                ? "bg-blue-500 w-5"
                : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { triggerTransition } = useTransition();

  const pullProgress = useMotionValue(0);
  const smoothProgress = useSpring(pullProgress, { stiffness: 200, damping: 25 });

  const barHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const barOpacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    let accumulated = 0;
    const THRESHOLD = 350;
    let resetTimeout: NodeJS.Timeout;
    let touchStartY = 0;
    let isFired = false;

    const checkAndNavigate = () => {
      if (accumulated >= THRESHOLD && !isFired) {
        isFired = true;
        playWarpSound();
        triggerTransition("/about");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isFired) return;
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

      if (isAtBottom && e.deltaY > 0) {
        accumulated += e.deltaY;
        if (accumulated > THRESHOLD) accumulated = THRESHOLD;
        pullProgress.set(accumulated / THRESHOLD);
        checkAndNavigate();

        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          accumulated = 0;
          pullProgress.set(0);
        }, 300);
      }
    };

    const handleTouchStart = (e: TouchEvent) => (touchStartY = e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (isFired) return;
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (isAtBottom && deltaY > 0) {
        accumulated += deltaY * 0.6;
        touchStartY = e.touches[0].clientY;

        if (accumulated > THRESHOLD) accumulated = THRESHOLD;
        pullProgress.set(accumulated / THRESHOLD);
        checkAndNavigate();

        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          accumulated = 0;
          pullProgress.set(0);
        }, 300);
      }
    };
    const handleTouchEnd = () => {
      if (accumulated < THRESHOLD) {
        accumulated = 0;
        pullProgress.set(0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(resetTimeout);
    };
  }, [triggerTransition, pullProgress]);

  return (
    <>
      {/* Progress Bar แนวตั้ง */}
      <motion.div
        style={{ opacity: barOpacity }}
        className="fixed top-1/2 right-6 -translate-y-1/2 z-50 flex items-center gap-3 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping mb-2" />
          <span
            className="text-xs font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Keep scrolling to explore
          </span>
        </div>
        <div className="w-2.5 h-80 bg-zinc-800/80 rounded-full overflow-hidden backdrop-blur shadow-lg border border-zinc-700/50 flex flex-col justify-start">
          <motion.div
            style={{ height: barHeight }}
            className="w-full bg-gradient-to-b from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.9)] rounded-full relative"
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/50 blur-sm rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="site-footer"
        className="relative w-full bg-zinc-950 text-zinc-100 overflow-hidden pt-24 pb-12"
      >
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <CloudBlob className="top-[-6rem] left-[-4rem] w-[26rem] h-[26rem] bg-blue-600/20" duration={14} />
        <CloudBlob className="bottom-[-8rem] right-[-6rem] w-[24rem] h-[24rem] bg-blue-500/10" duration={18} delay={2} />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="flex flex-col space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                  THANKS FOR <span className="w-1 h-5 bg-zinc-100 animate-pulse inline-block"></span>
                </h3>
                <div className="text-5xl md:text-6xl font-black uppercase leading-tight tracking-tight">
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="border-4 border-zinc-100 px-3 py-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                      SCROLLING
                    </span>
                  </div>
                  <div className="text-3xl md:text-4xl mt-4">LET'S BUILD SOMETHING</div>
                  <div className="flex items-center gap-3 mt-2 text-3xl md:text-4xl">
                    & TURN IDEAS{" "}
                    <span className="bg-blue-500 text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                      INTO REALITY
                    </span>
                  </div>
                </div>
                <p className="text-zinc-400 max-w-md text-lg leading-relaxed mt-6">
                  Got a project in mind or just want to say hi? I'm always open to new opportunities and good conversations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button className="bg-zinc-100 text-zinc-900 px-8 py-3 rounded hover:bg-white transition-colors flex items-center gap-2 font-medium">
                  Get In Touch <span>→</span>
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-transparent text-zinc-100 border-2 border-zinc-700 px-8 py-3 rounded hover:border-zinc-500 transition-colors flex items-center gap-2 font-medium"
                >
                  Back To Top
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
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-8 mt-4 border-t border-zinc-800"
              >
                {[
                  { value: "24/7", label: "Open To Work" },
                  { value: "<24h", label: "Reply Time" },
                  { value: "© " + new Date().getFullYear(), label: "DEV404" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center text-center p-4 border border-zinc-800 border-dashed rounded relative"
                  >
                    <div className="absolute top-[-2px] left-[-2px] w-1 h-1 bg-zinc-700"></div>
                    <div className="absolute top-[-2px] right-[-2px] w-1 h-1 bg-zinc-700"></div>
                    <div className="absolute bottom-[-2px] left-[-2px] w-1 h-1 bg-zinc-700"></div>
                    <div className="absolute bottom-[-2px] right-[-2px] w-1 h-1 bg-zinc-700"></div>
                    <span className="text-2xl font-black mb-1">{item.value}</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
              className="w-full relative"
            >
              <div className="p-4 md:p-6 bg-zinc-900 border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-100 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-100 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-100 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-100 rounded-br"></div>

                <div className="w-full h-[350px] md:h-[450px] bg-black rounded relative overflow-hidden flex items-center justify-center">
                  {/* แสดง Canvas ดึงภาพจาก public/images/ แบบเต็มกรอบ */}
                  <PixelatedCanvas images={LOCAL_IMAGES} pixelSize={6} interval={4000} />
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-zinc-500 flex items-center gap-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    LET'S CONNECT:
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <a
                      href="mailto:hello@example.com"
                      className="flex items-center justify-center gap-2 py-2.5 px-2 border border-zinc-800 rounded text-sm font-medium hover:bg-zinc-800/60 hover:border-zinc-700 transition-all"
                    >
                      Email
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 py-2.5 px-2 border border-zinc-800 rounded text-sm font-medium hover:bg-zinc-800/60 hover:border-zinc-700 transition-all"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 py-2.5 px-2 border border-zinc-800 rounded text-sm font-medium hover:bg-zinc-800/60 hover:border-zinc-700 transition-all"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}

function CloudBlob({
  className,
  duration = 16,
  delay = 0,
}: {
  className: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full blur-3xl pointer-events-none z-0 ${className}`}
      animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}