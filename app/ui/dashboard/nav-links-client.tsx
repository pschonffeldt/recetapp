"use client";

import { HomeIcon, MegaphoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { DocumentPlusIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = { isAdmin: boolean };

export default function NavLinksClient({ isAdmin }: Props) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Recipes", href: "/dashboard/recipes", icon: DocumentPlusIcon },
    { name: "Account", href: "/dashboard/account", icon: UserIcon },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: MegaphoneIcon,
    },
  ];

  // Add admin-only entry
  if (isAdmin) {
    links.push({
      name: "New notification",
      href: "/dashboard/notifications/new",
      icon: ShieldCheckIcon,
    });
  }

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3",
              active && "bg-sky-100 text-blue-600"
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
