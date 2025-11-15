"use client";

import { useActionState } from "react";
import { createNotification } from "@/app/lib/actions";

const initial = {
  ok: false,
  message: null as string | null,
  errors: {} as Record<string, string[]>,
};

export default function ComposerForm() {
  const [state, formAction, pending] = useActionState(
    createNotification as any,
    initial
  );

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Compose notification</h2>

      <form action={formAction} className="space-y-4">
        {/* Target */}
        <div>
          <label className="mb-1 block text-sm font-medium">Target</label>
          <select name="userId" className="w-full rounded-md border px-3 py-2">
            <option value="broadcast">Broadcast (all users)</option>
            {/* For now free text UUID input is simpler; later you can add a user picker */}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            To send to a specific user, replace value with their UUID in the DB.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" className="w-full rounded-md border px-3 py-2" />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label className="mb-1 block text-sm font-medium">Body</label>
          <textarea
            name="body"
            rows={4}
            className="w-full rounded-md border px-3 py-2"
          />
          {state.errors?.body && (
            <p className="mt-1 text-sm text-red-500">{state.errors.body[0]}</p>
          )}
        </div>

        {/* Kind / Level */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Kind</label>
            <select
              name="kind"
              className="w-full rounded-md border px-3 py-2"
              defaultValue="system"
            >
              <option value="system">system</option>
              <option value="maintenance">maintenance</option>
              <option value="feature">feature</option>
              <option value="message">message</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Level</label>
            <select
              name="level"
              className="w-full rounded-md border px-3 py-2"
              defaultValue="info"
            >
              <option value="info">info</option>
              <option value="success">success</option>
              <option value="warning">warning</option>
              <option value="error">error</option>
            </select>
          </div>
        </div>

        {/* Link (optional) */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Link URL (optional)
          </label>
          <input
            name="linkUrl"
            className="w-full rounded-md border px-3 py-2"
            placeholder="https://…"
          />
          {state.errors?.linkUrl && (
            <p className="mt-1 text-sm text-red-500">
              {state.errors.linkUrl[0]}
            </p>
          )}
        </div>

        {/* Publish controls */}
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium">Publish</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="publishNow" defaultChecked />
            Publish now
          </label>
          <div>
            <label className="mb-1 block text-sm">…or schedule at (ISO)</label>
            <input
              name="publishAt"
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              If “Publish now” is checked, this is ignored.
            </p>
          </div>
        </fieldset>

        {/* Submit */}
        <button
          disabled={!!pending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {pending ? "Publishing…" : "Publish"}
        </button>

        {/* Form-level message */}
        {state.message && (
          <p className="mt-2 text-sm text-red-600">{state.message}</p>
        )}
      </form>
    </div>
  );
}
