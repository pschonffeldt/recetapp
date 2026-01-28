import { AppMock } from "@/app/lib/marketing/helpers";
import InfoCard from "@/app/ui/marketing/sections/infocards";
import SoftDot from "@/app/ui/marketing/sections/soft-dot";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import Link from "next/link";

export const metadata = { title: "Terms • RecetApp" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Terms"
        title="Clear rules, calm cooking."
        description="These Terms explain how RecetApp works, what you can expect from us, and what we expect from you. They’re written to be understandable — not intimidating."
        minHeightClass="lg:min-h-[55vh]"
        backgroundVariant="about"
        rightSlot={<AppMock label="RecetApp — terms overview" />}
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
            >
              Get started free
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Read Privacy
            </Link>
          </div>
        }
      />

      {/* =========================
          2) Principles
         ========================= */}
      <SectionValueBand
        title="A few simple principles."
        subtitle="RecetApp is built to be helpful and respectful. These terms exist to protect both you and the service."
        items={[
          {
            title: "You own your content",
            body: "Your recipes and notes belong to you. We only need permission to store and display them for the service.",
          },
          {
            title: "Use it responsibly",
            body: "No abuse, no breaking the law, no trying to disrupt the platform for others.",
          },
          {
            title: "We keep improving",
            body: "We’ll evolve RecetApp over time, and we’ll communicate meaningful changes.",
          },
        ]}
      />

      {/* =========================
          3) Terms content
         ========================= */}
      <SectionFeatures gapClassName="gap-28">
        {/* 3.1 Acceptance + eligibility */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Agreement
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Using RecetApp means you agree to these Terms.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                By accessing or using RecetApp, you agree to follow these Terms.
                If you don’t agree, please don’t use the service.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Eligibility:</strong> You must be allowed to use the
                    service under applicable laws.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Updates:</strong> We may update these Terms as the
                    product evolves (see “Changes” below).
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Plain language"
                body="These terms are meant to be readable and practical."
              />
              <InfoCard
                title="Applies to the service"
                body="Covers the website, app, and related RecetApp services."
              />
              <InfoCard
                title="Changes happen"
                body="We’ll update terms as the product grows."
              />
              <InfoCard
                title="Questions welcome"
                body="If anything is unclear, reach out and we’ll explain."
              />
            </div>
          }
        />

        {/* 3.2 Accounts */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Accounts
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                You’re responsible for your account.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                You’re responsible for activity under your account and for
                keeping your login credentials safe.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>Keep your login details confidential.</span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>Notify us if you suspect unauthorized access.</span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    You may not use the service to impersonate someone else.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Account security"
                body="Choose a strong password and keep it private."
              />
              <InfoCard
                title="Respect others"
                body="No impersonation or misuse of identities."
              />
              <InfoCard
                title="We can help"
                body="If something looks wrong, contact support."
              />
              <InfoCard
                title="Fair access"
                body="Avoid automated actions that overload the system."
              />
            </div>
          }
        />

        {/* 3.3 Your content + license */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Your content
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                You own what you create.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                Your recipes, notes, and other content you add to RecetApp
                remain yours. To operate RecetApp, you give us permission to
                host, store, and display your content within the service.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Ownership:</strong> You keep all rights to your
                    content.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>License to operate:</strong> You grant RecetApp a
                    limited license to store and process your content solely to
                    provide the service.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Responsibility:</strong> You’re responsible for the
                    content you upload and share.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Your recipes stay yours"
                body="We don’t claim ownership over your personal cooking content."
              />
              <InfoCard
                title="Limited license"
                body="We only use your content to run the app and its features."
              />
              <InfoCard
                title="Sharing is optional"
                body="If you share content, you control what you share."
              />
              <InfoCard
                title="Remove anytime"
                body="Deleting content removes it from your account (backups may persist briefly)."
              />
            </div>
          }
        />

        {/* 3.4 Acceptable use */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Acceptable use
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Please don’t misuse the platform.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                RecetApp is for personal cooking organization and related
                workflows. Don’t use it in ways that harm others, violate laws,
                or disrupt the service.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    No illegal activity, harassment, or abusive behavior.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    No attempting to access accounts, systems, or data you don’t
                    own.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    No automated scraping, reverse engineering, or disruption of
                    the service.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    No uploading content you don’t have the rights to use.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Be respectful"
                body="Use RecetApp in a way that’s safe for others."
              />
              <InfoCard
                title="No attacks"
                body="Don’t probe, hack, or disrupt the platform."
              />
              <InfoCard
                title="No scraping"
                body="Avoid automated extraction of data or content."
              />
              <InfoCard
                title="Rightful content only"
                body="Only upload content you own or are allowed to use."
              />
            </div>
          }
        />

        {/* 3.5 Service availability + disclaimers */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Service & reliability
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                The service is provided “as is.”
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                We aim to keep RecetApp available and reliable, but we can’t
                guarantee uninterrupted access. Features may change as we
                improve the product.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    We may add, remove, or modify features to improve the
                    service.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    You’re responsible for how you use RecetApp and any outcomes
                    from that use.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    To the extent permitted by law, RecetApp is not liable for
                    indirect damages or losses.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Best effort uptime"
                body="We try hard, but no app can promise 100% uptime."
              />
              <InfoCard
                title="Product evolves"
                body="We’ll improve things over time — and sometimes that means changes."
              />
              <InfoCard
                title="Use with judgment"
                body="RecetApp helps you organize cooking — you decide how to apply it."
              />
              <InfoCard
                title="Limits of liability"
                body="Standard protections apply to keep the service sustainable."
              />
            </div>
          }
        />

        {/* 3.6 Termination + payments (future-proof) + changes + contact */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Changes, termination & contact
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                We keep things fair — and we need some safeguards.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                You can stop using RecetApp at any time. We may suspend or
                terminate accounts that violate these Terms or create risk for
                others or the service.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Termination:</strong> You may delete your account or
                    request deletion. We may terminate for violations or
                    security reasons.
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Paid plans (if applicable):</strong> If RecetApp
                    offers paid features, pricing and billing terms will be
                    presented at purchase.
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Changes:</strong> We may update these Terms. The
                    “Last updated” date will reflect the latest version.
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Contact:</strong> info@mitkof.cl
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/help"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Help Center
                </Link>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Leave anytime"
                body="You can stop using RecetApp whenever you want."
              />
              <InfoCard
                title="We protect the platform"
                body="We may suspend accounts that abuse the service or violate rules."
              />
              <InfoCard
                title="Purchases are clear"
                body="If paid features exist, details will be shown at checkout."
              />
              <InfoCard
                title="Policy updates"
                body="We’ll keep the last updated date visible and changes understandable."
              />
            </div>
          }
        />
      </SectionFeatures>
    </div>
  );
}
