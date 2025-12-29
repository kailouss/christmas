import type { Slide } from "./Contents";

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
        <div className="text-6xl sm:text-7xl md:text-8xl">{slide.content}</div>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          {slide.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-light opacity-90">
          {slide.subtitle}
        </p>
      </div>
    </>
  );
}
