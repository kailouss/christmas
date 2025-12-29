"use client";

import type { Slide } from "./Contents";
import { MonthFireworks } from "./MonthFireworks";

interface MonthPageProps {
  slide: Slide;
  active: boolean;
}

export function MonthPage({ slide, active }: MonthPageProps) {
  if (!("month" in slide) || !slide.month) return null;

  return (
    <div className="relative h-full w-full">
      <div className="relative z-99 flex h-full w-full items-center justify-center">
        <p
          className="text-sm uppercase tracking-[0.3em] font-semibold text-white"
          style={{
            textShadow:
              "0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
          }}
        >
          {slide.month} 2025
        </p>
      </div>
      {/* Fireworks behind other visuals */}
      <MonthFireworks active={active} />
      {/* Month Label */}
    </div>
  );
}
