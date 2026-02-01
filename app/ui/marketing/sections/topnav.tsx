"use client";

import { APP } from "@/app/lib/utils/app";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function MarketingTopNavBar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close on click outside (panel)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Prevent body scroll when open (mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {APP.legalName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-start justify-start gap-6 text-base text-gray-700 md:flex">
          <Link href="/" className="hover:text-gray-900 hover:underline">
            Home
          </Link>
          <Link
            href="/features"
            className="hover:text-gray-900 hover:underline"
          >
            Features
          </Link>
          <Link href="/pricing" className="hover:text-gray-900 hover:underline">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-gray-900 hover:underline">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop login */}
          <Link
            href="/login"
            className="hidden text-base text-gray-700 hover:text-gray-900 hover:underline md:inline-block"
          >
            Log in
          </Link>

          {/* CTA always visible */}
          <Link
            href="/signup"
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            Get started
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="marketing-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay + panel (PORTAL to body so it covers the entire site) */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="md:hidden">
            {/* Full-screen overlay */}
            <div
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
              onClick={close}
              aria-hidden="true"
            />

            {/* Panel */}
            <div
              id="marketing-mobile-menu"
              ref={panelRef}
              className="fixed inset-x-0 top-0 z-[100] border-b bg-white"
            >
              {/* Optional: keep the top bar area consistent */}
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                <span className="text-base font-semibold tracking-tight">
                  ${APP.legalName}
                </span>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="mx-auto max-w-6xl px-4 pb-5 md:px-6">
                <div className="mt-2 border-t pt-3"></div>
                <nav className="grid gap-2 text-base text-gray-800">
                  <Link
                    href="/"
                    onClick={close}
                    className="rounded-lg px-2 py-3 hover:bg-blue-50"
                  >
                    Home
                  </Link>
                  <Link
                    href="/features"
                    onClick={close}
                    className="rounded-lg px-2 py-3 hover:bg-blue-50"
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={close}
                    className="rounded-lg px-2 py-3 hover:bg-blue-50"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    onClick={close}
                    className="rounded-lg px-2 py-3 hover:bg-blue-50"
                  >
                    About
                  </Link>

                  <div className="mt-2 border-t pt-3">
                    <Link
                      href="/login"
                      onClick={close}
                      className="block rounded-lg px-2 py-3 text-gray-700 hover:bg-blue-50"
                    >
                      Log in
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
