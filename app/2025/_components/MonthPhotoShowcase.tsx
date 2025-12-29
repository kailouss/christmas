"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MonthPhotoShowcaseProps {
  active: boolean;
}

const IMAGE_SRC = "/test.webp";
const PHOTOS_PER_CYCLE = 8;
const CYCLES = 2;
const STAGGER_SECONDS = 0.25; // 16 photos start within ~4s
const EXPOSURE_SECONDS = 1; // 1s exposure with fade in/out

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

export function MonthPhotoShowcase({ active }: MonthPhotoShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cleanup any prior run
    timelineRef.current?.kill();
    timelineRef.current = null;
    container.innerHTML = "";

    if (!active) return;

    const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
    timelineRef.current = tl;

    for (let cycle = 0; cycle < CYCLES; cycle += 1) {
      for (let i = 0; i < PHOTOS_PER_CYCLE; i += 1) {
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
        img.style.zIndex = "98";
        img.style.width = "220px";
        img.style.height = "auto";

        container.appendChild(img);

        const startTime = (cycle * PHOTOS_PER_CYCLE + i) * STAGGER_SECONDS;
        const fadeIn = 0.2;
        const fadeOut = 0.2;
        const aliveDuration = EXPOSURE_SECONDS;

        // Fade in while zooming and drifting
        tl.fromTo(
          img,
          { opacity: 0, scale: initialScale, x: 0, y: 0 },
          {
            opacity: 1,
            scale: targetScale,
            x: moveX,
            y: moveY,
            duration: Math.max(aliveDuration - fadeOut, 0.3),
            ease: "power2.out",
          },
          startTime
        );

        // Fade out at end of exposure
        tl.to(
          img,
          { opacity: 0, duration: fadeOut },
          startTime + Math.max(aliveDuration - fadeOut, 0.3)
        );

        tl.add(() => {
          img.remove();
        }, startTime + EXPOSURE_SECONDS + 0.05);
      }
    }

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      container.innerHTML = "";
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 98 }}
    />
  );
}
