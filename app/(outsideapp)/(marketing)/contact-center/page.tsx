import Link from "next/link";
import { SectionHeroBackground } from "@/app/ui/marketing/sections/section-hero-background";
import { ContactFormCard } from "@/app/ui/marketing/sections/contact-form-card";

export const metadata = { title: "Contact Center • RecetApp" };

export default function ContactCenterPage() {
  return (
    <div className="bg-white">
      <section className="pb-20 relative overflow-hidden bg-white">
        {/* Subtle background only */}
        <SectionHeroBackground variant="features" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          {/* Compact top bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Contact Center
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Send a message
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/help"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Help Center
              </Link>
              <Link
                href="/features"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Features
              </Link>
              <Link
                href="/privacy"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left: quick info */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Before you send
                  </h2>
                </div>

                <div className="mt-4 space-y-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold text-gray-900">Best for</div>
                    <p className="mt-1">
                      Support questions, feedback, bug reports, and general
                      inquiries.
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900">
                      For faster support
                    </div>
                    <p className="mt-1">
                      Include what you were trying to do + what happened.
                      Screenshots help (add as URL).
                    </p>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900">Privacy</div>
                    <p className="mt-1">
                      Don&apos;t include passwords or sensitive personal info.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: the form */}
            <div className="lg:col-span-7">
              <ContactFormCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
