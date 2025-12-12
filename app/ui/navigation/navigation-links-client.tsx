"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import {
  ArrowDownIcon,
  GlobeAltIcon,
  HomeIcon,
  InformationCircleIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
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
    {
      name: "Shopping list",
      href: "/dashboard/shopping-list",
      icon: ShoppingCartIcon,
    },
    {
      name: "Discover",
      href: "/dashboard/discover",
      icon: GlobeAltIcon,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: MegaphoneIcon,
    },
    { name: "Account", href: "/dashboard/account", icon: UserIcon },
    { name: "Help", href: "/dashboard/help", icon: InformationCircleIcon },
  ];

  const adminLinks: NavItem[] = [
    {
      name: "New notification",
      href: "/dashboard/admin/notification-center",
      icon: ShieldCheckIcon,
    },
    { name: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
  ];

  const renderLink = (link: NavItem) => {
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
  };

  return (
    <>
      {/* Regular user links */}
      {baseLinks.map(renderLink)}

      {/* Admin section */}
      {isAdmin && (
        <>
          <div className="flex flex-row items-center gap-2 mt-4 mb-1 rounded-md bg-blue-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <ArrowDownIcon className="w-3"></ArrowDownIcon>
            <p>Admin tools</p>
          </div>

          {adminLinks.map(renderLink)}
        </>
      )}
    </>
  );
}
