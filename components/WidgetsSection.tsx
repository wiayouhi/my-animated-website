"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CloudShader } from "@/components/ui/cloud-shader";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

// =========================================
// 1. Aceternity-style Text Flip Component
// =========================================
const FlipWords = ({ words }: { words: string[] }) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [words]);

  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <span className="relative inline-block text-left">
      <span className="invisible">{longestWord}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 12 }}
          className="absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transform-gpu origin-center"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// =========================================
// Types & Helper Functions
// =========================================
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

interface DiscordData {
  discord_user: {
    username: string;
    avatar: string;
    id: string;
    global_name: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: DiscordActivity[];
}

const parseDiscordAsset = (appId?: string, assetKey?: string) => {
  if (!assetKey) return null;
  if (assetKey.startsWith("mp:external/")) {
    const httpsMatch = assetKey.split("/https/");
    if (httpsMatch.length > 1) return `https://${httpsMatch[1]}`;
    const httpMatch = assetKey.split("/http/");
    if (httpMatch.length > 1) return `http://${httpMatch[1]}`;
  }
  if (assetKey.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${assetKey.replace("spotify:", "")}`;
  }
  if (appId) {
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetKey}.png`;
  }
  return null;
};

const getWeatherDetail = (code: number) => {
  if (code === 0) return { icon: "☀️", text: "แจ่มใส" };
  if (code >= 1 && code <= 3) return { icon: "⛅", text: "มีเมฆบางส่วน" };
  if (code >= 45 && code <= 48) return { icon: "🌫️", text: "มีหมอก" };
  if (code >= 51 && code <= 67) return { icon: "🌧️", text: "ฝนตก" };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "หิมะตก" };
  if (code >= 95 && code <= 99) return { icon: "⛈️", text: "พายุฝนฟ้าคะนอง" };
  return { icon: "🌡️", text: "ปกติ" };
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
};

