import { z } from "zod";
import { formatNumberWithPrecision } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithPrecision(Number(value))),
    "Price must be a number with up to two decimal places."
  );

// Schema for inserting Products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  quantity: z.coerce.number(),
  price: currency,
  brand: z.string().min(2, "Brand must be at least 2 characters."),
  // categories: z.array(z.string()).min(1, "Item must have at least one category."),
  // images: z.array(z.string()).min(1, "Item must have at least one image."),
  images: z.array(z.string()).min(1, "Product must contain at least one image."),
  discount: z.coerce.number(),
  category: z
  .string()
  .min(3, "Must have at least one category with 3 or more characters."),
  description: z.string(),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  _id: z.string().min(1, "Id is required"),
});

// Schema for updating and creating forms
export const formSchema = z.union([insertProductSchema, updateProductSchema]);

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
