import Logo from "@/app/ui/branding/branding-recetapp-logo";
import SignupForm from "@/app/ui/login-signup/signup-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Signup" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col space-y-2">
      <div className="flex h-12 w-full items-end rounded-lg bg-gradient-to-r from-blue-700 to-cyan-600 p-3 md:h-20">
        <div className="w-28 text-white md:w-32">
          <Logo />
        </div>
      </div>

      <Suspense>
        <SignupForm />
      </Suspense>
    </div>
  );
}
