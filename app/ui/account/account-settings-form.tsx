"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { COUNTRIES, type UserForm } from "@/app/lib/types/definitions";
import { inter } from "../branding/branding-fonts";
import Link from "next/link";
import { Button } from "../general/button";
import { useToast } from "@/app/ui/toast/toast-provider";
import {
  updateUserProfile,
  updateUserPassword,
} from "@/app/lib/account/actions";
import { useRouter } from "next/navigation";

type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const emptyState: ActionResult = { ok: false, message: null, errors: {} };

const asIntDefault = (v: unknown) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(Math.round(n)) : "";
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

function pgArrayToCsv(v: unknown): string {
  if (v === null || v === undefined) return "";

  if (Array.isArray(v)) {
    return v
      .map((x) => String(x ?? "").trim())
      .filter(Boolean)
      .join(", ");
  }

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return "";

    if (s.startsWith("{") && s.endsWith("}")) {
      const inner = s.slice(1, -1).trim();
      if (!inner) return "";

      const parts: string[] = [];
      let cur = "";
      let inQuotes = false;

      for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];

        if (ch === '"' && inner[i - 1] !== "\\") {
          inQuotes = !inQuotes;
          continue;
        }

        if (ch === "," && !inQuotes) {
          parts.push(cur);
          cur = "";
          continue;
        }

        cur += ch;
      }
      parts.push(cur);

      return parts
        .map((p) => p.trim().replace(/\\"/g, '"').trim())
        .filter(Boolean)
        .join(", ");
    }

    return s;
  }

  return String(v).trim();
}

