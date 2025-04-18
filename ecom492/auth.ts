
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import client from "./lib/db";
import { user_data } from "./_common/types";
import { ObjectId } from "mongodb";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";
const config = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }
        const user = await client
          .db("testDB")
          .collection("User")
          .findOne<user_data>({ email: credentials.email as string });

        if (user && user.password) {
          try {
            const verfied = await argon2.verify(
              user.password,
              credentials.password as string
            );

            if (verfied) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          } catch (error) {
            console.log(error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        if (user.name === "") {
          token.name = user.email.split("@")[0];
          const filter = { _id: new ObjectId(token.sub) };
          const updateName = { $set: { name: token.name } };
          await client
            .db("testDB")
            .collection("User")
            .updateOne(filter, updateName);
        }

        if (trigger === "signIn") {
          const cookie = await cookies();
          const cart_id = cookie.get("cart_id")?.value;
          if (cart_id) {
            const cart = await client
              .db("testDB")
              .collection("Cart")
              .findOne({ cart_id: cart_id });
            
              if (cart) {

               const found = await client.db("testDB").collection("Cart").updateOne({cart_id: cart_id}, {$set: {user_id: user.id}});
              }
          }
        }
      }
      return token;
    },
    ...authConfig.callbacks,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
