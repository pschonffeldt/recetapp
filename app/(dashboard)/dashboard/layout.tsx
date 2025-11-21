import SideNav from "@/app/ui/dashboard/sidenav";
import UserSettingsFabServer from "@/app/ui/dashboard/userSettingsFabServer";
import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Root flex layout:
    <div className="flex h-screen flex-col lg:fixed lg:inset-0 lg:flex-row lg:overflow-hidden lg:min-h-0">
      {/* Make the toast context available to ALL dashboard UI */}
      <ToastProvider>
        {/* Side navigation column */}
        <div className="w-full flex-none lg:w-60 lg:minh-0 lg:overflow-y-auto">
          <SideNav />
        </div>

        {/* Main content area (scrolls on lg+) */}
        <div className="flex-grow min-h-0 pt-6 lg:overflow-y-auto lg:p-12 lg:overscroll-y-contain">
          {children}

          {/* Floating user menu / logout (server wrapper handles isAdmin + logoutAction) */}
          <UserSettingsFabServer />
        </div>
      </ToastProvider>
    </div>
  );
}
