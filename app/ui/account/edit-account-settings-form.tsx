// app/ui/account/edit-account-settings-form.tsx
"use client";

import { useActionState } from "react";
import { updateUserProfile, updateUserPassword } from "@/app/lib/actions";
import { type UserForm } from "@/app/lib/definitions";
import { inter } from "../fonts";
import Link from "next/link";
import { Button } from "../button";

type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors.map((e) => (
        <p key={e} className="mt-2 text-sm text-red-500">
          {e}
        </p>
      ))}
    </div>
  );
}

const emptyState: ActionResult = { ok: false, message: null, errors: {} };

export default function EditAccountSettingsForm({ user }: { user: UserForm }) {
  // PROFILE
  const [profileState, profileAction] = useActionState<ActionResult, FormData>(
    updateUserProfile,
    emptyState
  );

  // PASSWORD
  const [pwdState, pwdAction] = useActionState<ActionResult, FormData>(
    updateUserPassword,
    emptyState
  );

  const hasErr = (state: ActionResult, k: string) =>
    Boolean(state.errors?.[k]?.length);

  return (
    <div className="pb-12">
      {/* PROFILE FORM */}
      <form action={profileAction}>
        <input type="hidden" name="id" value={user.id} />
        <div className="space-y-6 rounded-md bg-gray-50 p-4 md:p-6">
          <section className="p-3 text-sm">
            <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
              Personal information
            </h2>

            <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
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
                <FieldErrors id="name" errors={profileState.errors?.name} />
              </div>

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
                <FieldErrors
                  id="last_name"
                  errors={profileState.errors?.last_name}
                />
              </div>

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
                <FieldErrors id="email" errors={profileState.errors?.email} />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
          <Link
            href="/dashboard/recipes"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Discard Changes
          </Link>
          <Button type="submit">Save Changes</Button>
        </div>

        {profileState.message && (
          <p className="mt-3 text-sm text-red-600">{profileState.message}</p>
        )}
      </form>

      {/* PASSWORD FORM */}
      {/* Use the 1-arg dispatcher returned by useActionState */}
      <form action={pwdAction} className="mt-8">
        <input type="hidden" name="id" value={user.id} />
        <div className="space-y-6 rounded-md bg-gray-50 p-4 md:p-6">
          <section className="p-3 text-sm">
            <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
              Login information
            </h2>

            <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
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
                <FieldErrors id="password" errors={pwdState.errors?.password} />
              </div>

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
                <FieldErrors
                  id="confirm_password"
                  errors={pwdState.errors?.confirm_password}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
          <Button type="submit">Update Password</Button>
        </div>

        {pwdState.message && (
          <p className="mt-3 text-sm text-red-600">{pwdState.message}</p>
        )}
      </form>
    </div>
  );
}
