"use client";

import { HomeIcon, UserIcon, WrenchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DocumentPlusIcon } from "@heroicons/react/20/solid";

// Map of links to display in the side navigation.
const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Recipes", href: "/dashboard/recipes", icon: DocumentPlusIcon },
  { name: "Account", href: "/dashboard/account", icon: UserIcon },
  // { name: "Settings", href: "/dashboard/settings", icon: WrenchIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            // Highlight active link with clsx and usePathname
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3",
              // Detecting the pathname itself and giving it a special color
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            {/* <p className="hidden md:block">{link.name}</p> */}
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
