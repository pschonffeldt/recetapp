"use client";

import { useActionState } from "react";
import { updateUser, type UserFormState } from "@/app/lib/actions";
import { capitalizeFirst } from "@/app/lib/utils";
import { COUNTRIES, LANGUAGE, UserForm } from "@/app/lib/definitions";
import { inter } from "../fonts";

// initial state with strong typing
const initialState: UserFormState = { message: null, errors: {} };

export default function EditAccountSettingsForm({ user }: { user: UserForm }) {
  const [state, formAction] = useActionState(updateUser, initialState);

  return (
    <form action={formAction} className="pb-12">
      {/* Recipe form fields */}
      <input type="hidden" name="id" value={user.id} />
      <div className="space-y-6 rounded-md bg-gray-50 p-4 md:p-6">
        {/* Personal info */}
        <section className="p-3 text-sm border-b-2 border-b-gray-200">
          <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
            Personal information
          </h2>
          <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
            {/* First name */}
            <div>
              <label
                htmlFor="first_name"
                className="mb-2 block text-sm font-medium"
              >
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                defaultValue={user.name}
                autoComplete="given-name"
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
              />
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
                Save
              </button>
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
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                autoComplete="email"
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
              />
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
                Change email
              </button>
            </div>
          </div>
        </section>

        {/* Login info */}
        <section className="p-3 text-sm border-b-2 border-b-gray-200">
          {" "}
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
                defaultValue={user.password}
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
              />
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
                Set password
              </button>
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
              />
            </div>
          </div>
        </section>

        {/* Language & region */}
        <section className="p-3 text-sm border-b-gray-200">
          {" "}
          <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
            Language and region
          </h2>
          <div className="mb-6 grid gap-6 rounded-md p-2 sm:grid-cols-2">
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-medium"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue={user.country}
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
                Change country
              </button>
            </div>

            {/* Language */}
            <div>
              <label
                htmlFor="language"
                className="mb-2 block text-sm font-medium"
              >
                Language
              </label>
              <select
                id="language"
                name="language"
                defaultValue={user.language}
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-base"
              >
                {LANGUAGE.map((t) => (
                  <option key={t} value={t}>
                    {capitalizeFirst(t)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
                Change language
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
        <Link
          href="/dashboard/recipes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Discard Changes
        </Link>
        <Button type="submit">Save Changes</Button>
      </div> */}

      {/* Global message */}
      {state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
