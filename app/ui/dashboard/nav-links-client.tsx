"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { HomeIcon, MegaphoneIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  DocumentPlusIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";

type Props = { isAdmin: boolean };

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function NavLinksClient({ isAdmin }: Props) {
  const pathname = usePathname();

  const baseLinks: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Recipes", href: "/dashboard/recipes", icon: DocumentPlusIcon },
    { name: "Account", href: "/dashboard/account", icon: UserIcon },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: MegaphoneIcon,
    },
  ];

  // Add as many admin-only links as you want here
  const adminLinks: NavItem[] = [
    {
      name: "New notification",
      href: "/dashboard/admin/notification-center",
      icon: ShieldCheckIcon,
    },
    { name: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
    // { name: "System",        href: "/dashboard/admin/system",       icon: Cog6ToothIcon },
  ];

  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

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
