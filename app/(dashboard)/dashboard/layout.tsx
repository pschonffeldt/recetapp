// ============================================
// Dashboard Layout (RSC)
// - Persistent SideNav on the left (lg+), content on the right
// - Floating User Settings FAB inside the content area
// - Uses responsive flex to stack on mobile and split on desktop
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */

// UI chrome
import SideNav from "@/app/ui/dashboard/sidenav";
import UserSettingsFab from "@/app/ui/user-menu";

// Auth
import { logout } from "@/auth";

/* ================================
 * Layout Component
 * ================================ */
/**
 * Children are rendered in the scrollable content pane.
 * Notes:
 * - The root container is a full-height flex layout.
 * - On small screens it's a single column; on lg+ it becomes a row with a fixed-width sidenav.
 * - Overflow scrolling is applied to the content area on lg+ so the sidenav stays fixed.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Root flex layout:
    // - mobile: column (sidenav above content)
    // - lg+: row (sidenav left, content right) with hidden overflow on cross-axis
    <div className="flex h-screen flex-col lg:fixed lg:inset-0 lg:flex-row lg:overflow-hidden lg:min-h-0">
      {/* Side navigation column (fixed width on lg+, full width on mobile) */}
      <div className="w-full flex-none lg:w-60 lg:min-h-0 lg:overflow-y-auto">
        <SideNav />
      </div>

      {/* Main content area (grows to fill, scrolls on lg+) */}
      <div className="flex-grow min-h-0 pt-6 lg:overflow-y-auto lg:p-12 lg:overscroll-y-contain">
        {/* <div className="flex-grow min-h-0lg:overflow-y-auto lg:overscroll-y-contain"> */}
        {children}{" "}
        {/* Floating action button for profile/settings/logout.
            - Passes the server action `logout` to the FAB.
            - Links point to account/settings routes inside dashboard. */}
        <UserSettingsFab
          profileHref="/dashboard/account"
          settingsHref="/dashboard/settings"
          logoutAction={logout}
        />
      </div>
    </div>
  );
}
