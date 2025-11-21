import { brand } from "@/app/ui/branding/branding";
import Logo from "@/app/ui/branding/recetapp-logo";
import SideNav from "@/app/ui/dashboard/sidenav";
import UserSettingsFabServer from "@/app/ui/dashboard/userSettingsFabServer";
import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Root flex layout:
    <div className="flex h-screen flex-col lg:fixed lg:inset-0 lg:flex-row lg:overflow-hidden lg:min-h-0">
      {/* Make the toast context available to ALL dashboard UI */}
      <ToastProvider>
        {/* Side navigation column - desktop only */}
        <div className="hidden lg:block lg:w-60 lg:flex-none lg:min-h-0 lg:overflow-y-auto">
          <SideNav />
        </div>

        {/* Main content area (scrolls on lg+) */}
        <div className="flex-grow min-h-0 pt-0 lg:overflow-y-auto lg:p-12 lg:overscroll-y-contain">
          {/* Mobile header with RecetApp logo/brand */}
          <div
            className={`${brand(
              "brand",
              "bg"
            )} mb-4 flex items-center justify-between px-4 py-6 lg:hidden`}
          >
            <div className="flex items-center gap-2">
              <Logo />
            </div>
          </div>

          {children}

          {/* Floating user menu / logout – mobile only (opposite of SideNav) */}
          <div className="lg:hidden">
            <UserSettingsFabServer />
          </div>
        </div>
      </ToastProvider>
    </div>
  );
}
