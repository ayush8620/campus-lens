import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

export function formatLPA(lpa: number): string {
  return `₹${lpa.toFixed(2)} LPA`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.0) return "text-emerald-500";
  if (rating >= 3.0) return "text-amber-500";
  return "text-red-500";
}

export function getRatingBg(rating: number): string {
  if (rating >= 4.0) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (rating >= 3.0) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-red-500/10 text-red-600 dark:text-red-400";
}

export function getChanceColor(chance: string): { bg: string; text: string; border: string } {
  switch (chance) {
    case "Safe":
      return { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" };
    case "Moderate":
      return { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" };
    case "Dream":
      return { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" };
    default:
      return { bg: "bg-zinc-500/10", text: "text-zinc-600 dark:text-zinc-400", border: "border-zinc-500/20" };
  }
}
