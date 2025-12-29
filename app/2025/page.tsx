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
import { Poppins } from "next/font/google";

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
  }
}

const FIRST_SLIDE = 21; // seconds
const DEFAULT_SLIDE_DURATION = 4.1; // seconds

export default function WrappedGate() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isUnlocked } = useCountdown(TARGET_DATE);
  const slideContainerRef = useRef<HTMLDivElement>(null!);

  // Flash sequence: BigFlash -> SmallFlash (4x) -> BigFlash -> SmallFlash (4x)
  // 1st: BigFlash at 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: 2000,
    duration: 150,
    intensity: 0.5,
  });

  // 2nd: SmallFlash (4 times) starting at 2.5sec, repeating every 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: 2500,
    interval: 2000,
    count: 4,
    duration: 200,
    intensity: 1,
  });

  // 3rd: BigFlash at 10.5sec (2.5sec + 4*2sec for small flashes)
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: 10400,
    duration: 150,
    intensity: 0.5,
  });

  // 4th: SmallFlash (4 times) starting at 11sec, repeating every 2sec
  useFlash(slideContainerRef, {
    enabled: true,
    startDelay: 11000,
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
        <GlobalPhotoShowcase enabled={"month" in SLIDES[currentSlide]} />
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
                <div className="flex flex-col items-center gap-6 text-center">
                  <div
                    className={`${ralewayBold.className} text-5xl sm:text-6xl md:text-7xl`}
                  >
                    {s.content}
                  </div>
                  <h1
                    className={`${ralewayThin.className} text-6xl font-bold sm:text-7xl md:text-8xl`}
                  >
                    {s.title}
                  </h1>
                  <p className="text-gray-400 font-thin text-lg sm:text-xl md:text-2xl opacity-90">
                    {s.subtitle}
                  </p>
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
