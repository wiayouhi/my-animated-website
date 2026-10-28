"use client";

import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { CloudShader } from "@/components/ui/cloud-shader";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

/* =========================================
   Config
========================================= */
const DISCORD_USER_ID = "902739412172046427";
const LAT = 13.75;
const LON = 100.5167;
const EASE = [0.76, 0, 0.24, 1] as const;

/* =========================================
   Types
========================================= */
interface DiscordActivity {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}
type Status = "online" | "idle" | "dnd" | "offline";
interface DiscordData {
  discord_user: { username: string; avatar: string; id: string; global_name: string };
  discord_status: Status;
  activities: DiscordActivity[];
}
interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
}
type Scene = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

/* =========================================
   Helpers
========================================= */
const parseDiscordAsset = (appId?: string, key?: string) => {
  if (!key) return null;
  if (key.startsWith("mp:external/")) {
    const https = key.split("/https/");
    if (https.length > 1) return `https://${https[1]}`;
    const http = key.split("/http/");
    if (http.length > 1) return `http://${http[1]}`;
  }
  if (key.startsWith("spotify:")) return `https://i.scdn.co/image/${key.replace("spotify:", "")}`;
  if (appId) return `https://cdn.discordapp.com/app-assets/${appId}/${key}.png`;
  return null;
};

const getScene = (code: number): Scene => {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
};

const SCENE_TEXT: Record<Scene, string> = {
  clear: "แจ่มใส",
  cloudy: "มีเมฆ",
  fog: "มีหมอก",
  rain: "ฝนตก",
  snow: "หิมะตก",
  storm: "พายุฝนฟ้าคะนอง",
};

const SCENE_BG = (scene: Scene, day: boolean) => {
  if (!day && (scene === "clear" || scene === "cloudy"))
    return "linear-gradient(160deg,#0b1026 0%,#1b1f4b 60%,#2a2564 100%)";
  switch (scene) {
    case "clear": return "linear-gradient(160deg,#1d6fe0 0%,#4aa3f5 55%,#9ad0ff 100%)";
    case "cloudy": return "linear-gradient(160deg,#4a6fa5 0%,#7f9cc4 60%,#b4c6de 100%)";
    case "fog": return "linear-gradient(160deg,#6b7787 0%,#98a2b0 60%,#c3c9d1 100%)";
    case "rain": return "linear-gradient(160deg,#25364f 0%,#3b5273 60%,#566f93 100%)";
    case "snow": return "linear-gradient(160deg,#5c7391 0%,#90a6c2 60%,#dbe5f1 100%)";
    case "storm": return "linear-gradient(160deg,#120f26 0%,#2a2347 60%,#443b6b 100%)";
  }
};

// deterministic pseudo random (avoids SSR hydration mismatch)
const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 12.9898 * s) * 43758.5453;
  return x - Math.floor(x);
};

/* =========================================
   Motion variants (Adobe-style masked reveals)
========================================= */
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const wipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

const rise: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: EASE } },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

/* =========================================
   Small UI pieces
========================================= */
const FlipWords = ({ words }: { words: string[] }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % words.length), 3000);
    return () => clearInterval(t);
  }, [words]);
  const longest = words.reduce((a, b) => (a.length > b.length ? a : b));
  return (
    <span className="relative inline-block text-left">
      <span className="invisible">{longest}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 12 }}
          className="absolute left-0 top-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/** Corner ticks that draw in like a viewfinder */
const Corners = ({ color = "border-white/50" }: { color?: string }) => (
  <>
    {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c, k) => (
      <motion.span
        key={k}
        variants={{ hidden: { opacity: 0, scale: 0.4 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.6 + k * 0.08, duration: 0.4 } } }}
        className={`pointer-events-none absolute z-20 h-3 w-3 ${c} ${color}`}
      />
    ))}
  </>
);

const STATUS_DOT: Record<Status, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-500",
  dnd: "bg-rose-500",
  offline: "bg-slate-500",
};
const STATUS_RING: Record<Status, string> = {
  online: "#10b981",
  idle: "#f59e0b",
  dnd: "#f43f5e",
  offline: "#64748b",
};

