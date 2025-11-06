// app/components/UserSettingsFab.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, PlusIcon } from "@heroicons/react/20/solid";

type Props = {
  /** Routes to navigate with router.push */
  dashboardleHref?: string;
  profileHref?: string;
  recipesHref?: string;

  /**
   * Server Action for Auth.js/NextAuth v5 logout.
   * Must be passed from a SERVER component and used directly on <form action={...}>.
   */
  logoutAction?: (formData: FormData) => Promise<void>;

  title?: string;
  /** Optional avatar URL; if omitted, shows an icon */
  avatarUrl?: string;
};

export default function UserSettingsFab({
  dashboardleHref = "/dashboard",
  profileHref = "/dashboard/account",
  recipesHref = "/dashboard/recipes",
  logoutAction,
  title = "User menu",
  avatarUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close on outside click / Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href?: string) => {
    if (!href) return;
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Floating circle button */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-settings-popover"
        title={title}
        onClick={() => setOpen((v) => !v)}
        className={[
          "fixed z-50 inline-flex items-center justify-center",
          "h-11 w-11 rounded-full",
          "shadow-lg ring-1 ring-black/10",
          "bg-white text-gray-700 hover:bg-gray-50",
          "transition-transform",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
        ].join(" ")}
        style={{
          insetInlineEnd: "max(0.75rem, env(safe-area-inset-right))",
          insetBlockStart: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="User avatar"
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
        )}
        <span className="sr-only">{title}</span>
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popRef}
          id="user-settings-popover"
          role="menu"
          className={[
            "fixed z-[60] mt-2 w-56 origin-top-right rounded-xl",
            "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70",
            "shadow-xl ring-1 ring-black/10",
          ].join(" ")}
          style={{
            insetInlineEnd: "max(0.75rem, env(safe-area-inset-right))",
            insetBlockStart:
              "calc(max(0.75rem, env(safe-area-inset-top)) + 3rem)",
          }}
        >
          <div className="p-2">
            <MenuItem
              icon={<ChartBarIcon className="h-5 w-5" />}
              label="Dashboard"
              onClick={() => go(dashboardleHref)}
            />
            <MenuItem
              icon={<PlusIcon className="h-5 w-5" />}
              label="Recipes"
              onClick={() => go(recipesHref)}
            />
            <div className="my-1 h-px bg-gray-200/60 " />
            <MenuItem
              icon={<UserCircleIcon className="h-5 w-5" />}
              label="Profile"
              onClick={() => go(profileHref)}
            />

            <div className="my-1 h-px bg-gray-200/60 " />

            {logoutAction ? (
              // Attach the server action DIRECTLY to the form
              <form action={logoutAction} onSubmit={() => setOpen(false)}>
                <button
                  type="submit"
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
                    "text-red-600 hover:bg-gray-100 active:bg-gray-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  ].join(" ")}
                >
                  <span className="shrink-0">
                    <PowerIcon className="h-5 w-5" />
                  </span>
                  <span className="truncate">Log out</span>
                </button>
              </form>
            ) : (
              // Fallback if no server action provided
              <MenuItem
                icon={<PowerIcon className="h-5 w-5" />}
                label="Log out"
                variant="danger"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/login";
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
        "hover:bg-gray-100 active:bg-gray-200",
        variant === "danger" ? "text-red-600 " : "text-gray-700 ",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
      ].join(" ")}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
