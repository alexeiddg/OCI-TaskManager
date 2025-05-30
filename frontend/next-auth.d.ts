// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      accessToken?: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object.
   */
  interface User extends DefaultUser {
    role: UserRole;
    teamId: number | string | null;
    accessToken?: string;
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
    accessToken?: string;
  }
}
