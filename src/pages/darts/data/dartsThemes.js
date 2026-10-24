import { Zap, Flame, Droplet, Leaf } from "lucide-react";
import styles from "../DartScoreCore.module.css";

export const PLAYER_THEMES = [
  {
    id: 0,
    name: "GREEN",
    element: "leaf",
    icon: Leaf,
    colorHex: "#10b981",
    border: styles.themeGreenBorder,
    borderActive: styles.themeGreenBorderActive,
    bgActive: styles.themeGreenBgActive,
    bgSubtle: styles.themeGreenBgSubtle,
    bgBtn: styles.themeGreenBgBtn,
    text: styles.themeGreenText,
    dot: styles.themeGreenDot,
    badge: styles.themeGreenBadge,
  },
  {
    id: 1,
    name: "RED",
    element: "fire",
    icon: Flame,
    colorHex: "#ef4444",
    border: styles.themeRedBorder,
    borderActive: styles.themeRedBorderActive,
    bgActive: styles.themeRedBgActive,
    bgSubtle: styles.themeRedBgSubtle,
    bgBtn: styles.themeRedBgBtn,
    text: styles.themeRedText,
    dot: styles.themeRedDot,
    badge: styles.themeRedBadge,
  },
  {
    id: 2,
    name: "YELLOW",
    element: "electric",
    icon: Zap,
    colorHex: "#eab308",
    border: styles.themeYellowBorder,
    borderActive: styles.themeYellowBorderActive,
    bgActive: styles.themeYellowBgActive,
    bgSubtle: styles.themeYellowBgSubtle,
    bgBtn: styles.themeYellowBgBtn,
    text: styles.themeYellowText,
    dot: styles.themeYellowDot,
    badge: styles.themeYellowBadge,
  },
  {
    id: 3,
    name: "BLUE",
    element: "water",
    icon: Droplet,
    colorHex: "#3b82f6",
    border: styles.themeBlueBorder,
    borderActive: styles.themeBlueBorderActive,
    bgActive: styles.themeBlueBgActive,
    bgSubtle: styles.themeBlueBgSubtle,
    bgBtn: styles.themeBlueBgBtn,
    text: styles.themeBlueText,
    dot: styles.themeBlueDot,
    badge: styles.themeBlueBadge,
  },
];

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