/* =========================================
   Weather scene (changes with real weather)
========================================= */
const WeatherScene = ({ scene, day }: { scene: Scene; day: boolean }) => {
  const reduce = useReducedMotion();
  const drops = useMemo(() => Array.from({ length: 28 }, (_, i) => i), []);
  const flakes = useMemo(() => Array.from({ length: 22 }, (_, i) => i), []);
  const stars = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);
  const showCloud = scene === "cloudy" || scene === "rain" || scene === "storm" || scene === "snow";
  const cloudTone = scene === "storm" ? "bg-slate-900/70" : scene === "rain" ? "bg-slate-700/60" : "bg-white/50";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sun / Moon */}
      {(scene === "clear" || scene === "cloudy") && (
        <div className="absolute right-6 top-6">
          {day ? (
            <>
              <motion.div
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-10"
              >
                {Array.from({ length: 12 }).map((_, k) => (
                  <span
                    key={k}
                    className="absolute left-1/2 top-1/2 h-px w-12 origin-left bg-gradient-to-r from-amber-200/80 to-transparent"
                    style={{ transform: `rotate(${k * 30}deg) translateX(34px)` }}
                  />
                ))}
              </motion.div>
              <motion.div
                animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-14 w-14 rounded-full bg-amber-200 shadow-[0_0_60px_20px_rgba(253,224,71,0.55)]"
              />
            </>
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-100 shadow-[0_0_40px_8px_rgba(226,232,240,0.45)]">
              <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-slate-300/70" />
              <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-300/70" />
            </div>
          )}
        </div>
      )}

      {/* Stars */}
      {!day && (scene === "clear" || scene === "cloudy") &&
        stars.map((i) => (
          <motion.span
            key={i}
            className="absolute h-0.5 w-0.5 bg-white"
            style={{ left: `${rnd(i) * 100}%`, top: `${rnd(i, 2) * 60}%` }}
            animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + rnd(i, 3) * 3, repeat: Infinity, delay: rnd(i, 4) * 2 }}
          />
        ))}

      {/* Drifting clouds */}
      {showCloud &&
        [0, 1, 2].map((k) => (
          <motion.div
            key={k}
            className={`absolute h-10 w-32 rounded-full blur-xl ${cloudTone}`}
            style={{ top: `${8 + k * 22}%`, left: "-30%" }}
            animate={reduce ? undefined : { x: ["0vw", "140%"] }}
            transition={{ duration: 28 + k * 9, repeat: Infinity, ease: "linear", delay: -k * 11 }}
          />
        ))}

      {/* Rain / storm */}
      {(scene === "rain" || scene === "storm") &&
        drops.map((i) => (
          <motion.span
            key={i}
            className="absolute h-4 w-px bg-sky-200/70"
            style={{ left: `${rnd(i) * 100}%`, top: "-10%", rotate: "12deg" }}
            animate={reduce ? undefined : { y: ["0%", "1400%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.7 + rnd(i, 2) * 0.5,
              repeat: Infinity,
              delay: rnd(i, 3) * 1.5,
              ease: "linear",
            }}
          />
        ))}

      {/* Lightning */}
      {scene === "storm" && !reduce && (
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{ opacity: [0, 0, 0.85, 0, 0.5, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.6, 0.62, 0.65, 0.68, 0.72, 1] }}
        />
      )}

      {/* Snow */}
      {scene === "snow" &&
        flakes.map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${rnd(i) * 100}%`,
              top: "-6%",
              width: 2 + rnd(i, 2) * 3,
              height: 2 + rnd(i, 2) * 3,
            }}
            animate={reduce ? undefined : { y: ["0%", "3200%"], x: [0, 14, -10, 8] }}
            transition={{ duration: 5 + rnd(i, 3) * 4, repeat: Infinity, delay: rnd(i, 4) * 5, ease: "linear" }}
          />
        ))}

      {/* Fog */}
      {scene === "fog" &&
        [0, 1, 2, 3].map((k) => (
          <motion.div
            key={k}
            className="absolute h-8 w-[160%] bg-white/30 blur-xl"
            style={{ top: `${15 + k * 20}%` }}
            animate={reduce ? undefined : { x: k % 2 ? ["-20%", "0%", "-20%"] : ["0%", "-20%", "0%"] }}
            transition={{ duration: 12 + k * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
};

/* =========================================
   Mini map with coordinate pin
========================================= */
const MiniMap = ({ lat, lon }: { lat: number; lon: number }) => (
  <div className="relative h-full w-full overflow-hidden bg-zinc-950">
    <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="120" fill="url(#grid)" />
      {/* river */}
      <motion.path
        d="M-10 90 C60 60 90 110 160 70 S260 30 330 50"
        fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="6" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      {/* roads */}
      {["M0 30 L320 45", "M110 0 L150 120", "M230 0 L200 120"].map((d, k) => (
        <motion.path
          key={k} d={d} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 + k * 0.2, ease: EASE }}
        />
      ))}
    </svg>

    {/* pin */}
    <div className="absolute left-[52%] top-[52%] -translate-x-1/2 -translate-y-1/2">
      {[0, 1].map((k) => (
        <motion.span
          key={k}
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-400"
          animate={{ scale: [0.3, 2], opacity: [0.8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: k * 1.2, ease: "easeOut" }}
        />
      ))}
      <motion.svg
        width="22" height="30" viewBox="0 0 22 30" className="relative drop-shadow-lg"
        animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginTop: -22 }}
      >
        <path d="M11 0C5 0 0 4.8 0 10.8 0 19 11 30 11 30s11-11 11-19.2C22 4.8 17 0 11 0z" fill="#f43f5e" />
        <circle cx="11" cy="10.5" r="4" fill="#fff" />
      </motion.svg>
    </div>

    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-zinc-300">
      <span className="bg-zinc-950/80 px-1.5 py-0.5">{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</span>
      <span className="bg-zinc-950/80 px-1.5 py-0.5 text-rose-300">กรุงเทพฯ</span>
    </div>
  </div>
);

/* =========================================
   Weather card
========================================= */
const WeatherCard = ({ weather, loading }: { weather: WeatherData | null; loading: boolean }) => {
  const scene: Scene = weather ? getScene(weather.weathercode) : "cloudy";
  const day = weather ? weather.is_day === 1 : true;

  return (
    <motion.div variants={wipe} className="relative flex flex-col overflow-hidden rounded-sm border border-white/10 shadow-xl">
      <Corners />
      {/* animated scene */}
      <div className="relative min-h-[210px] overflow-hidden p-5 text-white sm:p-6">
        <AnimatePresence mode="sync">
          <motion.div
            key={`${scene}-${day}`}
            className="absolute inset-0"
            style={{ background: SCENE_BG(scene, day) }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <WeatherScene scene={scene} day={day} />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold drop-shadow">กรุงเทพมหานคร</h3>
            <p className="text-xs text-white/70">สภาพอากาศตอนนี้</p>
          </div>
          {loading || !weather ? (
            <div className="mt-8 h-16 w-32 animate-pulse bg-white/20" />
          ) : (
            <div className="mt-8 flex items-end justify-between">
              <div>
                <div className="flex items-start leading-none">
                  <span className="text-7xl font-black tracking-tighter drop-shadow-lg">
                    {Math.round(weather.temperature)}
                  </span>
                  <span className="mt-1 text-2xl font-bold text-white/80">°C</span>
                </div>
                <p className="mt-2 text-base font-semibold drop-shadow">
                  {SCENE_TEXT[scene]}{!day && " · กลางคืน"}
                </p>
              </div>
              <div className="text-right text-xs text-white/80">
                <p className="font-mono">ลม {Math.round(weather.windspeed)} กม./ชม.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* map */}
      <div className="h-28 border-t border-white/10">
        <MiniMap lat={LAT} lon={LON} />
      </div>
    </motion.div>
  );
};

/* =========================================
   Calendar card
========================================= */
const CalendarCard = () => {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  if (!today) return <div className="min-h-[260px] bg-white/60 dark:bg-zinc-900/60" />;

  const month = today.toLocaleString("th-TH", { month: "long" });
  const year = today.getFullYear() + 543;
  const first = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const total = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <motion.div
      variants={wipe}
      className="relative flex flex-1 flex-col rounded-sm border border-zinc-200 bg-white/80 p-5 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-6"
    >
      <Corners color="border-zinc-400/50" />
      <div className="mb-4 flex items-center justify-between">
        <div className="overflow-hidden">
          <motion.h3 variants={rise} className="text-lg font-bold text-zinc-900 dark:text-white">
            {month} {year}
          </motion.h3>
        </div>
        <span className="bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">{today.getDate()}</span>
      </div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-bold text-zinc-400">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
        {Array.from({ length: first }, (_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: total }, (_, i) => i + 1).map((d, idx) => {
          const isToday = d === today.getDate();
          return (
            <motion.div
              key={d}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.012, duration: 0.25 }}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-sm ${
                isToday
                  ? "bg-rose-500 font-bold text-white shadow-lg shadow-rose-500/40"
                  : "text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {d}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* =========================================
   Discord: compact (circle) + wide (16:9)
========================================= */
interface DiscordViewProps {
  user: DiscordData["discord_user"];
  status: Status;
  activity?: DiscordActivity;
  avatarUrl: string;
  largeImg: string | null;
  smallImg: string | null;
  banner: string;
  loading: boolean;
}

const activityLabel = (a?: DiscordActivity) =>
  !a ? "" : a.type === 2 ? "กำลังฟัง" : a.type === 3 ? "กำลังดู" : "กำลังเล่น";

const DiscordCompact = (p: DiscordViewProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={wipe}
      className="relative flex flex-col items-center overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950/90 px-6 py-8 text-center backdrop-blur-xl"
    >
      <Corners />
      {/* circular avatar with rotating status ring */}
      <div className="relative h-36 w-36 sm:h-40 sm:w-40">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(from 0deg, ${STATUS_RING[p.status]}, transparent 40%, ${STATUS_RING[p.status]} 80%, transparent)` }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-1.5 rounded-full bg-zinc-950" />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.3 }}
          className="absolute inset-3 overflow-hidden rounded-full bg-zinc-900"
        >
          {p.loading ? <div className="h-full w-full animate-pulse bg-zinc-800" /> : <img src={p.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />}
        </motion.div>
        <span className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-zinc-950 ${STATUS_DOT[p.status]}`} />
      </div>

      <div className="mt-5 overflow-hidden">
        <motion.h3 variants={rise} className="text-2xl font-black tracking-tight text-white">
          {p.user.global_name || p.user.username}
        </motion.h3>
      </div>
      <p className="text-sm font-semibold text-indigo-300">@{p.user.username}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.activity ? p.activity.name + p.activity.details : "idle"}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="mt-5 flex w-full items-center gap-3 border border-zinc-800 bg-zinc-900/70 p-3 text-left"
        >
          {p.activity ? (
            <>
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                {(p.smallImg || p.largeImg) ? (
                  <img src={(p.smallImg || p.largeImg)!} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-xl">{p.activity.type === 2 ? "🎧" : "🎮"}</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-indigo-300">{activityLabel(p.activity)}</p>
                <p className="truncate text-sm font-bold text-white">{p.activity.name}</p>
                {p.activity.details && <p className="truncate text-xs text-zinc-400">{p.activity.details}</p>}
              </div>
            </>
          ) : (
            <p className="w-full text-center text-xs italic text-zinc-500">😴 ไม่พบกิจกรรมในขณะนี้</p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const DiscordWide = (p: DiscordViewProps) => (
  <motion.div
    variants={wipe}
    className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-2xl sm:aspect-video"
  >
    <Corners />
    {/* banner with slow ken-burns */}
    <motion.div
      key={p.banner}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url('${p.banner}')` }}
      initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10" />
    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent" />

    <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
      {/* top row: status */}
      <motion.div variants={fadeSlide} className="flex items-center gap-2 self-start border border-white/20 bg-zinc-950/70 px-2.5 py-1 text-xs font-bold text-zinc-200 backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${STATUS_DOT[p.status]}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${STATUS_DOT[p.status]}`} />
        </span>
        {p.status}
      </motion.div>

      {/* bottom row: identity + activity */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            variants={{ hidden: { scale: 0.5, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 160, damping: 14 } } }}
            className="h-20 w-20 shrink-0 overflow-hidden border-2 border-white/80 bg-zinc-900 sm:h-24 sm:w-24"
          >
            {p.loading ? <div className="h-full w-full animate-pulse bg-zinc-800" /> : <img src={p.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />}
          </motion.div>
          <div className="min-w-0 overflow-hidden">
            <div className="overflow-hidden">
              <motion.h3 variants={rise} className="truncate text-2xl font-black tracking-tight text-white sm:text-4xl">
                {p.user.global_name || p.user.username}
              </motion.h3>
            </div>
            <motion.p variants={fadeSlide} className="text-sm font-semibold text-indigo-300">@{p.user.username}</motion.p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.activity ? p.activity.name + p.activity.details : "idle"}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex w-full items-center gap-3 border border-white/15 bg-zinc-950/75 p-3 backdrop-blur-md sm:w-80"
          >
            {p.activity ? (
              <>
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-zinc-800">
                  {(p.smallImg || p.largeImg) ? (
                    <img src={(p.smallImg || p.largeImg)!} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-2xl">{p.activity.type === 2 ? "🎧" : "🎮"}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-indigo-300">{activityLabel(p.activity)}</p>
                  <p className="truncate font-bold text-white">{p.activity.name}</p>
                  {p.activity.details && <p className="truncate text-xs text-zinc-300">{p.activity.details}</p>}
                  {p.activity.state && <p className="truncate text-xs text-zinc-500">{p.activity.state}</p>}
                </div>
              </>
            ) : (
              <p className="w-full py-2 text-center text-xs italic text-zinc-400">😴 ไม่พบกิจกรรมในขณะนี้</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

/* =========================================
   Main section
========================================= */
export default function WidgetsSection() {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"wide" | "compact">("wide");

  useEffect(() => {
    let socket: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let closed = false;

    const connect = () => {
      socket = new WebSocket("wss://api.lanyard.rest/socket");
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.op === 1) {
          heartbeat = setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 }));
          }, data.d.heartbeat_interval);
          socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
        } else if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
          setDiscordData(data.d);
          setLoading(false);
        }
      };
      socket.onclose = () => {
        if (heartbeat) clearInterval(heartbeat);
        if (!closed) retry = setTimeout(connect, 3000);
      };
    };
    connect();

    const loadWeather = () =>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`)
        .then((r) => r.json())
        .then((d) => setWeather(d.current_weather))
        .catch((err) => console.error("Weather API Error:", err));
    loadWeather();
    const wInt = setInterval(loadWeather, 10 * 60 * 1000); // refresh every 10 min

    return () => {
      closed = true;
      if (heartbeat) clearInterval(heartbeat);
      if (retry) clearTimeout(retry);
      clearInterval(wInt);
      socket?.close();
    };
  }, []);

  const safe: DiscordData = discordData || {
    discord_user: { username: "developer", global_name: "Web Developer", avatar: "", id: "0" },
    discord_status: "offline",
    activities: [],
  };

  const avatarUrl = safe.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${safe.discord_user.id}/${safe.discord_user.avatar}.png?size=256`
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  const activity = safe.activities?.find((a) => a.type !== 4) || safe.activities?.[0];
  const largeImg = parseDiscordAsset(activity?.application_id, activity?.assets?.large_image);
  const smallImg = parseDiscordAsset(activity?.application_id, activity?.assets?.small_image);
  const banner = largeImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

  const viewProps: DiscordViewProps = {
    user: safe.discord_user, status: safe.discord_status, activity,
    avatarUrl, largeImg, smallImg, banner, loading,
  };

  return (
    <section className="relative isolate z-0 w-full overflow-hidden bg-transparent px-4 py-20 sm:px-6 md:py-32" id="widgets">
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <CloudShader />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 flex flex-col items-center text-center md:mb-16"
        >
          <motion.div
            variants={wipe}
            className="mb-5 inline-block border border-white/40 bg-white/70 px-5 py-3 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-8"
          >
            <h2 className="flex items-center justify-center gap-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
              <span>Live</span>
              <FlipWords words={["Dashboard", "Activity", "Status", "Workspace"]} />
            </h2>
          </motion.div>
          <div className="overflow-hidden">
            <motion.p variants={rise} className="mx-auto max-w-2xl text-base font-medium text-zinc-600 dark:text-zinc-400 md:text-lg">
              อัปเดตสถานะการทำงาน กิจกรรม และสภาพอากาศแบบ Real-time
            </motion.p>
          </div>
        </motion.div>

        {/* View toggle */}
        <div className="mb-4 flex justify-end">
          <div className="relative flex border border-zinc-300 bg-white/70 text-xs font-bold backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/70">
            {(["wide", "compact"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative z-10 px-4 py-2 transition-colors ${view === v ? "text-white" : "text-zinc-500"}`}
              >
                {view === v && (
                  <motion.span layoutId="toggle-pill" className="absolute inset-0 -z-10 bg-indigo-600" transition={{ type: "spring", stiffness: 300, damping: 28 }} />
                )}
                {v === "wide" ? "16:9" : "วงกลม"}
              </button>
            ))}
          </div>
        </div>

        {/* Widgets grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 grid grid-cols-1 gap-4 sm:gap-6 lg:mb-20 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <motion.div variants={stagger} initial="hidden" animate="visible">
                  {view === "wide" ? <DiscordWide {...viewProps} /> : <DiscordCompact {...viewProps} />}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <WeatherCard weather={weather} loading={!weather} />
            <CalendarCard />
          </div>
        </motion.div>

        {/* Macbook scroll */}
        <div className="w-full overflow-hidden bg-transparent pt-6 md:pt-10">
          <MacbookScroll
            title={
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                Experience the interactive{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Workspace.</span>
              </span>
            }
            badge={
              <span className="rounded-sm border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-indigo-400">
                Live Preview
              </span>
            }
            src="https://media1.tenor.com/m/d8DEfCq8vJkAAAAd/bocchi-the-rock-bocchi.gif"
          />
        </div>
      </div>
    </section>
  );
}
