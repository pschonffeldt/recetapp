import Logo from "@/app/ui/branding/branding-recetapp-logo";
import SideNav from "@/app/ui/navigation/navigation-sidenav";
import UserMenuServer from "@/app/ui/navigation/navigation-user-menu-server";
import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col lg:fixed lg:inset-0 lg:flex-row lg:overflow-hidden">
      <ToastProvider>
        {/* Side navigation column - desktop only */}
        <aside className="hidden lg:block lg:w-60 lg:flex-none lg:overflow-y-auto">
          <SideNav />
        </aside>

        {/* Main content: NEVER scroll on lg+ (tables will scroll inside pages) */}
        <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
          {/* Mobile header */}
          <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-6 lg:hidden">
            <div className="flex items-center gap-2 text-white">
              <Logo />
            </div>
          </div>

          {/* Inner padding + fixed-height slot for children */}
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 md:px-6 lg:px-12 lg:pt-12">
            {/* This wrapper is CRITICAL: gives children real height to work with */}
            <div className="min-h-0 flex-1">{children}</div>

            {/* Floating user menu / logout – mobile only */}
            <div className="mt-6 lg:hidden">
              <UserMenuServer />
            </div>
          </div>
        </div>
      </ToastProvider>
    </div>
  );
}
