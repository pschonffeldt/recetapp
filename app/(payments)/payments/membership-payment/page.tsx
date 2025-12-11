import Logo from "@/app/ui/branding/branding-recetapp-logo";
import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentForm from "@/app/ui/payments/payment-form";
import type { MembershipTier } from "@/app/lib/types/definitions";
import {
  PLAN_LIMITS,
  PLAN_LABEL,
  PLAN_PRICING,
  isMembershipTier,
} from "@/app/lib/membership/plans";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;

  // Fallbacks in case someone hits this URL manually
  const currentTier: MembershipTier = isMembershipTier(from) ? from : "free";
  const targetTier: MembershipTier = isMembershipTier(to) ? to : currentTier;

  const currentLabel = PLAN_LABEL[currentTier];
  const currentLimit = PLAN_LIMITS[currentTier];

  const targetLabel = PLAN_LABEL[targetTier];
  const targetLimit = PLAN_LIMITS[targetTier];
  const targetPrice = PLAN_PRICING[targetTier];

  const isUpgrade = targetTier !== currentTier;

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>

        {/* Upgrade summary */}
        <div className="rounded-md bg-white p-4 text-sm text-gray-800 shadow-sm">
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
            {isUpgrade ? "Plan upgrade" : "Membership payment"}
          </p>

          {isUpgrade ? (
            <p className="mb-2">
              You&apos;re upgrading from{" "}
              <span className="font-semibold">
                {currentLabel} (up to {currentLimit} recipes)
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {targetLabel} (up to {targetLimit} recipes)
              </span>
              .
            </p>
          ) : (
            <p className="mb-2">
              You are paying for{" "}
              <span className="font-semibold">
                {targetLabel} (up to {targetLimit} recipes)
              </span>
              .
            </p>
          )}

          <p className="mb-1">
            <span className="font-medium">Price: </span>
            {targetPrice}
          </p>

          <p className="text-xs text-gray-500">
            This is the plan that will be activated once your payment is
            successfully processed.
          </p>
        </div>

        {/* Actual payment form */}
        <Suspense>
          <PaymentForm />
        </Suspense>
      </div>
    </main>
  );
}
