import { useEffect, useRef } from "react";

interface FlashConfig {
  enabled: boolean;
  interval?: number; // ms between flashes (for intro)
  duration?: number; // ms flash lasts
  intensity?: number; // 0-1, opacity peak
  minDelay?: number; // ms min delay for random flashes (for months)
  maxDelay?: number; // ms max delay for random flashes (for months)
  startDelay?: number; // ms delay before starting flashes
  count?: number; // number of flashes (if set, stops after count)
}

export function useFlash(
  containerRef: React.RefObject<HTMLDivElement>,
  config: FlashConfig
) {
  const flashRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const flashCountRef = useRef(0);

  useEffect(() => {
    if (!config.enabled || !containerRef.current) return;

    // Create flash overlay if not exists
    if (!flashRef.current) {
      flashRef.current = document.createElement("div");
      flashRef.current.style.cssText = `
        position: absolute;
        inset: 0;
        background: white;
        opacity: 0;
        pointer-events: none;
        z-index: 40;
        transition: opacity 0.15s ease-out;
      `;
      containerRef.current.appendChild(flashRef.current);
    }

    const triggerFlash = () => {
      if (!flashRef.current) return;
      if (config.count && flashCountRef.current >= config.count) return;

      flashRef.current.style.opacity = String(config.intensity ?? 0.7);
      flashCountRef.current++;

      setTimeout(() => {
        if (flashRef.current) {
          flashRef.current.style.opacity = "0";
        }
      }, config.duration ?? 150);
    };

    const startFlashing = () => {
      flashCountRef.current = 0;

      // Single flash (just startDelay, no interval)
      if (!config.interval && !config.minDelay && !config.maxDelay) {
        triggerFlash();
        return;
      }

      // Periodic flashes (intro slide or counted flashes)
      if (config.interval) {
        if (config.count) {
          // Limited count flashes
          const flashInterval = () => {
            if (flashCountRef.current < config.count!) {
              triggerFlash();
              timerRef.current = setTimeout(flashInterval, config.interval!);
            }
          };
          flashInterval();
        } else {
          // Infinite interval flashes
          timerRef.current = setInterval(triggerFlash, config.interval);
        }
      } else if (config.minDelay && config.maxDelay) {
        // Random flashes (month slides)
        const scheduleNextFlash = () => {
          const delay =
            Math.random() * (config.maxDelay! - config.minDelay!) +
            config.minDelay!;
          timerRef.current = setTimeout(() => {
            triggerFlash();
            scheduleNextFlash();
          }, delay);
        };
        scheduleNextFlash();
      }
    };

    // Start after delay if specified
    if (config.startDelay) {
      timerRef.current = setTimeout(startFlashing, config.startDelay);
    } else {
      startFlashing();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        clearTimeout(timerRef.current);
      }
      if (
        flashRef.current &&
        containerRef.current?.contains(flashRef.current)
      ) {
        containerRef.current.removeChild(flashRef.current);
        flashRef.current = null;
      }
    };
  }, [
    config.enabled,
    config.interval,
    config.duration,
    config.intensity,
    config.minDelay,
    config.maxDelay,
    config.startDelay,
    config.count,
    containerRef,
  ]);
}
