import Link from "next/link";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";

export const metadata = { title: "Contact • RecetApp" };

function ContactFormCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">
          Send a message
        </div>
        <p className="mt-1 text-sm text-gray-600">
          We usually reply within 1–2 business days.
        </p>
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
            className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Send message (hook up later)
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Contact"
        title="Talk to the RecetApp team."
        description="Questions, feedback, or support — send a message and we’ll get back to you."
        backgroundVariant="features"
        minHeightClass="lg:min-h-[55vh]"
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Visit Help Center
            </Link>
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              See features
            </Link>
          </div>
        }
        rightSlot={<ContactFormCard />}
      />

      {/* =========================
          2) VALUE BAND
         ========================= */}
      <SectionValueBand
        title="What to expect when you reach out."
        subtitle="We keep support simple: clear answers, fast iterations, and privacy first handling of your data."
        items={[
          {
            title: "Helpful replies",
            body: "Clear steps, quick links, and straight answers, no back-and-forth if we can avoid it.",
          },
          {
            title: "Fast feedback loop",
            body: "If you report an issue, we'll confirm it, track it, and communicate progress.",
          },
          {
            title: "Privacy-first",
            body: "We only ask for what we need to troubleshoot, and we never share your personal data.",
          },
        ]}
      />

      {/* =========================
          3) FINAL CTA (small)
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Prefer self-serve?
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Start with the Help Center.
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
                Guides and troubleshooting are available anytime — no waiting.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/help"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Go to Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          4) CONTACT DETAILS + FAQ
         ========================= */}
      <SectionFeatures gapClassName="gap-24">
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Ways to reach us
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Pick the channel that fits.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                For most questions, the form is the fastest. If you’re already a
                user, include the email you signed up with.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Help Center:{" "}
                    <Link href="/help" className="underline underline-offset-2">
                      docs + troubleshooting
                    </Link>
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Roadmap:{" "}
                    <Link
                      href="/roadmap"
                      className="underline underline-offset-2"
                    >
                      what we’re building
                    </Link>
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Pricing:{" "}
                    <Link
                      href="/pricing"
                      className="underline underline-offset-2"
                    >
                      plans + limits
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">
                  Support
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Bugs, account questions, or how-to help.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">
                  Feedback
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Feature ideas or UX improvements.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">
                  Partnerships
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Collaboration or community ideas.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">
                  Billing
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Plan limits, upgrades, or pricing questions.
                </p>
              </div>
            </div>
          }
        />
      </SectionFeatures>
    </div>
  );
}
