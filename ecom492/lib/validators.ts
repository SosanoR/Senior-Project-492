import { z } from "zod";
import { formatNumberWithPrecision } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithPrecision(Number(value))),
    "Price must have exactly two decimal places."
  );

// Schema for inserting Products
export const insertSchema = z.object({
  item_name: z.string().min(3, "Name must be at least 3 characters."),
  item_description: z.string(),
  item_category: z
    .string()
    .min(1, "Item must belong to at least one category."),
  dimension_unit: z.string().min(1, "Item must have a unit of measurement."),
  length: z.coerce.number(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  item_quantity: z.coerce.number(),
  item_price: currency,
  item_images: z.array(z.string()).min(1, "Item must have at least one image."),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email adddress."),
  password: z.string().min(8, "Password must be at least 8 characters.")
})

// Schema for regestering users 
export const registerFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.string().email("Invalid email adddress."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"]
})