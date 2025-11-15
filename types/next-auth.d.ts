import { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";
import type { Role } from "@/app/lib/definitions";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      user_role: Role;
    };
  }

  interface User {
    id: string;
    user_role: Role;
    email?: string | null;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    user_role?: Role;
  }
}

// Ensure this file is treated as a module
export {};
