import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDayInMonth = (month, year) => {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => `${i + 1}/${month}`);
}