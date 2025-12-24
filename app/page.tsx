"use client";

import Snowfall from "react-snowfall";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const OFFSETS = {
    neighborhoodBottom: "clamp(14rem, 12vw, 16rem)", // responsive height
    neighborhoodParallax: 30, // bigger = moves more on scroll
    dimSnowParallax: 50, // parallax for dim snow layer
    dimSnowTranslateY: -1, // less negative = lower; more negative = higher
    mainSnowTranslateY: -40, // less negative = lower main snow land
    treePaddingBottom: "clamp(4rem, 6vw, 10rem)", // responsive padding
  };

  const neighborhoodY = useTransform(
    scrollY,
    [0, 600],
    [0, OFFSETS.neighborhoodParallax]
  );
  const dimSnowY = useTransform(
    scrollY,
    [0, 600],
    [0, OFFSETS.dimSnowParallax]
  );
  const starsY = useTransform(scrollY, [0, 600], [0, -20]);
  const moonY = useTransform(scrollY, [0, 600], [0, -10]);

  // Smooth the parallax values for a gliding scroll feel
  const starsYSmooth = useSpring(starsY, {
    stiffness: 80,
    damping: 18,
    mass: 0.8,
  });
  const moonYSmooth = useSpring(moonY, {
    stiffness: 90,
    damping: 18,
    mass: 0.8,
  });
  const neighborhoodYSmooth = useSpring(neighborhoodY, {
    stiffness: 90,
    damping: 18,
    mass: 0.9,
  });
  const dimSnowYSmooth = useSpring(dimSnowY, {
    stiffness: 90,
    damping: 18,
    mass: 0.9,
  });

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio playback error", err);
      setIsPlaying(false);
    }
  };

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target: January 1, 2026, 12:00 AM UTC+8
      const targetDate = new Date("2026-01-01T00:00:00+08:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-blue-950 text-white">
      <section className="relative h-screen md:min-h-[130vh] overflow-hidden bg-linear-to-b from-blue-950 via-blue-900 to-blue-800">
        {/* Audio element */}
        <audio ref={audioRef} src="/WinterWonderland.mp3" preload="auto" />

        {/* Music player button - fixed top left */}
        <button
          onClick={toggleAudio}
          className="fixed top-6 left-6 z-100 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-colors flex items-center justify-center"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Stars layer - far background with parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ y: starsYSmooth }}
        >
          <Image
            src="/stars.svg"
            alt="Stars"
            fill
            className="object-cover opacity-80"
          />
        </motion.div>

        {/* Moon - background layer with parallax */}
        <motion.div
          className="absolute top-4 right-3 z-5 sm:top-8 sm:right-8 md:top-10 md:right-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ y: moonYSmooth }}
        >
          <Image
            src="/moon.svg"
            alt="Moon"
            width={150}
            height={150}
            className="w-24 h-24 sm:w-30 sm:h-30 md:w-37.5 md:h-37.5"
          />
        </motion.div>

        {/* Neighborhood skyline - foreground before snow layers */}
        <motion.div
          className="absolute left-1/2 z-10 -translate-x-1/2 pointer-events-none"
          style={{ y: neighborhoodYSmooth, bottom: OFFSETS.neighborhoodBottom }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1.08 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <Image
            src="/neighborhood.svg"
            alt="Neighborhood"
            width={1600}
            height={400}
            className="max-w-none w-[180vw] md:w-[110vw] h-auto"
            priority
          />
        </motion.div>

        {/* Dim back snow layer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 h-64 sm:h-72 md:h-80"
          style={{ y: dimSnowYSmooth }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `translateY(${OFFSETS.dimSnowTranslateY}%)` }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 Q100,20 600,15 T1200,0 L1200,120 L0,120 Z"
              fill="#e5e7eb"
            />
          </svg>
        </motion.div>

        {/* Main snow layer */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-40 sm:h-48 md:h-56 bg-white">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `translateY(${OFFSETS.mainSnowTranslateY}%)` }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 Q300,60 600,40 T1200,0 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Main Christmas tree */}
        <div
          className="absolute left-1/2 z-40 flex -translate-x-1/2 px-4"
          style={{ bottom: OFFSETS.treePaddingBottom }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Image
              src="/xmastree.svg"
              alt="Christmas"
              width={600}
              height={600}
              priority
              className="max-w-none h-auto w-80 md:w-120"
            />
          </motion.div>
        </div>

        {/* Snowfall overlay */}
        <Snowfall
          color="white"
          snowflakeCount={200}
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 50,
          }}
        />
      </section>

      <section className="relative z-50 bg-white text-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20">
          {/* Merry Christmas Section */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h1 className="py-2 font-dancing font-bold text-5xl md:text-6xl text-slate-900 flex items-center line-clamp-2 text-center">
              Merry Christmas!!!
            </h1>
            <p className="font-dancing text-2xl text-slate-600 text-center">
              Wishing you joy and warmth this holiday season.
            </p>
            <p className="font-dancing text-4xl text-red-600 text-center">
              I love youuu!! mwamwah!!!
            </p>
          </motion.div>

          {/* Countdown Section */}
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-linear-to-b from-blue-50 to-slate-50 p-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
              2025 Wrapped
            </h2>
            <p className="text-slate-700 text-center">Coming soon...</p>
            <div className="grid grid-cols-4 gap-4 md:gap-6 w-full max-w-md">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-md"
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-slate-600">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
