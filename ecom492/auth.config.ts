import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const matcher = [/\/admin/];
      const { pathname } = request.nextUrl;
      if (!auth && matcher.some((p) => p.test(pathname))) return false;
      if (!request.cookies.get("cart_id")) {
        const cart_id = crypto.randomUUID();
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });
        response.cookies.set("cart_id", cart_id);
        return response;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
