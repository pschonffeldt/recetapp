"use client";

import { createAccount } from "@/app/lib/auth/actions";
import { COUNTRIES } from "@/app/lib/types/definitions";
import { inter } from "@/app/ui/branding/branding-fonts";
import { Button } from "@/app/ui/general/button";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useActionState } from "react";

type SignupState = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
  userId?: string;
};

const initial: SignupState = { ok: false, message: null, errors: {} };

export default function SignupForm() {
  const reducer = async (
    _prev: SignupState,
    formData: FormData,
  ): Promise<SignupState> => {
    const res = await createAccount(_prev, formData);
    return res as SignupState;
  };

  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    reducer,
    initial,
  );

  const err = (k: keyof SignupState["errors"] | string) =>
    state.errors?.[k as string]?.[0];

  return (
    <form action={formAction} className="space-y-2">
      <div className="rounded-lg bg-gray-50 px-6 pb-4 pt-4 shadow-md">
        <h1 className={`${inter.className} mb-1 text-2xl`}>
          Create your account.
        </h1>

        {/* User name */}
        <div>
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="user_name"
          >
            User name
          </label>
          <div className="relative">
            <input
              id="user_name"
              name="user_name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="Your public user name"
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            {err("user_name") && (
              <p className="mt-2 text-sm text-red-500">{err("user_name")}</p>
            )}
          </div>
        </div>

        {/* First name */}
        <div>
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="name"
          >
            First name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="Your first name"
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            {err("name") && (
              <p className="mt-2 text-sm text-red-500">{err("name")}</p>
            )}
          </div>
        </div>

        {/* Last name */}
        <div className="mt-4">
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="last_name"
          >
            Last name
          </label>
          <div className="relative">
            <input
              id="last_name"
              name="last_name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="Your last name (optional)"
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            {err("last_name") && (
              <p className="mt-2 text-sm text-red-500">{err("last_name")}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="mt-4">
          <label
            htmlFor="country"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Country
          </label>

          <select
            id="country"
            name="country"
            required
            defaultValue=""
            className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            autoComplete="country-name"
          >
            <option value="" disabled>
              Select a country…
            </option>

            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {err("country") && (
            <p className="mt-2 text-sm text-red-500">{err("country")}</p>
          )}
        </div>

        {/* Date of birth */}
        <div className="mt-4">
          <label
            htmlFor="date_of_birth"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Date of birth
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            required
            className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="you@example.com"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {err("email") && (
            <p className="mt-2 text-sm text-red-500">{err("email")}</p>
          )}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="Create a password"
              required
              minLength={8}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {err("password") && (
            <p className="mt-2 text-sm text-red-500">{err("password")}</p>
          )}
        </div>

        {/* Confirm */}
        <div className="mt-4">
          <label
            className="mb-1 mt-2 block text-xs font-medium text-gray-900"
            htmlFor="confirm"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type="password"
              name="confirm"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
              placeholder="Repeat your password"
              required
              minLength={8}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {err("confirm") && (
            <p className="mt-2 text-sm text-red-500">{err("confirm")}</p>
          )}
        </div>

        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Create account{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Inline status */}
        <div className="mt-2 min-h-6" aria-live="polite" aria-atomic="true">
          {!!state.message && !state.ok && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}
        </div>

        <p className="flex min-h-12 items-center justify-center text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 pl-1 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
