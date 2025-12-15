"use client";

import { useActionState, useEffect } from "react";
import type { UserForm, MembershipTier } from "@/app/lib/types/definitions";
import { inter } from "@/app/ui/branding/branding-fonts";
import Link from "next/link";
import { Button } from "@/app/ui/general/button";
import { useToast } from "@/app/ui/toast/toast-provider";
import {
  updateUserProfile,
  updateUserPassword,
} from "@/app/lib/account/actions";
import { capitalizeFirst, formatDateToLocal } from "@/app/lib/utils/format";

type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const emptyState: ActionResult = { ok: false, message: null, errors: {} };

// Extra admin-only metadata that may come from your admin users query
type AdminUserExtra = {
  membership_tier: MembershipTier | null;
  user_role?: string | null;
  created_at?: string;
  profile_updated_at?: string | null;
  password_changed_at?: string | null;
  last_login_at?: string | null;
  recipes_owned_count?: number;
  recipes_imported_count?: number;
};

function pickFirstError(errors: Record<string, string[]>): string | null {
  for (const key of Object.keys(errors)) {
    const msgs = errors[key];
    if (msgs && msgs.length) return msgs[0];
  }
  return null;
}

function resultToToastError(state: ActionResult): string | null {
  const fieldMsg = pickFirstError(state.errors);
  return fieldMsg ?? state.message ?? null;
}

// helper: defaultValue can’t be null
function dv(v: string | null | undefined): string {
  return v ?? "";
}

export default function AdminUserEditForm({
  user,
}: {
  user: UserForm & Partial<AdminUserExtra>;
}) {
  const { push } = useToast();

  const [profileState, profileAction] = useActionState<ActionResult, FormData>(
    updateUserProfile,
    emptyState
  );
  const [pwdState, pwdAction] = useActionState<ActionResult, FormData>(
    updateUserPassword,
    emptyState
  );

  // Success toasts
  useEffect(() => {
    if (profileState.ok) {
      push({
        variant: "success",
        title: "User profile updated",
        message: "The user information was saved.",
      });
    }
  }, [profileState.ok, push]);

  useEffect(() => {
    if (pwdState.ok) {
      push({
        variant: "success",
        title: "Password updated",
        message: "The user’s password was changed.",
      });
    }
  }, [pwdState.ok, push]);

  // Error toasts
  useEffect(() => {
    if (!profileState.ok) {
      const msg = resultToToastError(profileState);
      if (msg) {
        push({
          variant: "error",
          title: "Couldn’t update user profile",
          message: msg,
        });
      }
    }
  }, [profileState, push]);

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

  // ===== Derived admin info for display =====
  const membershipTier: MembershipTier =
    (user.membership_tier as MembershipTier) ?? "free";
  const role = user.user_role ?? "user";

  const owned = user.recipes_owned_count ?? 0;
  const imported = user.recipes_imported_count ?? 0;
  const totalRecipes = owned + imported;

  const safeDate = (value?: string | null) =>
    value ? formatDateToLocal(value) : "—";

  const membershipLabel: Record<MembershipTier, string> = {
    free: "Free plan",
    tier1: "Tier 1",
    tier2: "Tier 2",
  };

  const membershipPillClass =
    membershipTier === "free"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  const rolePillClass =
    role === "admin"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="mt-6">
      {/* ================= PROFILE FORM (personal / language, etc.) ================= */}
      <form action={profileAction}>
        <input type="hidden" name="id" value={user.id} />

        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <section className="space-y-12 p-3 text-sm">
            {/* Personal info */}
            <div>
              <h2 className={`${inter.className} mb-2 text-xl md:text-2xl`}>
                Personal information
              </h2>

              {/* Username / handle */}
              <div className="rounded-md p-2">
                <label
                  htmlFor="user_name"
                  className="mb-2 block text-sm font-medium"
                >
                  User name (public handle)
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  defaultValue={dv(user.user_name)}
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

              <div className="mb-2 grid gap-6 rounded-md p-2 sm:grid-cols-2">
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
                    defaultValue={dv(user.name)}
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
                    defaultValue={dv(user.last_name)}
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
                    <p
                      id="last_name-error"
                      className="mt-2 text-sm text-red-500"
                    >
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
                    defaultValue={dv(user.email)}
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

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    defaultValue={dv((user as any).country)}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                    aria-invalid={hasErr(profileState, "country")}
                    aria-describedby={
                      hasErr(profileState, "country")
                        ? "country-error"
                        : undefined
                    }
                  />

                  {profileState.errors?.country?.length ? (
                    <p id="country-error" className="mt-2 text-sm text-red-500">
                      {profileState.errors.country[0]}
                    </p>
                  ) : null}
                </div>

                {/* Language */}
                <div>
                  <label
                    htmlFor="language"
                    className="mb-2 block text-sm font-medium"
                  >
                    Language
                  </label>
                  <input
                    id="language"
                    name="language"
                    type="text"
                    // capitalizeFirst should get a string, not null/undefined
                    defaultValue={capitalizeFirst(dv((user as any).language))}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                    aria-invalid={hasErr(profileState, "language")}
                    aria-describedby={
                      hasErr(profileState, "language")
                        ? "language-error"
                        : undefined
                    }
                  />
                  {profileState.errors?.language?.length ? (
                    <p
                      id="language-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {profileState.errors.language[0]}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Membership + role (info only for now) */}
            <div>
              <h2 className={`${inter.className} mb-2 text-xl md:text-2xl`}>
                Membership & role
              </h2>
              <div className="rounded-md border border-gray-200 bg-white p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-600">Membership:</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 font-medium ${membershipPillClass}`}
                  >
                    {membershipLabel[membershipTier]}
                  </span>

                  <span className="ml-3 text-gray-600">Role:</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 font-medium ${rolePillClass}`}
                  >
                    {role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity / usage info */}
            <div>
              <h2 className={`${inter.className} mb-2 text-xl md:text-2xl`}>
                Activity & usage
              </h2>

              <div className="grid gap-4 text-xs sm:grid-cols-2">
                <div className="rounded-md border border-gray-200 bg-white p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Recipe library
                  </p>
                  <p className="text-sm">
                    Total recipes:{" "}
                    <span className="font-semibold">{totalRecipes}</span>
                  </p>
                  <p className="mt-1">
                    Own: <span className="font-semibold">{owned}</span> ·
                    Imported: <span className="font-semibold">{imported}</span>
                  </p>
                </div>

                <div className="rounded-md border border-gray-200 bg-white p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Account activity
                  </p>
                  <dl className="space-y-1">
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-600">Joined</dt>
                      <dd className="text-gray-800">
                        {safeDate(user.created_at)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-600">Last login</dt>
                      <dd className="text-gray-800">
                        {safeDate(user.last_login_at)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-600">Profile info changed</dt>
                      <dd className="text-gray-800">
                        {safeDate(user.profile_updated_at)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-600">Password changed</dt>
                      <dd className="text-gray-800">
                        {safeDate(user.password_changed_at)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
          {profileState.message && (
            <p className="mt-3 text-sm text-red-600">{profileState.message}</p>
          )}
          <Link
            href="/dashboard/admin/users"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Back to users
          </Link>
          <Button type="submit">Update user</Button>
        </div>
      </form>
    </div>
  );
}
