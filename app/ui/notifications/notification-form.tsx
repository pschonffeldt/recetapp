"use client";

import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/app/ui/toast/toast-provider";
import { NotificationUserOption } from "@/app/lib/data";
import { Button } from "../general/button";
import Link from "next/link";
import { createNotification } from "@/app/lib/notifications/actions";

type ActionState = {
  ok: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
  id?: string;
};

const initialState: ActionState = { ok: false, message: null };

type Props = {
  users: NotificationUserOption[];
};

export default function NewNotificationForm({ users }: Props) {
  const { push } = useToast();
  const [publishNow, setPublishNow] = useState(true);
  const [audience, setAudience] = useState<"broadcast" | "user">("broadcast");

  const [state, formAction] = useActionState<ActionState, FormData>(
    createNotification as any,
    initialState
  );

  // Error and success messages
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
      {/* Recipient */}
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Recipient</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="audience"
                value="broadcast"
                checked={audience === "broadcast"}
                onChange={() => setAudience("broadcast")}
              />
              Broadcast (all users)
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="audience"
                  value="user"
                  checked={audience === "user"}
                  onChange={() => setAudience("user")}
                />
                <span>Specific user:</span>
              </label>
              <select
                name="userId"
                className="w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-base"
                disabled={audience !== "user"}
                defaultValue=""
              >
                <option value="">Select a user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.lastName} — {u.email}
                  </option>
                ))}
              </select>
              {err("userId") && (
                <p className="mt-1 text-sm text-red-500">{err("userId")}</p>
              )}
            </div>
          </div>
        </div>
        {/* Notification or message title */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Title</label>
          <input
            name="title"
            type="text"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-base"
            placeholder="What’s new?"
            required
          />
          {err("title") && (
            <p className="mt-1 text-sm text-red-500">{err("title")}</p>
          )}
        </div>
        {/* Notification or message body */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Body</label>
          <textarea
            name="body"
            rows={5}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-base"
            placeholder="Details for users…"
            required
          />
          {err("body") && (
            <p className="mt-1 text-sm text-red-500">{err("body")}</p>
          )}
        </div>
        {/* Notification or message Kind / Level */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Kind</label>
            <select
              name="kind"
              defaultValue="system"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-base"
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
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-base"
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
        {/* Notification or message optional link */}
        <div className="mb-4">
          <label className="mb-2 block text-base font-medium">
            Link URL (optional)
          </label>
          <input
            name="linkUrl"
            type="url"
            placeholder="https://example.com/changelog"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-base"
          />
          {err("linkUrl") && (
            <p className="mt-1 text-sm text-red-500">{err("linkUrl")}</p>
          )}
        </div>
        {/* Notification or message publish controls */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            Delivery time
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              {/* Option 1: send now */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="publishNow"
                  value="true" // will become "true" in FormData
                  checked={publishNow}
                  onChange={() => setPublishNow(true)}
                />
                <span>Send now</span>
              </label>
              {/* Option 2: schedule for later */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="publishNow"
                    value="false" // will become "false" in FormData
                    checked={!publishNow}
                    onChange={() => setPublishNow(false)}
                  />
                  <span>Schedule for later</span>
                </label>
              </div>
              <div className="sm:w-64">
                <label className="mb-2 block text-sm font-medium">
                  Date &amp; time (UTC)
                </label>
                <input
                  name="publishAt"
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-base disabled:bg-gray-50"
                  disabled={publishNow} // only enabled when "Schedule for later"
                />
                {err("publishAt") && (
                  <p className="mt-1 text-sm text-red-500">
                    {err("publishAt")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {/* Discard notification button */}
        <Button className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50">
          <Link href="/dashboard/notifications">Cancel</Link>
        </Button>
        {/* Create notification button */}
        <Button
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          type="submit"
        >
          Create notification
        </Button>
      </div>

      {state?.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
