import type { Slide } from "./Contents";
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

interface LastPageProps {
  slide: Slide;
  isUnlocked: boolean;
}

export function LastPage({ slide, isUnlocked }: LastPageProps) {
  if (!("isFinal" in slide) || !slide.isFinal) return null;

  return (
    <>
      {/* Content */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div
          className={`${ralewayThin.className} text-5xl font-thin sm:text-6xl md:text-7xl`}
        >
          {slide.content}
        </div>
        <h1
          className={`${ralewayBold.className} text-6xl font-bold sm:text-7xl md:text-8xl`}
        >
          {slide.title}
        </h1>
        <p
          className={`${ralewayThin.className} text-lg sm:text-xl md:text-2xl font-light opacity-90`}
        >
          {slide.subtitle}
        </p>
      </div>
    </>
  );
}