export default function EditAccountSettingsForm({ user }: { user: UserForm }) {
  const { push } = useToast();
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  const [profileState, profileAction] = useActionState<ActionResult, FormData>(
    updateUserProfile,
    emptyState
  );
  const [pwdState, pwdAction] = useActionState<ActionResult, FormData>(
    updateUserPassword,
    emptyState
  );

  // Controlled gender so it doesn't snap back
  const [gender, setGender] = useState<string>(
    () => ((user as any).gender ?? "") as string
  );

  // Pending flags that only clear once we have a real result
  const [profilePending, setProfilePending] = useState(false);
  const [pwdPending, setPwdPending] = useState(false);

  // Ref guards (prevents double toast in dev/StrictMode)
  const profileHandledRef = useRef(false);
  const pwdHandledRef = useRef(false);

  // Used to prevent the brief snap-back during router.refresh()
  const submittedGenderRef = useRef<string | null>(null);

  // Guarded gender sync (prevents flash)
  const serverGender = ((user as any).gender ?? "") as string;
  useEffect(() => {
    // If we just submitted a gender, ignore stale server props during refresh.
    if (
      submittedGenderRef.current !== null &&
      serverGender !== submittedGenderRef.current
    ) {
      return;
    }

    setGender(serverGender);

    // Once server catches up to our submitted value, clear the guard.
    if (
      submittedGenderRef.current !== null &&
      serverGender === submittedGenderRef.current
    ) {
      submittedGenderRef.current = null;
    }
  }, [serverGender]);

  // Reset the "handled" guard each time user submits
  const onSubmitProfile = () => {
    profileHandledRef.current = false;
    submittedGenderRef.current = gender;
    setProfilePending(true);
  };

  const onSubmitPwd = () => {
    pwdHandledRef.current = false;
    setPwdPending(true);
  };

  useEffect(() => {
    if (!profilePending) return;

    // success
    if (profileState.ok) {
      if (!profileHandledRef.current) {
        profileHandledRef.current = true;
        push({
          variant: "success",
          title: "Profile updated",
          message: "Your changes were saved.",
        });
        startRefresh(() => router.refresh());
        setProfilePending(false);
      }
      return;
    }

    // error (only close pending when we actually have a message)
    const msg = resultToToastError(profileState);
    if (msg) {
      if (!profileHandledRef.current) {
        profileHandledRef.current = true;
        push({
          variant: "error",
          title: "Couldn’t update profile",
          message: msg,
        });
        setProfilePending(false);
      }
    }
  }, [profilePending, profileState, push, router, startRefresh]);

  useEffect(() => {
    if (!pwdPending) return;

    if (pwdState.ok) {
      if (!pwdHandledRef.current) {
        pwdHandledRef.current = true;
        push({
          variant: "success",
          title: "Password updated",
          message: "Your password was changed successfully.",
        });
        startRefresh(() => router.refresh());
        setPwdPending(false);
      }
      return;
    }

    const msg = resultToToastError(pwdState);
    if (msg) {
      if (!pwdHandledRef.current) {
        pwdHandledRef.current = true;
        push({
          variant: "error",
          title: "Couldn’t update password",
          message: msg,
        });
        setPwdPending(false);
      }
    }
  }, [pwdPending, pwdState, push, router, startRefresh]);

  const hasErr = (state: ActionResult, k: string) =>
    Boolean(state.errors?.[k]?.length);

  const allergiesText = useMemo(
    () => pgArrayToCsv((user as any).allergies),
    [(user as any).allergies]
  );

  const dietaryFlagsText = useMemo(
    () => pgArrayToCsv((user as any).dietary_flags),
    [(user as any).dietary_flags]
  );

  const dobValue = user.date_of_birth
    ? String(user.date_of_birth).slice(0, 10)
    : "";

  return (
    <div className="mt-8">
      {/* PROFILE FORM */}
      <form action={profileAction} onSubmit={onSubmitProfile}>
        <input type="hidden" name="id" value={user.id} />

        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <section className="p-3 text-sm">
            <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
              Personal information
            </h2>

            {/* User name */}
            <div className="gap-6 rounded-md p-2">
              <div>
                <label
                  htmlFor="user_name"
                  className="mb-2 block text-sm font-medium"
                >
                  User name (no spaces allowed)
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  defaultValue={user.user_name ?? ""}
                  autoComplete="username"
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
                  defaultValue={user.name ?? ""}
                  autoComplete="given-name"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "name")}
                  aria-describedby={
                    hasErr(profileState, "name") ? "name-error" : undefined
                  }
                />
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
                  defaultValue={user.last_name ?? ""}
                  autoComplete="family-name"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "last_name")}
                  aria-describedby={
                    hasErr(profileState, "last_name")
                      ? "last_name-error"
                      : undefined
                  }
                />
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
                  defaultValue={user.email ?? ""}
                  autoComplete="email"
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  aria-invalid={hasErr(profileState, "email")}
                  aria-describedby={
                    hasErr(profileState, "email") ? "email-error" : undefined
                  }
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium"
                >
                  Country (optional)
                </label>

                <select
                  id="country"
                  name="country"
                  defaultValue={(user as any).country ?? ""}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                >
                  <option value="">Not specified</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Health & dietary info */}
            <div>
              <h2 className={`${inter.className} mb-2 text-xl md:text-2xl`}>
                Health & dietary information
              </h2>

              <div className="grid gap-6 rounded-md p-2 sm:grid-cols-2">
                {/* Gender (controlled) */}
                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-medium"
                  >
                    Gender (optional)
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  >
                    <option value="">Not specified</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Date of birth */}
                <div>
                  <label
                    htmlFor="date_of_birth"
                    className="mb-2 block text-sm font-medium"
                  >
                    Date of birth
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={dobValue}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label
                    htmlFor="weight_kg"
                    className="mb-2 block text-sm font-medium"
                  >
                    Weight (kg)
                  </label>
                  <input
                    id="weight_kg"
                    name="weight_kg"
                    type="number"
                    step={1}
                    min={0}
                    inputMode="numeric"
                    defaultValue={asIntDefault((user as any).weight_kg)}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  />
                </div>

                {/* Height */}
                <div>
                  <label
                    htmlFor="height_cm"
                    className="mb-2 block text-sm font-medium"
                  >
                    Height (cm)
                  </label>
                  <input
                    id="height_cm"
                    name="height_cm"
                    type="number"
                    step={1}
                    min={0}
                    inputMode="numeric"
                    defaultValue={asIntDefault((user as any).height_cm)}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
                  />
                </div>
              </div>

              {/* Allergies + dietary flags */}
              <div className="mt-4 grid gap-6 rounded-md p-2 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="allergies"
                    className="mb-2 block text-sm font-medium"
                  >
                    Allergies (comma-separated)
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    defaultValue={allergiesText}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dietary_flags"
                    className="mb-2 block text-sm font-medium"
                  >
                    Dietary preferences / restrictions (comma-separated)
                  </label>
                  <textarea
                    id="dietary_flags"
                    name="dietary_flags"
                    defaultValue={dietaryFlagsText}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
              <Link
                href="/dashboard"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Discard Changes
              </Link>

              <Button type="submit" disabled={isRefreshing}>
                {isRefreshing ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </section>
        </div>
      </form>

      {/* PASSWORD FORM */}
      <form action={pwdAction} className="mt-8" onSubmit={onSubmitPwd}>
        <input type="hidden" name="id" value={user.id} />

        <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
                />
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
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
              <Button type="submit" disabled={isRefreshing}>
                {isRefreshing ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