export default function WidgetsSection() {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const DISCORD_USER_ID = "902739412172046427"; 

  useEffect(() => {
    let socket: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://api.lanyard.rest/socket");

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.op === 1) { 
          heartbeatInterval = setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, data.d.heartbeat_interval);

          socket?.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: DISCORD_USER_ID },
            })
          );
        } else if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
          setDiscordData(data.d);
          setLoading(false);
        }
      };

      socket.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connectWebSocket, 3000); 
      };
    };

    connectWebSocket();

    // ดึงสภาพอากาศจริงจาก Open-Meteo API
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5167&current_weather=true`)
      .then((res) => res.json())
      .then((data) => setWeather(data.current_weather))
      .catch((err) => console.error("Weather API Error:", err));

    return () => {
      clearInterval(heartbeatInterval);
      if (socket) socket.close();
    };
  }, [DISCORD_USER_ID]);

  const today = new Date();
  const currentMonth = today.toLocaleString("th-TH", { month: "long" });
  const currentYear = today.getFullYear() + 543;
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const safeDiscord = discordData || {
    discord_user: { username: "developer", global_name: "Web Developer", avatar: "", id: "0" },
    discord_status: "offline",
    activities: [],
  };

  const avatarUrl = safeDiscord.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${safeDiscord.discord_user.id}/${safeDiscord.discord_user.avatar}.png?size=256`
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  const statusColors = {
    online: "bg-emerald-500 shadow-emerald-500/50",
    idle: "bg-amber-500 shadow-amber-500/50",
    dnd: "bg-rose-500 shadow-rose-500/50",
    offline: "bg-slate-500 shadow-slate-500/50",
  };

  const activeActivity = safeDiscord.activities?.find((a) => a.type !== 4) || safeDiscord.activities?.[0];
  
  const largeImgUrl = parseDiscordAsset(activeActivity?.application_id, activeActivity?.assets?.large_image);
  const smallImgUrl = parseDiscordAsset(activeActivity?.application_id, activeActivity?.assets?.small_image);
  const bannerImgUrl = largeImgUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="relative w-full py-32 px-6 overflow-hidden bg-transparent z-0 isolate" id="widgets">
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <CloudShader />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* หัวข้อพร้อมแอนิเมชัน Text Flip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="inline-block px-8 py-3 rounded-[2rem] bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border border-white/40 dark:border-zinc-800 shadow-xl mb-5">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
              <span>Live</span>
              <FlipWords words={["Dashboard", "Activity", "Status", "Workspace"]} />
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg max-w-2xl mx-auto">
            อัปเดตสถานะการทำงาน กิจกรรม และสภาพอากาศแบบ Real-time
          </p>
        </motion.div>

        {/* Grid Widgets หลัก */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20"
        >
          {/* Widget Discord Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/80 shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none transition-colors duration-1000" />

            <div>
              <div 
                className="h-44 md:h-56 w-full bg-cover bg-center relative transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url('${bannerImgUrl}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
              </div>

              <div className="relative px-6 md:px-8 -mt-20 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex items-end gap-5">
                    <div className="relative group">
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
                        {loading ? (
                          <div className="w-full h-full bg-zinc-800 animate-pulse" />
                        ) : (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-zinc-950 shadow-lg ${statusColors[safeDiscord.discord_status]}`} />
                    </div>

                    <div className="pb-2">
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
                        {safeDiscord.discord_user.global_name || safeDiscord.discord_user.username}
                      </h3>
                      <p className="text-indigo-300 font-semibold text-sm drop-shadow-sm">
                        @{safeDiscord.discord_user.username}
                      </p>
                    </div>
                  </div>

                  <div className="self-start md:self-end mb-2">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs font-bold text-zinc-300 uppercase tracking-wider shadow-xl">
                      <span className={`w-2 h-2 rounded-full animate-ping ${statusColors[safeDiscord.discord_status]}`} />
                      {safeDiscord.discord_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 pt-2 relative z-10">
              <AnimatePresence mode="wait">
                {activeActivity ? (
                  <motion.div
                    key={activeActivity.name + activeActivity.details}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md flex flex-col md:flex-row items-center gap-5 relative overflow-hidden shadow-inner"
                  >
                    <div className="relative shrink-0">
                      {smallImgUrl ? (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] overflow-hidden border-2 border-zinc-700/60 shadow-xl bg-zinc-800">
                          <img
                            src={smallImgUrl}
                            alt={activeActivity.assets?.small_text || "Activity Asset"}
                            className="w-full h-full object-cover"
                            title={activeActivity.assets?.small_text}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] bg-gradient-to-br from-indigo-500/80 to-purple-600/80 flex items-center justify-center text-3xl shadow-lg border border-indigo-400/30">
                          {activeActivity.type === 2 ? "🎧" : "🎮"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left min-w-0">
                      <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
                        {activeActivity.type === 2 ? "Listening to" : "Playing Now"}
                      </div>
                      <h4 className="text-xl font-extrabold text-white truncate leading-snug">
                        {activeActivity.name}
                      </h4>
                      {activeActivity.details && (
                        <p className="text-zinc-300 text-sm font-medium truncate mt-1" title={activeActivity.details}>
                          {activeActivity.details}
                        </p>
                      )}
                      {activeActivity.state && (
                        <p className="text-zinc-400 text-xs font-normal truncate mt-0.5" title={activeActivity.state}>
                          {activeActivity.state}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 text-center">
                    <p className="text-zinc-500 text-sm font-medium italic">
                      😴 สภาพแวดล้อมเงียบสงบ - ไม่พบกิจกรรมในขณะนี้
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Side Column: Weather & Calendar */}
          <div className="flex flex-col gap-6">
            {/* Weather Widget */}
            <motion.div
              variants={itemVariants}
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-700/90 backdrop-blur-xl text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">กรุงเทพมหานคร</h3>
                    <p className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Current Weather</p>
                  </div>
                  <div className="text-5xl drop-shadow-md">
                    {weather ? getWeatherDetail(weather.weathercode).icon : "⛅"}
                  </div>
                </div>

                {loading ? (
                  <div className="h-16 w-32 bg-white/20 animate-pulse rounded-2xl" />
                ) : weather ? (
                  <div>
                    <div className="flex items-start gap-1">
                      <span className="text-6xl font-black tracking-tighter leading-none">{Math.round(weather.temperature)}</span>
                      <span className="text-2xl font-bold text-blue-200">°C</span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-white/90">
                      {getWeatherDetail(weather.weathercode).text}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">ไม่สามารถโหลดข้อมูลได้</p>
                )}
              </div>
            </motion.div>

            {/* Calendar Widget */}
            <motion.div
              variants={itemVariants}
              className="flex-1 p-8 rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-zinc-800 shadow-xl flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {currentMonth} {currentYear}
                </h3>
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-400 mb-2">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {blanks.map((b) => (
                  <div key={`blank-${b}`} className="p-1.5" />
                ))}
                {days.map((d) => {
                  const isToday = d === today.getDate();
                  return (
                    <div
                      key={d}
                      className={`p-1.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full transition-all ${
                        isToday
                          ? "bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/40 scale-110"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* Macbook Scroll Effect (อนิเมชั่นกางจอแมคบุ๊กพรีเมียม) */}
        {/* ========================================= */}
        <div className="w-full overflow-hidden bg-transparent pt-10">
          <MacbookScroll
            title={
              <span className="text-xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Experience the interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Workspace.</span>
              </span>
            }
            badge={
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 font-mono text-xs uppercase tracking-widest">
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