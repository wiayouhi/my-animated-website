"use client";

import { useEffect, useRef } from "react";

// รายการข้อความ, ไอคอน และสไตล์อนิเมชันของ Favicon
const items = [
  { msg: "⚔️ WiaYouHi: Awakening", icon: "⚔️", iconAnim: "spin" },
  { msg: "✨ thanawat.wia Activated", icon: "✨", iconAnim: "pulse" },
  { msg: "🔥 LEVEL UP DETECTED", icon: "🔥", iconAnim: "bounce" },
  { msg: "💥 Power Sync Complete", icon: "💥", iconAnim: "pulse" },
  { msg: "🧬 IG: Thanawat.wia", icon: "🧬", iconAnim: "spin" },
] as const;

const titleEffects = ["typing", "glitch", "scroll", "wave"];

export default function DynamicTabHeader() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const faviconIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationInProgress = useRef(false);
  const currentMessageIndex = useRef(0);
  const isPageActive = useRef(true);

  // ตัวแปรสำหรับคุม Favicon Canvas
  const frameRef = useRef(0);

  // ----------------------------------------------------------------
  // 🎨 ระบบ Animated Favicon ด้วย Canvas (หมุน / ย่อขยาย / เด้ง)
  // ----------------------------------------------------------------
  const startFaviconAnimation = (
    emoji: string,
    animType: "spin" | "pulse" | "bounce" = "spin"
  ) => {
    // ล้าง Interval เดิมก่อนสร้างอนิเมชันใหม่
    if (faviconIntervalRef.current) clearInterval(faviconIntervalRef.current);
    if (typeof document === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    // ทำการเรนเดอร์เฟรมใหม่ทุกๆ 80ms (ประมาณ 12-15 FPS กำลังสวยและไม่กินเครื่อง)
    faviconIntervalRef.current = setInterval(() => {
      frameRef.current += 1;
      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      ctx.translate(16, 16); // ย้ายจุดหมุนมาไว้ตรงกลาง

      const step = frameRef.current;

      // คำนวณรูปแบบอนิเมชันของ Favicon
      if (animType === "spin") {
        // 🔄 เอฟเฟกต์หมุน 360 องศา
        const angle = (step * 12 * Math.PI) / 180;
        ctx.rotate(angle);
      } else if (animType === "pulse") {
        // 💓 เอฟเฟกต์ย่อ-ขยาย (หายใจ)
        const scale = 0.82 + Math.sin(step * 0.25) * 0.22;
        ctx.scale(scale, scale);
      } else if (animType === "bounce") {
        // 🏀 เอฟเฟกต์เด้ง ขึ้น-ลง
        const translateY = Math.sin(step * 0.35) * 3.5;
        ctx.translate(0, translateY);
      }

      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, 0, 2);
      ctx.restore();

      if (link) {
        link.href = canvas.toDataURL("image/png");
      }
    }, 80);
  };

  useEffect(() => {
    // ----------------------------------------------------------------
    // 📝 ระบบ Title Animation (เอฟเฟกต์ชื่อแท็บ)
    // ----------------------------------------------------------------
    const startRandomEffect = () => {
      if (animationInProgress.current || !isPageActive.current) return;
      animationInProgress.current = true;

      const effect = titleEffects[Math.floor(Math.random() * titleEffects.length)];
      const currentItem = items[currentMessageIndex.current];

      // เริ่มเล่นอนิเมชันของ Favicon ให้สัมพันธ์กับข้อความ
      startFaviconAnimation(currentItem.icon, currentItem.iconAnim);

      currentMessageIndex.current =
        (currentMessageIndex.current + 1) % items.length;

      if (effect === "typing") typingEffect(currentItem.msg);
      else if (effect === "glitch") glitchEffect(currentItem.msg);
      else if (effect === "scroll") scrollEffect(currentItem.msg);
      else if (effect === "wave") waveEffect(currentItem.msg);
    };

    // Typing Effect
    const typingEffect = (text: string) => {
      let i = 0;
      const step = () => {
        if (!isPageActive.current) return;
        document.title = text.substring(0, i) + "_";
        i++;
        if (i <= text.length) {
          timeoutRef.current = setTimeout(step, 60);
        } else {
          timeoutRef.current = setTimeout(() => {
            animationInProgress.current = false;
            startRandomEffect();
          }, 1500);
        }
      };
      step();
    };

    // Glitch Effect
    const glitchEffect = (text: string) => {
      const glitchChars = "!@#$%^&*()_+=<>?/|\\~";
      let count = 0;
      const max = 15;
      const glitch = () => {
        if (!isPageActive.current) return;
        const glitched = text
          .split("")
          .map((c) =>
            Math.random() < 0.25
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : c
          )
          .join("");
        document.title = glitched;
        count++;
        if (count < max) {
          timeoutRef.current = setTimeout(glitch, 70);
        } else {
          document.title = text;
          timeoutRef.current = setTimeout(() => {
            animationInProgress.current = false;
            startRandomEffect();
          }, 1500);
        }
      };
      glitch();
    };

    // Scroll Effect
    const scrollEffect = (text: string) => {
      let msg = "   " + text + "   ";
      let i = 0;
      let scrollCycles = 0;
      const maxCycles = 3;

      const scroll = () => {
        if (!isPageActive.current) return;
        document.title = msg.substring(i) + msg.substring(0, i);
        i = (i + 1) % msg.length;

        if (i === 0) scrollCycles++;

        if (scrollCycles < maxCycles) {
          timeoutRef.current = setTimeout(scroll, 120);
        } else {
          timeoutRef.current = setTimeout(() => {
            animationInProgress.current = false;
            startRandomEffect();
          }, 1000);
        }
      };
      scroll();
    };

    // Wave Effect
    const waveEffect = (text: string) => {
      let index = 0;
      const wave = () => {
        if (!isPageActive.current) return;
        let result = "";
        for (let i = 0; i < text.length; i++) {
          result += i === index ? text[i].toUpperCase() : text[i];
        }
        document.title = result;
        index++;
        if (index < text.length) {
          timeoutRef.current = setTimeout(wave, 100);
        } else {
          timeoutRef.current = setTimeout(() => {
            animationInProgress.current = false;
            startRandomEffect();
          }, 1200);
        }
      };
      wave();
    };

    // ----------------------------------------------------------------
    // 👁️ ตอบสนองเมื่อสลับหน้าจอ (Tab Active / Inactive)
    // ----------------------------------------------------------------
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // เมื่อสลับไปหน้าอื่น -> แสดงหน้าเศร้าพร้อมอนิเมชันเด้งเร่งด่วน
        isPageActive.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        animationInProgress.current = false;

        document.title = "🥺 อย่าเพิ่งไปไหนสิ! คิดถึงจัง...";
        startFaviconAnimation("🥺", "bounce");
      } else {
        // เมื่อผู้ใช้คลิกกลับมา -> แสดงสายฟ้าหมุนต้อนรับ
        isPageActive.current = true;
        document.title = "⚡ WELCOME BACK!";
        startFaviconAnimation("⚡", "spin");

        timeoutRef.current = setTimeout(() => {
          startRandomEffect();
        }, 1200);
      }
    };

    // เริ่มรันอนิเมชัน
    startRandomEffect();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (faviconIntervalRef.current) clearInterval(faviconIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}