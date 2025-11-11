"use client";

import Link from "next/link";
import { inter } from "@/app/ui/fonts";
import { Button } from "@/app/ui/button";
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

type Props = {
  formAction: (fd: FormData) => void | Promise<void>;
  isPending?: boolean;
  callbackUrl?: string;
  errorMessage?: string | null;
  errors?: Record<string, string[]>;
};

export default function SignupForm({
  formAction,
  isPending,
  callbackUrl = "/dashboard",
  errorMessage,
  errors,
}: Props) {
  // helper to read first error per field
  const err = (k: string) => errors?.[k]?.[0];

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-md">
        <h1 className={`${inter.className} mb-3 text-2xl`}>
          Create your account.
        </h1>

        <div className="w-full">
          {/* First name */}
          <div>
            <label
              htmlFor="name"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              First name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                placeholder="Your first name"
                required
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                aria-invalid={Boolean(err("name"))}
                aria-describedby={err("name") ? "name-error" : undefined}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {err("name") && (
              <p id="name-error" className="mt-2 text-sm text-red-500">
                {err("name")}
              </p>
            )}
          </div>

          {/* Last name */}
          <div className="mt-4">
            <label
              htmlFor="last_name"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              Last name
            </label>
            <div className="relative">
              <input
                id="last_name"
                name="last_name"
                placeholder="Your last name"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                aria-invalid={Boolean(err("last_name"))}
                aria-describedby={
                  err("last_name") ? "last_name-error" : undefined
                }
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {err("last_name") && (
              <p id="last_name-error" className="mt-2 text-sm text-red-500">
                {err("last_name")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                aria-invalid={Boolean(err("email"))}
                aria-describedby={err("email") ? "email-error" : undefined}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {err("email") && (
              <p id="email-error" className="mt-2 text-sm text-red-500">
                {err("email")}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                minLength={8} // set to 6 if you want parity with login
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                aria-invalid={Boolean(err("password"))}
                aria-describedby={
                  err("password") ? "password-error" : undefined
                }
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {err("password") && (
              <p id="password-error" className="mt-2 text-sm text-red-500">
                {err("password")}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="mt-4">
            <label
              htmlFor="confirm"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                aria-invalid={Boolean(err("confirm"))}
                aria-describedby={err("confirm") ? "confirm-error" : undefined}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {err("confirm") && (
              <p id="confirm-error" className="mt-2 text-sm text-red-500">
                {err("confirm")}
              </p>
            )}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Create account
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <div
          className="mt-4 flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
