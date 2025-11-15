import { auth } from "@/auth";
import NavLinksClient from "./nav-links-client";

export default async function NavLinks() {
  const session = await auth();
  const isAdmin = ((session?.user as any)?.user_role ?? "user") === "admin";
  return <NavLinksClient isAdmin={isAdmin} />;
}
