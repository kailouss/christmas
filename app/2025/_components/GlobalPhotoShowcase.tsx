"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GlobalPhotoShowcaseProps {
  enabled: boolean; // generate new photos only when true; existing ones fade naturally
  month?: string; // month name to determine which folder to load images from
}

const GENERATE_INTERVAL_MS = 250; // 16 photos in ~4s
const EXPOSURE_SECONDS = 1; // life of each photo

// Preload images for given month to prevent lag
function preloadMonthImages(month: string) {
  if (typeof window === "undefined" || !month) return;

  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/MonthPhotos/${month}/${i}.jpg`;
  }
}

function getImageSource(month?: string, index?: number): string {
  if (!month || index === undefined) return "/test.webp";

  // Cycle through photos 1-8 twice (16 total photos per month slide)
  const photoNumber = (index % 8) + 1;
  return `/MonthPhotos/${month}/${photoNumber}.jpg`;
}

function randomPosition() {
  const top = 5 + Math.random() * 70; // 5% - 75%
  const left = 5 + Math.random() * 70; // 5% - 75%
  const initialScale = 0.3 + Math.random() * 0.4; // start small
  const targetScale = initialScale + (0.5 + Math.random() * 0.5); // zoom in
  const rotation = -12 + Math.random() * 24; // random tilt
  const moveX = -30 + Math.random() * 60; // slight drift x
  const moveY = -30 + Math.random() * 60; // slight drift y
  return { top, left, initialScale, targetScale, rotation, moveX, moveY };
}

export function GlobalPhotoShowcase({
  enabled,
  month,
}: GlobalPhotoShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const photoCountRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset photo counter and preload when month changes
    photoCountRef.current = 0;
    if (month) {
      preloadMonthImages(month);
    }

    const createAndAnimate = () => {
      const { top, left, initialScale, targetScale, rotation, moveX, moveY } =
        randomPosition();
      const img = document.createElement("img");
      img.src = getImageSource(month, photoCountRef.current);
      photoCountRef.current += 1;
      img.alt = "Wrapped memory";
      img.style.position = "absolute";
      img.style.top = `${top}%`;
      img.style.left = `${left}%`;
      img.style.transform = `translate(-50%, -50%) scale(${initialScale}) rotate(${rotation}deg)`;
      img.style.opacity = "0";
      img.style.pointerEvents = "none";
      img.style.zIndex = "90";
      img.style.width = "220px";
      img.style.height = "auto";

      container.appendChild(img);

      const fadeOut = 0.2;
      const aliveDuration = EXPOSURE_SECONDS;

      gsap.fromTo(
        img,
        { opacity: 0, scale: initialScale, x: 0, y: 0 },
        {
          opacity: 1,
          scale: targetScale,
          x: moveX,
          y: moveY,
          duration: Math.max(aliveDuration - fadeOut, 0.3),
          ease: "power2.out",
        }
      );

      gsap.to(img, {
        opacity: 0,
        duration: fadeOut,
        delay: Math.max(aliveDuration - fadeOut, 0.3),
        onComplete: () => img.remove(),
      });
    };

    // manage interval based on enabled
    const start = () => {
      if (timerRef.current) return;
      timerRef.current = window.setInterval(() => {
        if (enabled) createAndAnimate();
      }, GENERATE_INTERVAL_MS);
    };

    const stop = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    start();

    return () => {
      stop();
      container.innerHTML = "";
    };
  }, [enabled, month]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 90 }}
    />
  );
}
