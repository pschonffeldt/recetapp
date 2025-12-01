"use client";

import { useActionState, useEffect } from "react";
import { updateUserProfile, updateUserPassword } from "@/app/lib/actions";
import { type UserForm } from "@/app/lib/definitions";
import { inter } from "../branding/branding-fonts";
import Link from "next/link";
import { Button } from "../general/button";
import { useToast } from "@/app/ui/toast/toast-provider";

type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const emptyState: ActionResult = { ok: false, message: null, errors: {} };

function pickFirstError(errors: Record<string, string[]>): string | null {
  for (const key of Object.keys(errors)) {
    const msgs = errors[key];
    if (msgs && msgs.length) return msgs[0];
  }
  return null;
}

// Toast handling
function resultToToastError(state: ActionResult): string | null {
  // prefer first field error; otherwise use top-level message
  const fieldMsg = pickFirstError(state.errors);
  return fieldMsg ?? state.message ?? null;
}

// Edit user account info
export default function EditAccountSettingsForm({ user }: { user: UserForm }) {
  const { push } = useToast();

  // Separate actions
  const [profileState, profileAction] = useActionState<ActionResult, FormData>(
    updateUserProfile,
    emptyState
  );
  const [pwdState, pwdAction] = useActionState<ActionResult, FormData>(
    updateUserPassword,
    emptyState
  );

  // General success toasts
  useEffect(() => {
    if (profileState.ok) {
      push({
        variant: "success",
        title: "Profile updated",
        message: "Your changes were saved.",
      });
    }
  }, [profileState.ok, push]);

  // Passwprd success toasts
  useEffect(() => {
    if (pwdState.ok) {
      push({
        variant: "success",
        title: "Password updated",
        message: "Your password was changed successfully.",
      });
    }
  }, [pwdState.ok, push]);

  // General error toasts
  useEffect(() => {
    if (!profileState.ok) {
      const msg = resultToToastError(profileState);
      if (msg) {
        push({
          variant: "error",
          title: "Couldn’t update profile",
          message: msg,
        });
      }
    }
  }, [profileState, push]);
  // Password error toasts
  useEffect(() => {
    if (!pwdState.ok) {
      const msg = resultToToastError(pwdState);
      if (msg) {
        push({
          variant: "error",
          title: "Couldn’t update password",
          message: msg,
        });
      }
    }
  }, [pwdState, push]);

  const hasErr = (state: ActionResult, k: string) =>
    Boolean(state.errors?.[k]?.length);

  return (
    <div className="pb-12">
      {/* PROFILE FORM */}
      <form action={profileAction}>
        <input type="hidden" name="id" value={user.id} />
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <section className="p-3 text-sm ">
            <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
              Personal information
            </h2>

            {/* Public name - user name */}
            <div className="gap-6 rounded-md p-2">
              <div>
                <label
                  htmlFor="user_name"
                  className="mb-2 block text-sm font-medium"
                >
                  User name
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  defaultValue={user.user_name}
                  autoComplete="user-name"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "user_name")}
                  aria-describedby={
                    hasErr(profileState, "user_name")
                      ? "user_name-error"
                      : undefined
                  }
                />
                {profileState.errors?.user_name?.length ? (
                  <p id="user_name-error" className="mt-2 text-sm text-red-500">
                    {profileState.errors.user_name[0]}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
              {/* First name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  First name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  autoComplete="given-name"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "name")}
                  aria-describedby={
                    hasErr(profileState, "name") ? "name-error" : undefined
                  }
                />
                {profileState.errors?.name?.length ? (
                  <p id="name-error" className="mt-2 text-sm text-red-500">
                    {profileState.errors.name[0]}
                  </p>
                ) : null}
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium"
                >
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  defaultValue={user.last_name}
                  autoComplete="family-name"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "last_name")}
                  aria-describedby={
                    hasErr(profileState, "last_name")
                      ? "last_name-error"
                      : undefined
                  }
                />
                {profileState.errors?.last_name?.length ? (
                  <p id="last_name-error" className="mt-2 text-sm text-red-500">
                    {profileState.errors.last_name[0]}
                  </p>
                ) : null}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  autoComplete="email"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "email")}
                  aria-describedby={
                    hasErr(profileState, "email") ? "email-error" : undefined
                  }
                />
                {profileState.errors?.email?.length ? (
                  <p id="email-error" className="mt-2 text-sm text-red-500">
                    {profileState.errors.email[0]}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
          {profileState.message && (
            <p className="mt-3 text-sm text-red-600">{profileState.message}</p>
          )}
          <Link
            href="/dashboard"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Discard Changes
          </Link>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>

      {/* PASSWORD FORM */}
      <form action={pwdAction} className="mt-8">
        <input type="hidden" name="id" value={user.id} />
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <section className="p-3 text-sm ">
            <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
              Login information
            </h2>

            <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue=""
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(pwdState, "password")}
                  aria-describedby={
                    hasErr(pwdState, "password") ? "password-error" : undefined
                  }
                />
                {pwdState.errors?.password?.length ? (
                  <p id="password-error" className="mt-2 text-sm text-red-500">
                    {pwdState.errors.password[0]}
                  </p>
                ) : null}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm_password"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  defaultValue=""
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(pwdState, "confirm_password")}
                  aria-describedby={
                    hasErr(pwdState, "confirm_password")
                      ? "confirm_password-error"
                      : undefined
                  }
                />
                {pwdState.errors?.confirm_password?.length ? (
                  <p
                    id="confirm_password-error"
                    className="mt-2 text-sm text-red-500"
                  >
                    {pwdState.errors.confirm_password[0]}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
          {pwdState.message && (
            <p className="mt-3 text-sm text-red-600">{pwdState.message}</p>
          )}
          <Button type="submit">Update Password</Button>
        </div>
      </form>
    </div>
  );
}
