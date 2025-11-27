// app/components/UserSettingsFab.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircleIcon,
  PowerIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  PlusIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";

type Props = {
  dashboardleHref?: string;
  profileHref?: string;
  recipesHref?: string;
  notificationsHref?: string;
  shoppinglistHref?: string;

  /** Admin-only routes */
  isAdmin?: boolean;
  adminNotificationHref?: string;
  adminUsersHref?: string;

  logoutAction?: (formData: FormData) => Promise<void>;
  title?: string;
  avatarUrl?: string;
};

export default function UserSettingsFab({
  dashboardleHref = "/dashboard",
  profileHref = "/dashboard/account",
  recipesHref = "/dashboard/recipes",
  notificationsHref = "/dashboard/notifications",
  shoppinglistHref = "/dashboard/shopping-list",

  isAdmin = false,
  adminNotificationHref = "/dashboard/admin/notification-center",
  adminUsersHref = "/dashboard/admin/users",

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
          insetInlineEnd: "max(1.75rem, env(safe-area-inset-right))",
          insetBlockStart: "max(1.3rem, env(safe-area-inset-top))",
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
            {/* Regular user links */}
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
            <MenuItem
              icon={<ShoppingCartIcon className="h-5 w-5" />}
              label="Shopping list"
              onClick={() => go(shoppinglistHref)}
            />
            {/* Divider before logout */}
            <div className="my-2 h-px bg-gray-200/60" />
            <MenuItem
              icon={<MegaphoneIcon className="h-5 w-5" />}
              label="Notifications"
              onClick={() => go(notificationsHref)}
            />
            <MenuItem
              icon={<UserCircleIcon className="h-5 w-5" />}
              label="Account"
              onClick={() => go(profileHref)}
            />
            {/* Divider before admin tools */}
            <div className="my-2 h-px bg-gray-200/60" />
            {/* Admin-only section */}
            {isAdmin && (
              <div>
                <div className="flex flex-row items-center gap-2 mt-4 mb-1 rounded-md bg-blue-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  <ArrowDownIcon className="ml-1 w-3"></ArrowDownIcon>
                  <span>Admin tools</span>
                </div>
                <MenuItem
                  icon={<ShieldCheckIcon className="h-5 w-5" />}
                  label="Notifications center"
                  onClick={() => go(adminNotificationHref)}
                />
                <MenuItem
                  icon={<UsersIcon className="h-5 w-5" />}
                  label="Users management"
                  onClick={() => go(adminUsersHref)}
                />
              </div>
            )}

            {/* Divider before logout */}
            <div className="my-2 h-px bg-gray-200/60" />

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
