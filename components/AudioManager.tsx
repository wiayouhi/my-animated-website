"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

type AudioContextValue = {
  isMuted: boolean;
  toggleMute: () => void;
  activeSound: string | null;
  changeSound: (key: string) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio ต้องถูกเรียกภายใน <AudioProvider>");
  return ctx;
}

const SOUND_MAP: Record<string, string> = {
  home: "/audio/home.mp3",
  explore: "/audio/explore.mp3",
  profile: "/audio/profile.mp3",
  about: "/audio/about.mp3",
  projects: "/audio/projects.mp3",
  activities: "/audio/activities.mp3",
  github: "/audio/github.mp3",
  widgets: "/audio/widgets.mp3",
};

const TARGET_VOLUME = 0.35;
const FADE_MS = 600;

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>("home");

  const audioA = useRef<HTMLAudioElement | null>(null);
  const audioB = useRef<HTMLAudioElement | null>(null);
  const activeIsA = useRef(true);
  const currentKey = useRef<string | null>(null);
  const isMutedRef = useRef(isMuted);

  const activeFades = useRef<Map<HTMLAudioElement, number>>(new Map());

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    audioA.current = new Audio();
    audioB.current = new Audio();
    [audioA.current, audioB.current].forEach((audio) => {
      audio.loop = true;
      audio.volume = 0;
      audio.preload = "auto";
    });

    crossfadeTo("home");

    const unlockAudio = () => {
      if (!isMutedRef.current) {
        const active = activeIsA.current ? audioA.current : audioB.current;
        if (active && active.paused) {
          active.play().catch(() => {});
        }
      }
      window.removeEventListener("pointerdown", unlockAudio);
    };
    window.addEventListener("pointerdown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      activeFades.current.forEach((rafId) => cancelAnimationFrame(rafId));
      activeFades.current.clear();
      audioA.current?.pause();
      audioB.current?.pause();
      audioA.current?.removeAttribute("src");
      audioB.current?.removeAttribute("src");
      audioA.current?.load();
      audioB.current?.load();
    };
  }, []);

  const fade = (
    el: HTMLAudioElement,
    targetVol: number,
    duration: number,
    onDone?: () => void
  ) => {
    const existingRaf = activeFades.current.get(el);
    if (existingRaf) cancelAnimationFrame(existingRaf);

    const start = performance.now();
    const startVol = el.volume;

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      
      el.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * ease));

      if (progress < 1) {
        const rafId = requestAnimationFrame(step);
        activeFades.current.set(el, rafId);
      } else {
        activeFades.current.delete(el);
        onDone?.();
      }
    };

    const rafId = requestAnimationFrame(step);
    activeFades.current.set(el, rafId);
  };

  const crossfadeTo = (key: string) => {
    const src = SOUND_MAP[key];
    if (!src || currentKey.current === key) return;
    currentKey.current = key;
    setActiveSound(key);

    const incoming = activeIsA.current ? audioB.current : audioA.current;
    const outgoing = activeIsA.current ? audioA.current : audioB.current;
    if (!incoming || !outgoing) return;

    if (incoming.getAttribute("data-src") !== src) {
      incoming.src = src;
      incoming.setAttribute("data-src", src);
    }

    if (!isMutedRef.current) {
      incoming.play().catch(() => {});
    }

    fade(incoming, isMutedRef.current ? 0 : TARGET_VOLUME, FADE_MS);
    fade(outgoing, 0, FADE_MS, () => outgoing.pause());

    activeIsA.current = !activeIsA.current;
  };

  // ดักจับการเปลี่ยนแปลงของ DOM และ data-sound
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-sound");
            if (key) crossfadeTo(key);
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    const observeElements = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-sound]");
      sections.forEach((el) => observer.observe(el));
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-sound"],
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      
      if (!currentKey.current) {
        currentKey.current = "home";
      }

      const active = activeIsA.current ? audioA.current : audioB.current;
      if (active) {
        if (!next) {
          active.play().catch(() => {});
        }
        fade(active, next ? 0 : TARGET_VOLUME, FADE_MS);
      }

      return next;
    });
  };

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, activeSound, changeSound: crossfadeTo }}>
      {children}
    </AudioCtx.Provider>
  );
}