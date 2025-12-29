import { Share2 } from "lucide-react";

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
}

export function Controls({ currentSlide, totalSlides }: ControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between sm:top-6 sm:left-6 sm:right-6">
      <span className="text-sm font-semibold text-white/70 sm:text-base">
        {currentSlide + 1} / {totalSlides}
      </span>
      <button
        type="button"
        className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:p-3"
        title="Share"
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
}
