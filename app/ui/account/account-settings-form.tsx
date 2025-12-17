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

const FIELD_LABELS: Record<string, string> = {
  user_name: "User name",
  name: "First name",
  last_name: "Last name",
  email: "Email",
  country: "Country",
  gender: "Gender",
  date_of_birth: "Date of birth",
  height_cm: "Height",
  weight_kg: "Weight",
  allergies: "Allergies",
  dietary_flags: "Dietary preferences",
  password: "Password",
  confirm_password: "Confirm password",
};

function buildToastMessage(state: ActionResult): string | null {
  const entries = Object.entries(state.errors ?? {});
  const pieces: string[] = [];

  for (const [field, msgs] of entries) {
    if (!msgs?.length) continue;
    const label = FIELD_LABELS[field] ?? field;
    for (const m of msgs) pieces.push(`${label}: ${m}`);
  }

  // De-dupe + cap length so toasts don’t get ridiculous
  const uniq = Array.from(new Set(pieces));

  if (uniq.length > 0) {
    const shown = uniq.slice(0, 3);
    const extra = uniq.length - shown.length;
    return extra > 0
      ? `${shown.join(" • ")} • +${extra} more`
      : shown.join(" • ");
  }

  return state.message ?? null;
}

function hasFieldErr(state: ActionResult, k: string) {
  return Boolean(state.errors?.[k]?.length);
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
  const submittedGenderRef = useRef<string | null>(null);

  const serverGender = ((user as any).gender ?? "") as string;
  useEffect(() => {
    if (
      submittedGenderRef.current !== null &&
      serverGender !== submittedGenderRef.current
    ) {
      return;
    }

    setGender(serverGender);

    if (
      submittedGenderRef.current !== null &&
      serverGender === submittedGenderRef.current
    ) {
      submittedGenderRef.current = null;
    }
  }, [serverGender]);

  // Controlled country so it doesn't snap back
  const [country, setCountry] = useState<string>(
    () => ((user as any).country ?? "") as string
  );
  const submittedCountryRef = useRef<string | null>(null);

  const serverCountry = ((user as any).country ?? "") as string;
  useEffect(() => {
    if (
      submittedCountryRef.current !== null &&
      serverCountry !== submittedCountryRef.current
    ) {
      return;
    }

    setCountry(serverCountry);

    if (
      submittedCountryRef.current !== null &&
      serverCountry === submittedCountryRef.current
    ) {
      submittedCountryRef.current = null;
    }
  }, [serverCountry]);

  // Pending flags
  const [profilePending, setProfilePending] = useState(false);
  const [pwdPending, setPwdPending] = useState(false);

  // Ref guards (prevents double toast in dev/StrictMode)
  const profileHandledRef = useRef(false);
  const pwdHandledRef = useRef(false);

  const onSubmitProfile = () => {
    profileHandledRef.current = false;
    submittedGenderRef.current = gender;
    submittedCountryRef.current = country;
    setProfilePending(true);
  };

  const onSubmitPwd = () => {
    pwdHandledRef.current = false;
    setPwdPending(true);
  };

  // Profile result handling (toast-only)
  useEffect(() => {
    if (!profilePending) return;

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

    const msg = buildToastMessage(profileState);
    if (msg && !profileHandledRef.current) {
      profileHandledRef.current = true;
      push({
        variant: "error",
        title: "Couldn’t update profile",
        message: msg,
      });
      setProfilePending(false);
    }
  }, [profilePending, profileState, push, router, startRefresh]);

  // Password result handling (toast-only)
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

    const msg = buildToastMessage(pwdState);
    if (msg && !pwdHandledRef.current) {
      pwdHandledRef.current = true;
      push({
        variant: "error",
        title: "Couldn’t update password",
        message: msg,
      });
      setPwdPending(false);
    }
  }, [pwdPending, pwdState, push, router, startRefresh]);

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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(profileState, "user_name")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(profileState, "user_name")}
                />
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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(profileState, "name")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(profileState, "name")}
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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(profileState, "last_name")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(profileState, "last_name")}
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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(profileState, "email")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(profileState, "email")}
                />
              </div>

              {/* Country (optional) */}
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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(profileState, "country")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  autoComplete="country-name"
                  aria-invalid={hasFieldErr(profileState, "country")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-base",
                      hasFieldErr(profileState, "gender")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "gender")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-base",
                      hasFieldErr(profileState, "date_of_birth")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "date_of_birth")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-base",
                      hasFieldErr(profileState, "weight_kg")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "weight_kg")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-base",
                      hasFieldErr(profileState, "height_cm")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "height_cm")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-sm",
                      hasFieldErr(profileState, "allergies")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "allergies")}
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
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-sm",
                      hasFieldErr(profileState, "dietary_flags")
                        ? "border-red-300"
                        : "border-gray-200",
                    ].join(" ")}
                    aria-invalid={hasFieldErr(profileState, "dietary_flags")}
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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(pwdState, "password")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(pwdState, "password")}
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
                  className={[
                    "block w-full rounded-md border px-3 py-2 text-base",
                    hasFieldErr(pwdState, "confirm_password")
                      ? "border-red-300"
                      : "border-gray-200",
                  ].join(" ")}
                  aria-invalid={hasFieldErr(pwdState, "confirm_password")}
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
