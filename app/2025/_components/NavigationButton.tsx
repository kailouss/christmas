import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

export function NavigationButton({
  direction,
  onClick,
  disabled,
}: NavigationButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const position = direction === "prev" ? "left-0" : "right-0";

  return (
    <div
      className={`absolute inset-y-0 ${position} z-10 hidden items-center px-4 sm:flex sm:px-6`}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed sm:p-3"
        title={direction === "prev" ? "Previous" : "Next"}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  );
}
