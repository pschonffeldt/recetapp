"use client";

import { useActionState, useEffect, useState } from "react";
import { createNotification } from "@/app/lib/actions";
import { useToast } from "@/app/ui/toast/toast-provider";

type ActionState = {
  ok: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
  id?: string;
};

const initialState: ActionState = { ok: false, message: null };

export default function NewNotificationForm() {
  const { push } = useToast();
  const [publishNow, setPublishNow] = useState(true);

  const [state, formAction] = useActionState<ActionState, FormData>(
    createNotification as any,
    initialState
  );

  useEffect(() => {
    if (state?.ok) {
      push({
        variant: "success",
        title: "Notification created",
        message: "Your notification was published.",
      });
    } else if (state?.message) {
      push({
        variant: "error",
        title: "Couldn’t create notification",
        message: state.message,
      });
    }
  }, [state, push]);

  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form action={formAction} className="rounded-md bg-gray-50 p-4 md:p-6">
      {/* Target */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Target</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="userId"
              value="broadcast"
              defaultChecked
            />
            Broadcast (all users)
          </label>
          {/* Optional: allow targeting a single user by UUID */}
          <div className="flex items-center gap-2">
            <span className="text-sm">or user id:</span>
            <input
              name="userId"
              type="text"
              placeholder="UUID (optional)"
              className="w-80 rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        {err("userId") && (
          <p className="mt-1 text-sm text-red-500">{err("userId")}</p>
        )}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Title</label>
        <input
          name="title"
          type="text"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="What’s new?"
          required
        />
        {err("title") && (
          <p className="mt-1 text-sm text-red-500">{err("title")}</p>
        )}
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Body</label>
        <textarea
          name="body"
          rows={5}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Details for users…"
          required
        />
        {err("body") && (
          <p className="mt-1 text-sm text-red-500">{err("body")}</p>
        )}
      </div>

      {/* Kind / Level */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Kind</label>
          <select
            name="kind"
            defaultValue="system"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="system">System</option>
            <option value="maintenance">Maintenance</option>
            <option value="feature">Feature</option>
            <option value="message">Message</option>
          </select>
          {err("kind") && (
            <p className="mt-1 text-sm text-red-500">{err("kind")}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Level</label>
          <select
            name="level"
            defaultValue="info"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          {err("level") && (
            <p className="mt-1 text-sm text-red-500">{err("level")}</p>
          )}
        </div>
      </div>

      {/* Optional link */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Link URL (optional)
        </label>
        <input
          name="linkUrl"
          type="url"
          placeholder="https://example.com/changelog"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        {err("linkUrl") && (
          <p className="mt-1 text-sm text-red-500">{err("linkUrl")}</p>
        )}
      </div>

      {/* Publish controls */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="publishNow"
            type="checkbox"
            defaultChecked
            onChange={(e) => setPublishNow(e.currentTarget.checked)}
          />
          Publish now
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Or schedule (UTC)
          </label>
          <input
            name="publishAt"
            type="datetime-local"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            disabled={publishNow}
          />
          {err("publishAt") && (
            <p className="mt-1 text-sm text-red-500">{err("publishAt")}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <a
          href="/dashboard/notifications"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black/80"
        >
          Create notification
        </button>
      </div>

      {state?.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
