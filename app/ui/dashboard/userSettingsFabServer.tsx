// app/components/UserSettingsFabServer.tsx
import { logout } from "@/app/lib/logout";
import { auth } from "@/auth";
import UserSettingsFab from "./user-menu";

export default async function UserSettingsFabServer() {
  const session = await auth();

  const isAdmin = ((session?.user as any)?.user_role ?? "user") === "admin";

  return (
    <UserSettingsFab
      isAdmin={isAdmin}
      logoutAction={logout}
      // you can override defaults here if needed:
      // dashboardleHref="/dashboard"
      // profileHref="/dashboard/account"
      // recipesHref="/dashboard/recipes"
      // notificationsHref="/dashboard/notifications"
      // adminNotificationHref="/dashboard/admin/notification-center"
      // adminUsersHref="/dashboard/admin/users"
    />
  );
}
