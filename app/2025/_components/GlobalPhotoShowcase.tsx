"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GlobalPhotoShowcaseProps {
  enabled: boolean; // generate new photos only when true; existing ones fade naturally
}

const IMAGE_SRC = "/test.webp";
const GENERATE_INTERVAL_MS = 250; // 16 photos in ~4s
const EXPOSURE_SECONDS = 1; // life of each photo

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

export function GlobalPhotoShowcase({ enabled }: GlobalPhotoShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createAndAnimate = () => {
      const { top, left, initialScale, targetScale, rotation, moveX, moveY } =
        randomPosition();
      const img = document.createElement("img");
      img.src = IMAGE_SRC;
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
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 90 }}
    />
  );
}
