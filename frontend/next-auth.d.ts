// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@/lib/types/enums/UserRole";

declare module "next-auth" {
  /**
   * The shape of the user object returned via useSession, auth, and getServerSession.
   */
  interface Session extends DefaultSession {
    user: {
      id: number | string;
      role: UserRole;
      teamId: number | string | null;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object.
   */
  interface User extends DefaultUser {
    role: UserRole;
    teamId: number | string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * The shape of the JWT returned by the jwt callback and auth.
   */
  interface JWT {
    id: number | string;
    role: UserRole;
    teamId: number | string | null;
  }
}
