import Logo from "@/app/ui/branding/branding-recetapp-logo";
import SignupForm from "@/app/ui/login-signup/signup-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-24 w-full items-end rounded-lg bg-gradient-to-r from-blue-700 to-cyan-600 p-3">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
