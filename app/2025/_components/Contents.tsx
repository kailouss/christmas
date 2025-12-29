import { ChevronsRight } from "lucide-react";

export const TARGET_DATE = "2026-01-01T00:00:00+08:00";

export const SLIDES = [
  {
    id: 0,
    title: "Wrapped",
    subtitle: "A year of memories",
    content: "2025",
    isIntro: true,
  },
  {
    id: 1,
    month: "January",
  },
  {
    id: 2,
    month: "February",
  },
  {
    id: 3,
    month: "March",
  },
  {
    id: 4,
    month: "April",
  },
  {
    id: 5,
    month: "May",
  },
  {
    id: 6,
    month: "June",
  },
  {
    id: 7,
    month: "July",
  },
  {
    id: 8,
    month: "August",
  },
  {
    id: 9,
    month: "September",
  },
  {
    id: 10,
    month: "October",
  },
  {
    id: 11,
    month: "November",
  },
  {
    id: 12,
    month: "December",
  },
  {
    id: 13,
    title: "See you in 2026!",
    subtitle: "Reflecting & celebrating",
    content: "That’s a wrap for 2025!",
    isFinal: true,
  },
] as const;

export type Slide = (typeof SLIDES)[number];
