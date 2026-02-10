import Logo from "../ui/branding/branding-recetapp-logo";
import SideNav from "../ui/navigation/navigation-sidenav";
import UserMenuServer from "../ui/navigation/navigation-user-menu-server";
import { ToastProvider } from "../ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-60 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <SideNav />
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Mobile header */}
          <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-6 lg:hidden">
            <div className="flex items-center gap-2 text-white">
              <Logo />
            </div>
          </div>
          <div className="lg:p-12">
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
