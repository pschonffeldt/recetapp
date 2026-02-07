"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createContactRequest } from "@/app/lib/contact/actions";
type ContactFormCardProps = {
  className?: string;
  title?: string;
  subtitle?: string;
};

type State = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const initialState: State = { ok: false, message: null, errors: {} };

export function ContactFormCard({
  className,
  title = "Send a message",
  subtitle = "We usually reply within 1–2 business days.",
}: ContactFormCardProps) {
  const [state, formAction, pending] = useActionState(
    createContactRequest,
    initialState,
  );

  const fieldError = (key: string) => state?.errors?.[key]?.[0];

  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className ?? "",
      ].join(" ")}
    >
      <div className="border-b px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      </div>

      <form className="p-5" action={formAction}>
        <div className="grid gap-4">
          {/* Honeypot (spam trap) */}
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Name</span>
            <input
              name="name"
              placeholder="Your name"
              required
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            {fieldError("contact_name") ? (
              <span className="text-xs text-red-600">
                {fieldError("contact_name")}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            {fieldError("contact_email") ? (
              <span className="text-xs text-red-600">
                {fieldError("contact_email")}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Topic</span>
            <select
              name="category"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              defaultValue="account"
            >
              <option value="account">Support</option>
              <option value="feature">Product feedback</option>
              <option value="billing">Billing / pricing</option>
              <option value="bug">Report a bug</option>
              <option value="other">Other</option>
            </select>
            {fieldError("category") ? (
              <span className="text-xs text-red-600">
                {fieldError("category")}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Subject</span>
            <input
              name="subject"
              placeholder="Short summary"
              required
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            {fieldError("subject") ? (
              <span className="text-xs text-red-600">
                {fieldError("subject")}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us what you need…"
              required
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            {fieldError("message") ? (
              <span className="text-xs text-red-600">
                {fieldError("message")}
              </span>
            ) : null}
          </label>

          {state.message ? (
            <p
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                state.ok
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700",
              ].join(" ")}
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending || state.ok}
            className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {pending ? "Sending..." : state.ok ? "Sent" : "Send message"}
          </button>
          <p className="text-xs text-gray-500">
            By sending this message you agree to our{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
