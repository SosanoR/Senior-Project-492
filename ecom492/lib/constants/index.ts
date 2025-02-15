export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Mercury Express";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "An Ecommerce Project creating using Nextjs by Ricardo Hernandez";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const MONGODB_URI = process.env.MONGODB_URI;

export const PRODUCT_DISPLAY_LIMIT = 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const registrationDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
