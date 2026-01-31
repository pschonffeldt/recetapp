import { AppMock } from "@/app/lib/marketing/helpers";
import { APP } from "@/app/lib/utils/app";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import InfoCard from "@/app/ui/marketing/sections/infocards";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import SoftDot from "@/app/ui/marketing/sections/soft-dot";
import Link from "next/link";

export const metadata = {
  title: `Privacy`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Privacy"
        title="Your recipes are yours."
        description={`We collect the minimum data needed to run ${APP.legalName}, keep your account secure, and improve the product. We don’t sell your personal information, and we keep things clear and simple.`}
        minHeightClass="lg:min-h-[55vh]"
        backgroundVariant="about"
        rightSlot={
          <AppMock
            label={`${APP.legalName} — dashboard preview`}
            imageSrc="/images/homepage/home-dashboard.webp"
            imageAlt={`${APP.legalName} dashboard preview`}
            priority
            fit="contain"
            aspectClassName="aspect-[16/9]"
            innerPaddingClassName="p-4"
          />
        }
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/terms"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
            >
              Read Terms
            </Link>
            <Link
              href="/help"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Visit Help Center
            </Link>
          </div>
        }
      />

      {/* =========================
          2) Principles
         ========================= */}
      <SectionValueBand
        title="Privacy, without the fine print vibe."
        subtitle="This policy is written in plain language. If something is unclear, contact us and we’ll explain it."
        items={[
          {
            title: "Minimal",
            body: `We only collect what we need to run ${APP.legalName} and keep it reliable.`,
          },
          {
            title: "Transparent",
            body: "We explain what we collect, why, and how it's used.",
          },
          {
            title: "In control",
            body: "You can access, update, and delete your account and data.",
          },
        ]}
      />

      {/* =========================
          3) Privacy Policy content
         ========================= */}
      <SectionFeatures gapClassName="gap-28">
        {/* 3.1 What we collect */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                What we collect
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                The basics to make the app work.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                {APP.legalName} collects information you provide and some
                standard technical data that helps us keep the service secure
                and running smoothly.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Account info:</strong> like your email address and
                    login details (passwords are stored securely, not in plain
                    text).
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Your content:</strong> recipes, ingredients, notes,
                    categories, and other things you save in {APP.legalName}.
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Usage & diagnostics:</strong> basic logs (e.g.
                    performance, errors) to help us fix bugs and improve the
                    app.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="No selling data"
                body="We do not sell your personal information. Period."
              />
              <InfoCard
                title="Private by default"
                body="Your recipes are private unless you choose to share them."
              />
              <InfoCard
                title="Normal technical logs"
                body="We collect basic logs to keep the site stable and secure."
              />
              <InfoCard
                title="You control your data"
                body="You can update or delete your account and content."
              />
            </div>
          }
        />

        {/* 3.2 How we use it */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                How we use your info
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                To run {APP.legalName}, improve it, and support you.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                We use your information to deliver core features (like saving
                recipes), keep your account safe, and make the experience better
                over time.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    Provide the service (create, store, and show your recipes).
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    Maintain security, prevent abuse, and troubleshoot issues.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    Improve features and performance (based on real usage
                    patterns).
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    Communicate with you about important account or product
                    updates.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Product improvements"
                body="We use aggregated usage signals to prioritize what to build next."
              />
              <InfoCard
                title="Security & reliability"
                body="Logs help us detect crashes, abuse, and performance issues."
              />
              <InfoCard
                title="Support"
                body="If you reach out, we use info you provide to help resolve issues."
              />
              <InfoCard
                title="No ads profile"
                body="We don't build advertising profiles about you."
              />
            </div>
          }
        />

        {/* 3.3 Sharing & third parties */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Sharing & third parties
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                We share data only to operate the service.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                {APP.legalName} relies on trusted service providers (for things
                like hosting and databases). They process data only as needed to
                run {APP.legalName}.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Service providers:</strong> hosting, databases, and
                    operational tools that keep the app working.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Legal requests:</strong> we may disclose information
                    if required by law or to protect {APP.legalName} and users.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Business changes:</strong> if {APP.legalName}{" "}
                    changes hands, data may be transferred as part of that
                    transaction.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="No selling"
                body="We do not sell personal information to third parties."
              />
              <InfoCard
                title="Operational only"
                body="Providers only get what they need to do their job."
              />
              <InfoCard
                title="Legal compliance"
                body="We comply with valid legal requests when required."
              />
              <InfoCard
                title="If things change"
                body="If ownership changes, we'll handle data responsibly."
              />
            </div>
          }
        />

        {/* 3.4 Security, retention, rights */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Security & your rights
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Practical security, clear control.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                We take reasonable steps to protect your information and give
                you control over your account. No system is perfect, but we aim
                to be careful and intentional.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Security:</strong> we use standard safeguards and
                    secure storage practices.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Retention:</strong> we keep data while your account
                    is active. Deleted accounts are removed, and some data may
                    persist temporarily in backups.
                  </span>
                </div>
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Your rights:</strong> you can request access,
                    correction, or deletion of your data.
                  </span>
                </div>
              </div>
            </div>
          }
          media={
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Delete your account"
                body="You can request account deletion and removal of associated content."
              />
              <InfoCard
                title="Backups exist"
                body="Backups may retain data briefly to ensure recovery and reliability."
              />
              <InfoCard
                title="Reasonable safeguards"
                body="We use standard security practices to reduce risk."
              />
              <InfoCard
                title="Talk to us"
                body="If something feels unclear, contact us and we'll help."
              />
            </div>
          }
        />

        {/* 3.5 Changes + contact */}
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Updates & contact
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                We’ll keep this policy up to date.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                As {APP.legalName} evolves, we may update this Privacy Policy.
                When we do, we&apos;ll update the “Last updated” date and, if
                changes are significant, we&apos;ll provide a clear notice.
              </p>

              <div className="mt-8 space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Last updated:</strong> Jan 27, 2026.
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    <strong>Contact:</strong> info@mitkof.cl
                  </span>
                </div>

                <div className="flex gap-3">
                  <SoftDot />
                  <span>
                    Prefer a simpler answer? The Help Center is a good place to
                    start.
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/terms"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Terms of Service
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
                title="Plain-language policy"
                body="We write policies to be read, not to hide behind."
              />
              <InfoCard
                title="Change notices"
                body="If changes are significant, we'll make it clear."
              />
              <InfoCard
                title="Support-first"
                body="If you have questions, we want you to reach out."
              />
              <InfoCard
                title="Built in public"
                body={`${APP.legalName} evolves transparently with a public roadmap and releases.`}
              />
            </div>
          }
        />
      </SectionFeatures>
    </div>
  );
}
