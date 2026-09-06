"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";

// กำหนด Interface สำหรับข้อมูล GitHub
interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  homepage: string;
}

// สีของแต่ละภาษาโปรแกรม
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
};

// รูปภาพตัวอย่างสำหรับ 3D Marquee
const marqueeImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534972195531-d756b9cfa9f2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
];

// =========================================
// Animation Variants
// =========================================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export default function GithubProjectsSection() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔴 เปลี่ยน username ตรงนี้เป็น GitHub ของคุณ 🔴
  const GITHUB_USERNAME = "wiayouhi";

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );
        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลจาก GitHub ได้");
        const data = await response.json();
        const filteredData = data.filter((repo: any) => !repo.fork).slice(0, 6);
        setRepos(filteredData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  return (
    <section className="w-full py-32 bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center text-zinc-100" id="projects">
      
      {/* Background Video + Gradient */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[2px]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31910-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-full mb-4 shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider uppercase text-emerald-400">Live GitHub Data</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Projects</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto font-light">
            โปรเจกต์โอเพนซอร์สที่ดึงข้อมูลแบบ Real-time ตรงจาก GitHub Repository ของผม
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-zinc-900/40 border border-zinc-800/60 animate-pulse rounded-3xl backdrop-blur-sm"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-zinc-900/80 border border-red-500/30 text-red-400 rounded-3xl shadow-xl backdrop-blur-md max-w-md mx-auto mb-20">
            <p className="font-medium">เกิดข้อผิดพลาด: {error}</p>
          </div>
        )}

        {/* GitHub Repositories Bento Grid */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
          >
            {repos.map((repo) => (
              <motion.div key={repo.id} variants={cardVariants} className="h-full">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between p-7 h-full min-h-[250px] bg-zinc-900/60 hover:bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 hover:border-emerald-500/50 rounded-3xl shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="p-2.5 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors font-mono">
                        <span>View Repo</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight">
                      {repo.name}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed font-light">
                      {repo.description || "ไม่มีคำอธิบายสำหรับโปรเจกต์นี้"}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs font-medium text-zinc-400 pt-4 border-t border-zinc-800/80">
                    {repo.language ? (
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shadow-sm" 
                          style={{ backgroundColor: languageColors[repo.language] || "#ccc" }} 
                        />
                        <span className="font-mono text-zinc-300">{repo.language}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-zinc-500">Repository</span>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-zinc-800/50 px-2.5 py-1 rounded-xl border border-zinc-700/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="text-zinc-300 font-mono">{repo.stargazers_count}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-zinc-800/50 px-2.5 py-1 rounded-xl border border-zinc-700/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
                        <span className="text-zinc-300 font-mono">{repo.forks_count}</span>
                      </div>
                    </div>
                  </div>

                </a>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ========================================= */}
        {/* 3D Marquee Effect (ย้ายมาไว้ข้างล่างสุด ใหญ่ขึ้น ไม่มีกรอบ) */}
        {/* ========================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[500px] overflow-hidden flex items-center justify-center [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
        >
          {/* เอฟเฟกต์มุมมองเอียง 3D ขยายพื้นที่เต็มจอ */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden [perspective:1200px]">
            <div className="grid grid-cols-4 gap-6 w-[140%] h-[180%] transform rotate-[-10deg] skew-y-6 scale-110 opacity-80">
              
              {/* คอลัมน์ที่ 1 (วิ่งขึ้น) */}
              <div className="flex flex-col gap-6 animate-marquee-up">
                {[...marqueeImages, ...marqueeImages].map((img, idx) => (
                  <div key={`col1-${idx}`} className="h-64 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800/40">
                    <img src={img} alt="preview" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>

              {/* คอลัมน์ที่ 2 (วิ่งลง) */}
              <div className="flex flex-col gap-6 animate-marquee-down">
                {[...marqueeImages.reverse(), ...marqueeImages].map((img, idx) => (
                  <div key={`col2-${idx}`} className="h-64 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800/40">
                    <img src={img} alt="preview" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>

              {/* คอลัมน์ที่ 3 (วิ่งขึ้น) */}
              <div className="flex flex-col gap-6 animate-marquee-up">
                {[...marqueeImages, ...marqueeImages].map((img, idx) => (
                  <div key={`col3-${idx}`} className="h-64 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800/40">
                    <img src={img} alt="preview" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>

              {/* คอลัมน์ที่ 4 (วิ่งลง) */}
              <div className="flex flex-col gap-6 animate-marquee-down">
                {[...marqueeImages.reverse(), ...marqueeImages].map((img, idx) => (
                  <div key={`col4-${idx}`} className="h-64 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800/40">
                    <img src={img} alt="preview" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ป้ายข้อความตรงกลางสวยๆ แบบไม่มีกรอบกั้นแข็งทื่อ */}
          <div className="relative z-20 text-center px-6 pointer-events-none bg-zinc-950/70 backdrop-blur-xl py-5 px-10 rounded-3xl border border-zinc-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase block mb-1">Visual Experience</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Creative Code & Interfaces</h3>
          </div>
        </motion.div>

      </div>
    </section>
  );
}