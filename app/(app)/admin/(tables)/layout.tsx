import Logo from "@/app/ui/branding/branding-recetapp-logo";
import SideNav from "@/app/ui/navigation/navigation-sidenav";
import UserMenuServer from "@/app/ui/navigation/navigation-user-menu-server";
import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col lg:fixed lg:inset-0 lg:flex-row lg:overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:overflow-y-auto">
          <SideNav />
        </aside>

        {/* Main: never scroll on lg+ */}
        <div className="flex flex-1 min-h-0 flex-col lg:overflow-hidden">
          {/* Mobile header */}
          <div className="mb-4 items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-6 hidden">
            <div className="flex items-center gap-2 text-white">
              <Logo />
            </div>
          </div>
          <div className="flex-1 min-h-0 lg:p-12">
            {children}
            <div className="lg:hidden">
              <UserMenuServer />
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
