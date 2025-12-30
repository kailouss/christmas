"use client";

import { useEffect, useState, useRef } from "react";
import { SLIDES, TARGET_DATE } from "./_components/Contents";
import { useCountdown } from "./_hooks/useCountdown";
import { useFlash } from "./_hooks/useFlash";
import { MonthPage } from "./_components/MonthPage";
import { GlobalPhotoShowcase } from "./_components/GlobalPhotoShowcase";
import { LastPage } from "./_components/LastPage";
import { ProgressBar } from "./_components/ProgressBar";
import { Controls } from "./_components/Controls";
import { NavigationButton } from "./_components/NavigationButton";
import { Raleway } from "next/font/google";

const ralewayThin = Raleway({
  weight: "100",
  subsets: ["latin"],
  display: "swap",
});

const ralewayBold = Raleway({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
});

declare global {
  interface Window {
    __wrappedAudio?: HTMLAudioElement;
    __audioStartTime?: number; // Track when audio actually started playing
  }
}

const FIRST_SLIDE = 21; // seconds
const DEFAULT_SLIDE_DURATION = 4.1; // seconds

export default function WrappedGate() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isUnlocked } = useCountdown(TARGET_DATE);
  const slideContainerRef = useRef<HTMLDivElement>(null!);
  // Intro timed text states
  const [showIntroTitle, setShowIntroTitle] = useState(false);
  const [showIntroSubtitle, setShowIntroSubtitle] = useState(false);
  const [showIntroContent, setShowIntroContent] = useState(false);
  const [introReplacementTitle, setIntroReplacementTitle] = useState<
    string | null
  >(null);
  const [introReplacementBold, setIntroReplacementBold] = useState(false);
  // Countdown stages: 'year' | 'months' | 'days' | 'memories' | 'fade'
  const [countdownStage, setCountdownStage] = useState<string | null>(null);
  const [monthsZoomed, setMonthsZoomed] = useState(false);

  // Flash sequence: BigFlash -> SmallFlash (4x) -> BigFlash -> SmallFlash (4x)
  // Adjust timing based on music start time to account for page load delays

  // Calculate delay offset from music start time
  const getFlashDelay = (baseDelay: number) => {
    const audioStartTime =
      typeof window !== "undefined" ? window.__audioStartTime : 0;
    const currentTime = Date.now();
    const timeSinceAudioStart = audioStartTime
      ? currentTime - audioStartTime
      : 0;
    return Math.max(0, baseDelay - timeSinceAudioStart);
  };

  // 1st: BigFlash at 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: getFlashDelay(2000),
    duration: 150,
    intensity: 0.5,
  });

  // 2nd: SmallFlash (4 times) starting at 2.5sec, repeating every 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: getFlashDelay(2500),
    interval: 2000,
    count: 4,
    duration: 200,
    intensity: 1,
  });

  // 3rd: BigFlash at 10.5sec (2.5sec + 4*2sec for small flashes)
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: getFlashDelay(10400),
    duration: 150,
    intensity: 0.5,
  });

  // 4th: SmallFlash (4 times) starting at 11sec, repeating every 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: getFlashDelay(11000),
    interval: 2000,
    count: 4,
    duration: 200,
    intensity: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingAudio = window.__wrappedAudio;
    const audio = existingAudio ?? new Audio("/wrappedmusic.mp3");
    audio.preload = "auto";
    window.__wrappedAudio = audio;

    if (audio.paused) {
      // Record the exact time when audio starts playing
      window.__audioStartTime = Date.now();
      audio.play().catch(() => {
        /* If play is blocked, user can tap any control to resume. */
      });
    }
  }, []);

  useEffect(() => {
    const slideDuration =
      currentSlide === 0 ? FIRST_SLIDE * 1000 : DEFAULT_SLIDE_DURATION * 1000;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Schedule intro text sequence
  useEffect(() => {
    // Reset states on slide change
    setShowIntroTitle(false);
    setShowIntroSubtitle(false);
    setShowIntroContent(false);
    setIntroReplacementTitle(null);
    setIntroReplacementBold(false);
    setCountdownStage(null);
    setMonthsZoomed(false);

    if (currentSlide !== 0) return;

    const timers: number[] = [];

    // Title at 2000ms
    timers.push(window.setTimeout(() => setShowIntroTitle(true), 2000));
    // Subtitle at 2500ms
    timers.push(window.setTimeout(() => setShowIntroSubtitle(true), 2500));
    // Content at 4500ms
    timers.push(window.setTimeout(() => setShowIntroContent(true), 4500));
    // Replace all with "2025" (thin) at 6500ms
    timers.push(
      window.setTimeout(() => {
        setShowIntroTitle(false);
        setShowIntroSubtitle(false);
        setShowIntroContent(false);
        setIntroReplacementTitle("2025");
        setIntroReplacementBold(false);
        setCountdownStage("year");
      }, 6500)
    );
    // Make replacement title bigger and bold at 8500ms
    timers.push(
      window.setTimeout(() => {
        setIntroReplacementBold(true);
      }, 8500)
    );
    // Replace with "12 | Months" at 10400ms
    timers.push(window.setTimeout(() => setCountdownStage("months"), 10400));
    // Zoom in "12 | Months" at 11000ms
    timers.push(window.setTimeout(() => setMonthsZoomed(true), 11000));
    // Replace with "365\nDays" at 13000ms
    timers.push(window.setTimeout(() => setCountdownStage("days"), 13000));
    // Replace with "Infinite\nMemories" at 15000ms
    timers.push(window.setTimeout(() => setCountdownStage("memories"), 15000));
    // Fade all at 17000ms
    timers.push(window.setTimeout(() => setCountdownStage("fade"), 17000));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [currentSlide]);

  const slide = SLIDES[currentSlide];
  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0a0e27] relative">
      {/* Carousel Container */}
      <div ref={slideContainerRef} className="relative h-full w-full">
        {/* Global photo showcase overlay; enabled only on month slides */}
        <GlobalPhotoShowcase
          enabled={"month" in SLIDES[currentSlide]}
          month={
            "month" in SLIDES[currentSlide]
              ? SLIDES[currentSlide].month
              : undefined
          }
        />
        {/* Slides */}
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`flex h-full flex-col items-center justify-center gap-8 bg-[#0a0e27] px-6 py-12 text-white`}
            >
              {"month" in s && (
                <MonthPage slide={s} active={idx === currentSlide} />
              )}
              {"isFinal" in s && <LastPage slide={s} isUnlocked={isUnlocked} />}
              {"isIntro" in s && (
                <div className="flex flex-col items-center gap-4 text-center">
                  {introReplacementTitle ? (
                    <div
                      className={`flex flex-col items-center gap-6 transition-opacity duration-1000 ${
                        countdownStage === "fade" ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {countdownStage === "year" && (
                        <h1
                          className={`${
                            introReplacementBold
                              ? ralewayBold.className
                              : ralewayThin.className
                          } ${
                            introReplacementBold
                              ? "text-8xl sm:text-9xl"
                              : "text-6xl sm:text-7xl"
                          }`}
                        >
                          {introReplacementTitle}
                        </h1>
                      )}
                      {countdownStage === "months" && (
                        <div
                          className={`${
                            ralewayThin.className
                          } flex items-center gap-4 ${
                            monthsZoomed
                              ? "text-6xl sm:text-7xl md:text-8xl"
                              : "text-4xl sm:text-5xl md:text-6xl"
                          }`}
                        >
                          <span className={ralewayBold.className}>12</span>
                          <span className="text-gray-300">|</span>
                          <span>Months</span>
                        </div>
                      )}
                      {countdownStage === "days" && (
                        <div
                          className={`${ralewayThin.className} flex flex-col items-center animate-pulse`}
                        >
                          <span
                            className={`${ralewayBold.className} text-6xl sm:text-7xl md:text-8xl`}
                            style={{
                              textShadow: "0 0 20px rgba(255,255,255,0.5)",
                            }}
                          >
                            365
                          </span>
                          <span className="text-3xl sm:text-4xl md:text-5xl text-gray-300">
                            Days
                          </span>
                        </div>
                      )}
                      {countdownStage === "memories" && (
                        <div
                          className={`${ralewayThin.className} flex flex-col items-center text-5xl sm:text-6xl md:text-7xl`}
                        >
                          <span>Infinite</span>
                          <span className="text-gray-300">Memories</span>
                        </div>
                      )}
                      {countdownStage === "fade" && (
                        <div
                          className={`${ralewayThin.className} flex flex-col items-center text-5xl sm:text-6xl md:text-7xl`}
                        >
                          <span>Infinite</span>
                          <span className="text-gray-300">Memories</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {showIntroContent && (
                        <div
                          className={`${ralewayThin.className} text-5xl sm:text-6xl md:text-7xl`}
                        >
                          {s.content}
                        </div>
                      )}
                      {showIntroTitle && (
                        <h1
                          className={`${ralewayBold.className} text-6xl font-bold sm:text-7xl md:text-8xl`}
                        >
                          {s.title}
                        </h1>
                      )}
                      {showIntroSubtitle && (
                        <p className="text-gray-400 font-thin text-lg sm:text-xl md:text-2xl opacity-90">
                          {s.subtitle}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Top Controls */}
        <Controls currentSlide={currentSlide} totalSlides={SLIDES.length} />

        {/* Navigation Buttons (Desktop only) */}
        <NavigationButton
          direction="prev"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        />
        <NavigationButton
          direction="next"
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
        />

        {/* Tap Areas - Invisible hit zones for mobile navigation */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="absolute inset-y-0 left-0 z-5 w-1/3 cursor-pointer disabled:cursor-not-allowed sm:hidden"
          aria-label="Previous slide"
        />
        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="absolute inset-y-0 right-0 z-5 w-1/3 cursor-pointer disabled:cursor-not-allowed sm:hidden"
          aria-label="Next slide"
        />
      </div>
    </main>
  );
}
