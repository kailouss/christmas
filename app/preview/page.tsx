"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const MONTHS = [
  "December",
  "November",
  "October",
  "September",
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
];

const FLASH_DURATION_MS = 8000;

declare global {
  interface Window {
    __wrappedAudio?: HTMLAudioElement;
  }
}

export default function PreviewPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const keepPlayingRef = useRef(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingAudio = window.__wrappedAudio;
    const audio = existingAudio ?? new Audio("/wrappedmusic.mp3");
    audio.preload = "auto";

    window.__wrappedAudio = audio;
    audioRef.current = audio;

    return () => {
      audioRef.current = null;

      if (!keepPlayingRef.current) {
        window.__wrappedAudio?.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!isFlashing || !audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      /* Ignore autoplay rejection; user already clicked the trigger. */
    });

    return () => {
      audioRef.current?.pause();
    };
  }, [isFlashing]);

  const handleStartWrap = async () => {
    if (bottomRef.current) {
      // Use GSAP to smoothly scroll to bottom
      gsap.to(window, {
        scrollTo: bottomRef.current,
        duration: 3,
        ease: "power2.inOut",
        onComplete: () => {
          setIsFlashing(true);
          setTimeout(() => {
            keepPlayingRef.current = true;
            router.push("/2025");
          }, FLASH_DURATION_MS);
        },
      });
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-white">
      {/* Flash Animation Overlay */}
      {isFlashing && (
        <motion.div
          className="fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 1] }}
          transition={{
            duration: FLASH_DURATION_MS / 1000,
            times: [0, 0.15, 0.85, 1],
          }}
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Hero Section - Get Started */}
      <section
        id="get-started"
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 px-6"
      >
        <motion.div
          className="flex flex-col items-center gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-7xl sm:text-8xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
            2025 Wrapped
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-white/80">
            Happy New Year! Dive into our personalized 2025 Wrapped and relive
            our favorite moments from the past year.
          </p>
          <motion.button
            onClick={handleStartWrap}
            className="mt-8 rounded-full bg-white px-8 py-4 text-lg font-bold text-violet-600 shadow-xl transition hover:shadow-2xl"
          >
            Press start to unwrap
          </motion.button>
        </motion.div>
      </section>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-30 w-0.5 -translate-x-1/2 bg-slate-500" />

        {/* Month Sections */}
        {MONTHS.map((month, idx) => {
          const monthOnLeft = idx % 2 === 0;
          return (
            <section
              key={month}
              id={month.toLowerCase()}
              className="relative flex h-[50vh] w-full items-center justify-center bg-white px-6 py-12"
            >
              {/* Horizontal Branch Line */}
              <div
                className={`pointer-events-none absolute top-1/2 z-10 h-0.5 bg-slate-500 ${
                  monthOnLeft ? "right-1/2 mr-px" : "left-1/2 ml-px"
                }`}
                style={{ width: "calc(50% - 3rem)" }}
              />

              <div className="flex w-full max-w-6xl items-center justify-between gap-12">
                {monthOnLeft ? (
                  <>
                    {/* Month on left */}
                    <div className="flex-1">
                      <img
                        src="/test.webp"
                        alt={month}
                        className="w-full relative max-w-md rounded-lg shadow-xl z-20"
                      />
                    </div>
                    {/* Text on right */}
                    <div className="flex-1 text-center text-xl font-semibold text-slate-600">
                      {month}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text on left */}
                    <div className="flex-1 text-center text-xl font-semibold text-slate-600">
                      {month}
                    </div>
                    {/* Month on right */}
                    <div className="flex-1">
                      <img
                        src="/test.webp"
                        alt={month}
                        className="w-full relative max-w-md rounded-lg shadow-xl z-20"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom Marker for Scroll End */}
      <div ref={bottomRef} className="h-1 w-full bg-transparent" />
    </main>
  );
}
