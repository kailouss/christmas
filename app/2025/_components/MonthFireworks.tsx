"use client";

import { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

interface MonthFireworksProps {
  active: boolean;
}

export function MonthFireworks({ active }: MonthFireworksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fwRef = useRef<Fireworks | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!fwRef.current) {
      fwRef.current = new Fireworks(container, {
        autoresize: true,
        opacity: 0.4,
        acceleration: 1.02,
        friction: 0.98,
        gravity: 1.5,
        particles: 120,
        explosion: 6,
        boundaries: {
          x: 0,
          y: 0,
          width: container.clientWidth,
          height: container.clientHeight,
        },
        sound: {
          enabled: false,
        },
      });
    }

    if (active) {
      fwRef.current?.start();
    } else {
      fwRef.current?.stop(true);
    }

    return () => {
      fwRef.current?.stop(true);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 1 }}
    />
  );
}
