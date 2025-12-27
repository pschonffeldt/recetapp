import Logo from "@/app/ui/branding/branding-recetapp-logo";
import LoginForm from "@/app/ui/login-signup/login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col space-y-2">
      <div className="flex h-12 w-full items-end rounded-lg bg-gradient-to-r from-blue-700 to-cyan-600 p-3 md:h-20">
        <div className="w-28 text-white md:w-32">
          <Logo />
        </div>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
