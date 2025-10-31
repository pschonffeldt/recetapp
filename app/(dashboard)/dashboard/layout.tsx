import SideNav from "@/app/ui/dashboard/sidenav";
import UserSettingsFab from "@/app/ui/user-menu";
import { logout } from "@/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
    <div className="flex h-screen flex-col lg:flex-row lg:overflow-hidden">
      {/* Here we can adjust the sidenav width */}
      {/* <div className="w-full flex-none md:w-60"> */}
      <div className="w-full flex-none lg:w-60">
        <SideNav />
      </div>
      {/* <div className="flex-grow p-6 md:overflow-y-auto md:p-12"> */}
      <div className="flex-grow p-6 lg:overflow-y-auto lg:p-12">
        {children}{" "}
        <UserSettingsFab
          profileHref="/dashboard/profile"
          settingsHref="/dashboard/settings"
          logoutAction={logout}
        />
      </div>
    </div>
  );
}
