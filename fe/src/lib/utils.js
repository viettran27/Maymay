import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDayInMonth = (month, year) => {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => `${i + 1}/${month}`);
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
}

export const getFirstDateOfMonth = () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return formatDate(firstDayOfMonth)
}

export const getLastDateOfMonth = () => {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return formatDate(lastDayOfMonth)
}