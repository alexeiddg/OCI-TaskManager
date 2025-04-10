import NextAuth from "next-auth";
import Slack from "@auth/core/providers/slack";
import GitHub from "@auth/core/providers/github";
import MailGun from "@auth/core/providers/mailgun";
import Credentials from "@auth/core/providers/credentials";
import { UserRole } from "@/lib/types/enums/UserRole";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour (in seconds)
    updateAge: 15 * 60, // 15 minutes (in seconds)
  },
  providers: [
    // Slack,
    // GitHub,
    // MailGun({ // configuration for MailGun if needed }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {};

        if (!username || !password) {
          console.error("🔐 Missing credentials");
          return null;
        }

        // Call Spring Boot backend login endpoint
        try {
          const res = await fetch(
            `${process.env.BACKEND_URL}/api/v2/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            },
          );

          if (!res.ok) {
            console.warn("🛑 Backend login failed with status:", res.status);
            return null;
          }

          const user = await res.json();
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ Failed to reach backend:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id !== undefined) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
    signOut: "/signOut",
  },
  secret: process.env.AUTH_SECRET,
});
