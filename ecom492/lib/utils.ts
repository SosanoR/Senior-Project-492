import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DuplicateAccountError } from "@/_common/errors";

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
  return s.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(" ");
  } else {
    // Handle other errors
    switch (error.constructor) {
      case DuplicateAccountError:
        return "An account with this email already exists.";
      default:
        return "An error occurred. Please try again later.";
    }
  }
}

// Convert MongoDB Document to plain object
export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

interface item {
  price: number;
  discount: number;
  quantity: number;
}

export function calcPrice<T extends item>(arr: T[]): {total_price: number} {
  return {total_price: Number((arr.reduce((acc: number, item: T) => acc + ((item.price * ((100 - item.discount) / 100)) * item.quantity), 0)).toFixed(2))};
}