"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DocumentPlusIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowDownIcon,
  ChartPieIcon,
  GlobeAltIcon,
  HomeIcon,
  InboxIcon,
  InboxStackIcon,
  InformationCircleIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

type Props = { isAdmin: boolean };

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function NavLinksClient({ isAdmin }: Props) {
  const pathname = usePathname();

  // Links for everyone
  const baseLinks: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Recipes", href: "/recipes", icon: DocumentPlusIcon },
    {
      name: "Shopping list",
      href: "/shopping-list",
      icon: ShoppingCartIcon,
    },
    {
      name: "Discover",
      href: "/discover",
      icon: GlobeAltIcon,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: MegaphoneIcon,
    },
    { name: "Account", href: "/account", icon: UserIcon },
    {
      name: "Support",
      href: "/support",
      icon: InformationCircleIcon,
    },
  ];

  // Admin only links
  const adminLinks: NavItem[] = [
    { name: "Metrics", href: "/admin/metrics", icon: ChartPieIcon },
    { name: "User management", href: "/admin/users", icon: UsersIcon },
    {
      name: "Notifications center",
      href: "/admin/notification-center",
      icon: ShieldCheckIcon,
    },
    {
      name: "Support inbox",
      href: "/admin/support",
      icon: InboxIcon,
    },
    {
      name: "Public inbox",
      href: "/admin/contact",
      icon: InboxStackIcon,
    },
  ];

  const renderLink = (link: NavItem) => {
    const LinkIcon = link.icon;
    const active = pathname === link.href;

    return (
      <Link
        key={link.href}
        href={link.href}
        className={clsx(
          "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3",
          active && "bg-sky-100 text-blue-600",
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
