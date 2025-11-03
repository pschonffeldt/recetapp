"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage: currentPageProp, // optional: allow parent to pass a clamped page
}: {
  totalPages: number;
  currentPage?: number;
}) {
  // Hide pager when it's pointless
  if (totalPages <= 1) return null;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clamp = (n: number) =>
    Math.min(Math.max(1, n), Math.max(1, totalPages));

  // If parent gave us the safe page, use it. Otherwise read from URL and clamp.
  const urlPage = Number(searchParams.get("page")) || 1;
  const currentPage = clamp(currentPageProp ?? urlPage);

  const createPageURL = (pageNumber: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(clamp(pageNumber))); // never build invalid links
    return `${pathname}?${next.toString()}`;
  };

  // Always generate around the *safe* page
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          const isEllipsis = page === "...";
          let position: "first" | "last" | "single" | "middle" | undefined;
          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (isEllipsis) position = "middle";

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              page={page}
              position={position}
              isActive={currentPage === page}
              // never link ellipsis; clamp all numeric targets
              href={!isEllipsis ? createPageURL(page as number) : ""}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-blue-600 border-blue-600 text-white": isActive,
      "hover:bg-gray-100": !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    }
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
