import { z } from "zod";
import { formatNumberWithPrecision } from "./utils";

const currency = z.coerce
  .number()
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
  images: z
    .array(z.string())
    .min(1, "Product must contain at least one image."),
  discount: z.coerce
    .number()
    .min(0, "Discount must be a positive number.")
    .max(100, "Discount cannot be more than 100%."),
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
  user_id: z
    .string()
    .min(24, "User id is required.")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid user id format."),
  user_name: z
    .string()
    .min(1, "User name is required.")
    .regex(/^[a-zA-Z0-9 ]+$/, "Invalid user name format."),
  product_id: z
    .string()
    .min(24, "Product id is required.")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid product id format."),
  text: z
    .string()
    .min(10, "Comment must be at least 10 characters long.")
    .regex(
      /^[a-zA-Z0-9 .,!?'"()\-\n]{10,}$/,
      "Comment must be at least 10 characters long and can only contain letters, numbers, spaces, and punctuation. No special characters allowed."
    ),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Cannot be less than 1")
    .max(5, "Cannot be more than 5"),
});

// Schema for updating reviews
export const reviewFormSchemaUpdate = reviewFormSchemaInsert.extend({
  _id: z
    .string()
    .min(24, "Id is required")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid review id format."),
  created_on: z.coerce.date(),
  last_modified: z.coerce.date(),
});

// export type Review = z.infer<typeof reviewFormSchemaInsert> & {
//   _id?: string;
//   created_on?: Date;
//   last_modified?: Date;
// };

// Schema for individual Cart items
export const cartItemSchema = z.object({
  product_id: z.string().min(1, "Product id is required."),
  name: z.string().min(1, "Name is required."),
  brand: z.string().min(1, "Brand is required."),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be a positive number."),
  image: z.string().min(1, "Image is required."),
  price: z.coerce.number().nonnegative("Price must be a positive number."),
  discount: z.coerce
    .number()
    .min(0, "Discount must be a positive number.")
    .max(100, "Discount cannot be more than 100%."),
  average_rating: z.coerce.number(),
});

// Schema for Cart
export const cartSchema = z.object({
  user_id: z.string().optional().nullable(),
  items: z.array(cartItemSchema).min(1, "Cart must have at least one item."),
  total_price: z.coerce
    .number()
    .nonnegative("Total price must be a positive number."),
  cart_id: z.string().min(1, "Cart id is required."),
  status: z.enum(["active", "completed", "pending"], {
    message: "Status must be one of: active, completed, pending.",
  }),
  created_on: z.coerce.date().optional(),
  last_modified: z.coerce.date().optional(),
});

const alphaNumericRegex = /^[a-zA-Z0-9\s]+$/;

// Schema for filtering products
export const filteringParamsSchema = z
  .object({
    query: z.string().regex(alphaNumericRegex, "AlphaNumeric only"),
    category: z.string().regex(alphaNumericRegex, "AlphaNumeric only").optional(),
    brand: z.string().regex(alphaNumericRegex, "AlphaNumeric only").optional(),
    min: z.coerce
      .number()
      .nonnegative("Minimum price must be a positive number.")
      .optional(),
    max: z.coerce
      .number()
      .nonnegative("Maximum price must be a positive number.")
      .max(10000, "Maximum price cannot be more than 10,000.")
      .optional(),
    sort: z
      .enum(["price-l-h", "price-h-l", "rating-h-l", "rating-l-h"], {
        message: "Sort by must be one of: 'price-l-h', 'price-h-l', 'rating-h-l', 'rating-l-h'.",
      })
      .optional(),
    page: z.coerce
      .number()
      .int()
      .nonnegative("Page must be a non-negative integer.")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.min !== undefined &&
        data.max !== undefined &&
        data.min > data.max
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Minimum price/rating cannot be greater than maximum price/rating.",
    }
  );
