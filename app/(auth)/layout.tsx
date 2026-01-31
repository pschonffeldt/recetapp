import { ToastProvider } from "@/app/ui/toast/toast-provider";
import { SectionPageBackground } from "../ui/login-signup/section-page-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-white">
      <SectionPageBackground variant="home" />

      <ToastProvider>
        <main className="relative z-10 flex min-h-dvh items-center justify-center px-4">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </ToastProvider>
    </div>
  );
}
