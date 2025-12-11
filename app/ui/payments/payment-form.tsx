"use client";

import { inter } from "@/app/ui/branding/branding-fonts";
import {
  CreditCardIcon,
  UserIcon,
  CalendarDaysIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../general/button";
import { processPayment } from "@/app/lib/billing/actions";
// TODO: replace this with your real payment server action
// import { processPayment } from "@/app/lib/billing/actions";

export default function PaymentForm() {
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || "/dashboard/membership";

  // const [errorMessage, formAction, isPending] = useActionState(
  //   processPayment,
  //   undefined
  // );

  return (
    // <form action={formAction} className="space-y-3">
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-md">
        <h1 className={`${inter.className} mb-1 text-2xl`}>
          Add your payment details
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Your card will be used to pay for your RecetApp membership. You can
          update or cancel your plan at any time in Account Settings.
        </p>

        <div className="w-full space-y-4">
          {/* Cardholder name */}
          <div>
            <label
              className="mb-2 block text-xs font-medium text-gray-900"
              htmlFor="cardholderName"
            >
              Cardholder name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="cardholderName"
                type="text"
                name="cardholderName"
                placeholder="Name as it appears on the card"
                autoComplete="cc-name"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Card number */}
          <div>
            <label
              className="mb-2 block text-xs font-medium text-gray-900"
              htmlFor="cardNumber"
            >
              Card number
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="cardNumber"
                type="text"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                required
              />
              <CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Expiration + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-2 block text-xs font-medium text-gray-900"
                htmlFor="expiry"
              >
                Expiration date
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                  id="expiry"
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  required
                />
                <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-medium text-gray-900"
                htmlFor="cvc"
              >
                Security code (CVC)
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                  id="cvc"
                  type="text"
                  name="cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  required
                />
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* <Button className="mt-5 w-full" aria-disabled={isPending}>
          Confirm payment
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button> */}
        <Button className="mt-5 w-full">
          Confirm payment
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Your payment is processed securely. We never display your full card
          number.
        </p>

        <div
          className="mt-3 flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )} */}
        </div>
      </div>
    </form>
  );
}
