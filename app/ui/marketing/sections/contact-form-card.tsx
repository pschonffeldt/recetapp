import Link from "next/link";

type ContactFormCardProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  emailTo?: string; // defaults to info@mitkof.cl
  emailSubject?: string; // defaults to Support
  maintenanceText?: string;
};

export function ContactFormCard({
  className,
  title = "Send a message",
  subtitle = "We usually reply within 1–2 business days.",
  emailTo = "info@mitkof.cl",
  emailSubject = "Support",
  maintenanceText = "Send message (under maintenance)",
}: ContactFormCardProps) {
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

      <form className="p-5">
        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Name</span>
            <input
              name="name"
              placeholder="Your name"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Topic</span>
            <select
              name="topic"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              defaultValue="support"
            >
              <option value="support">Support</option>
              <option value="feedback">Product feedback</option>
              <option value="billing">Billing / pricing</option>
              <option value="partnerships">Partnerships</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-gray-700">Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us what you need…"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </label>

          <button
            type="button"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {maintenanceText}
          </button>

          <p className="text-center text-xs text-gray-500">
            Email us at{" "}
            <a
              href={`mailto:${emailTo}?subject=${encodeURIComponent(
                emailSubject,
              )}`}
              className="underline underline-offset-2"
            >
              {emailTo}
            </a>
          </p>

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
