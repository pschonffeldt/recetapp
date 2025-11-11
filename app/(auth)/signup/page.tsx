"use client";

import { Suspense, useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAccount } from "@/app/lib/actions";
import type { SignupResult } from "@/app/lib/actions";
import SignupForm from "@/app/ui/signup-form";
import Logo from "@/app/ui/recetapp-logo";

const initialState: SignupResult = { ok: false, message: null, errors: {} };

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirectTo") || "/dashboard";

  const [state, formAction, isPending] = useActionState<SignupResult, FormData>(
    createAccount,
    initialState
  );

  useEffect(() => {
    if (state.ok) router.push(redirectTo);
  }, [state.ok, redirectTo, router]);

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>
        <Suspense>
          <SignupForm
            formAction={formAction}
            isPending={isPending}
            errors={state.errors}
            errorMessage={state.message}
            callbackUrl={redirectTo}
          />
        </Suspense>
      </div>
    </main>
  );
}
