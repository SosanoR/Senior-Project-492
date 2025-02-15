import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format Number with precision
export function formatNumberWithPrecision(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format string to title case
export function formatToTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function formatError(error: any) {
//   if (error.name === "ZodError"){
//     // Handle zod error
//     return;
//   } else if (error.name === "") {
//     // Handle db error
//     return;
//   }
// }