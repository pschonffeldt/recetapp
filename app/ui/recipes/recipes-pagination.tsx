"use client";

import { generatePagination } from "@/app/lib/utils/format";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage: currentPageProp, // optional: allow parent to pass a clamped page
}: {
  totalPages: number;
  currentPage?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hide pager when it's pointless (must be AFTER hooks)
  if (totalPages <= 1) return null;

  const clamp = (n: number) =>
    Math.min(Math.max(1, n), Math.max(1, totalPages));

  // If parent gave us the safe page, use it. Otherwise read from URL and clamp.
  const urlPage = Number(searchParams.get("page")) || 1;
  const currentPage = clamp(currentPageProp ?? urlPage);

  // Build a URL for a given page, preserving other query params
  const createPageURL = (pageNumber: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(clamp(pageNumber))); // never build invalid links
    return `${pathname}?${next.toString()}`;
  };

  // Always generate around the *safe* page
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="inline-flex pb-10">
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
    </nav>
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

  const title =
    position === "middle"
      ? ""
      : isActive
      ? `Page ${page} (current)`
      : `Go to page ${page}`;

  if (isActive) {
    return (
      <div className={className} aria-current="page" title={title}>
        {page}
      </div>
    );
  }
  if (position === "middle") {
    return (
      <div className={className} aria-hidden="true" role="presentation">
        {page}
      </div>
    );
  }

  return (
    <Link href={href} className={className} title={title} aria-label={title}>
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

  const label = direction === "left" ? "Previous page" : "Next page";
  const rel = direction === "left" ? "prev" : "next";

  return isDisabled ? (
    <div
      className={className}
      aria-disabled="true"
      aria-label={label}
      title={label}
    >
      {icon}
    </div>
  ) : (
    <Link
      className={className}
      href={href}
      aria-label={label}
      title={label}
      rel={rel}
    >
      {icon}
    </Link>
  );
}
