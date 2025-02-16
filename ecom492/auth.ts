import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import client from "./lib/db";
import { user_data } from "./_common/types";
import type { NextAuthConfig } from "next-auth";
import { ObjectId } from "mongodb";

const config = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
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
              // TODO: return role when available
              return {
                id: user._id,
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

      console.log(token);

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
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
