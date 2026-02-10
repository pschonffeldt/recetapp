import { inter } from "@/app/ui/branding/branding-fonts";
import clsx from "clsx";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string; // optional now
  active?: boolean;
  clickable?: boolean; // default: true
}

export default function Breadcrumbs({
  breadcrumbs,
  className,
  navClassName,
}: {
  breadcrumbs: Breadcrumb[];
  className?: string; // applies to the <ol>
  navClassName?: string; // optional: applies to the <nav>
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx("mb-6 block pl-6 lg:pl-0", navClassName)}
    >
      <ol
        className={clsx(
          inter.className,
          "flex flex-wrap items-start gap-x-2 gap-y-1 text-lg md:text-2xl",
          className,
        )}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isClickable =
            breadcrumb.clickable !== false && !!breadcrumb.href;

          // Prefer a stable key even if href is missing
          const key = breadcrumb.href ?? `${breadcrumb.label}-${index}`;

          return (
            <li
              key={key}
              aria-current={breadcrumb.active ? "page" : undefined}
              className={clsx(
                "flex items-start gap-x-2",
                breadcrumb.active ? "text-gray-900" : "text-gray-500",
                isLast ? "min-w-0 flex-1" : "shrink-0",
              )}
            >
              {breadcrumb.active ? (
                <span className="min-w-0 line-clamp-2 break-words">
                  {breadcrumb.label}
                </span>
              ) : isClickable ? (
                <Link
                  href={breadcrumb.href!}
                  className="hover:text-gray-900 hover:underline"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-gray-500">{breadcrumb.label}</span>
              )}

              {!isLast ? (
                <span className="text-gray-400" aria-hidden>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
