import { z } from "zod";
import { formatNumberWithPrecision } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithPrecision(Number(value))),
    "Price must have exactly two decimal places."
  );

// Schema for inserting Products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string(),
  quantity: z.coerce.number(),
  price: currency,
  brand: z.string().min(3, "Brand must be at least 3 characters."),
  category: z.array(z.string()).min(1, "Item must have at least one category."),
  images: z.array(z.string()).min(1, "Item must have at least one image."),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  _id: z.string().min(1, "Id is required"),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email adddress."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// Schema for regestering users
export const registerFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    email: z.string().email("Invalid email adddress."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
