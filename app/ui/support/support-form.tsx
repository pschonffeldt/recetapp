"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/app/ui/general/button";
import { useToast } from "@/app/ui/toast/toast-provider";
import { createSupportRequest } from "@/app/lib/support/actions";

type State = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const initial: State = { ok: false, message: null, errors: {} };

export default function SupportForm() {
  const { push } = useToast();
  const [state, action] = useActionState<State, FormData>(
    createSupportRequest,
    initial
  );

  useEffect(() => {
    if (state.ok) {
      push({
        variant: "success",
        title: "Request sent",
        message: "We received your message and will get back to you soon.",
      });
    } else if (state.message) {
      push({
        variant: "error",
        title: "Couldn’t send request",
        message: state.message,
      });
    }
  }, [state.ok, state.message, push]);

  const err = (k: string) => state.errors?.[k]?.[0];

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          defaultValue="bug"
        >
          <option value="bug">Bug</option>
          <option value="billing">Billing</option>
          <option value="feature">Feature request</option>
          <option value="account">Account</option>
          <option value="other">Other</option>
        </select>
        {err("category") && (
          <p className="mt-1 text-sm text-red-500">{err("category")}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Short summary"
        />
        {err("subject") && (
          <p className="mt-1 text-sm text-red-500">{err("subject")}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          rows={6}
          placeholder="What happened? What did you expect? What did you try?"
        />
        {err("message") && (
          <p className="mt-1 text-sm text-red-500">{err("message")}</p>
        )}
      </div>

      <Button type="submit">Send to support</Button>
    </form>
  );
}
