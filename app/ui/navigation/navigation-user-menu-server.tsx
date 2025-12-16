import { logout } from "@/app/lib/logout";
import { auth } from "@/auth";
import UserSettingsFab from "./navigation-user-menu";

export default async function UserMenuServer() {
  const session = await auth();

  const isAdmin = ((session?.user as any)?.user_role ?? "user") === "admin";

  return <UserSettingsFab isAdmin={isAdmin} logoutAction={logout} />;
}
