"use server";

import { registerFormSchema, signInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import * as argon2 from "argon2";
import client from "../db";
import { user_data } from "@/_common/types";
import { formatError } from "../utils";
import { DuplicateAccountError } from "@/_common/errors";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);
    return { success: true, message: "Signed in Successfully." };
  } catch (error) {

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password." };
  }
}

// Sign out user
export async function signUserOut() {
  await signOut();
}

// Register user
export async function registerUser(prevState: unknown, formData: FormData) {
  try {
    const user = registerFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const duplicateUser = await client
      .db("testDB")
      .collection("User")
      .findOne<user_data>({ email: user.email });

    if (!duplicateUser) {
      user.password = await argon2.hash(user.password);
      await client.db("testDB").collection("User").insertOne({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    } else {
      throw new DuplicateAccountError();
    }

    return { success: true, message: "User registered successfully." };
  } catch (error) {

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
