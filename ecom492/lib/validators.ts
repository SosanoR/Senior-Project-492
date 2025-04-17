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

// Schema for user Reviews
export const reviewFormSchemaInsert = z.object({
  user_id: z.string().min(1, "User id is required."),
  user_name: z.string().min(1, "User name is required."),
  product_id: z.string().min(1, "Product id is required."),
  text: z.string().min(10, "Comment must be at least 10 characters long."),
  rating: z.coerce.number().int().min(1, "Cannot be less than 1").max(5, "Cannot be more than 5"),
});

export const reviewFormSchemaUpdate = reviewFormSchemaInsert.extend({
  _id: z.string().min(1, "Id is required"),
  created_on: z.coerce.date(),
  last_modified: z.coerce.date(),
});

// Schema for updating reviews
export type Review = z.infer<typeof reviewFormSchemaInsert> & {
  _id?: string;
  created_on?: Date;
  last_modified?: Date;
};

// Schema for individual Cart items
export const cartItemSchema = z.object({
  product_id: z.string().min(1, "Product id is required."),
  name: z.string().min(1, "Name is required."),
  brand: z.string().min(1, "Brand is required."),
  quantity: z.coerce.number().int().nonnegative("Quantity must be a positive number."),
  image: z.string().min(1, "Image is required."),
  price: z.coerce.number().nonnegative("Price must be a positive number."),
  average_rating: z.coerce.number()
});

// Schema for Cart
export const cartSchema = z.object({
  user_id: z.string().optional().nullable(),
  items: z.array(cartItemSchema).min(1, "Cart must have at least one item."),
  total_price: z.coerce.number().nonnegative("Total price must be a positive number."),
  cart_id: z.string().min(1, "Cart id is required."),
});