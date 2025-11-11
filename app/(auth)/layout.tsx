// Login and Signup layout

import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Root flex layout:
    <div className="flex h-screen flex-col fixed inset-0 overflow-hidden ">
      {/* Make the toast context available to ALL dashboard UI */}
      <ToastProvider>
        {/* Main content area (scrolls on lg+) */}
        <div className="flex-grow">{children}</div>
      </ToastProvider>
    </div>
  );
}
