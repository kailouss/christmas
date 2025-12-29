"use client";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/20"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-white transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
