import { clsx } from "clsx";
import Link from "next/link";
import { inter } from "@/app/ui/branding/branding-fonts";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
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
      className={clsx("mb-6 pl-6 block lg:pl-0", navClassName)}
    >
      <ol
        className={clsx(
          inter.className,
          "flex flex-wrap items-start gap-x-2 gap-y-1 text-lg md:text-2xl",
          className
        )}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={breadcrumb.href}
              aria-current={breadcrumb.active ? "page" : undefined}
              className={clsx(
                "flex items-start gap-x-2",
                breadcrumb.active ? "text-gray-900" : "text-gray-500",
                isLast ? "min-w-0 flex-1" : "shrink-0"
              )}
            >
              {breadcrumb.active ? (
                <span className="min-w-0 line-clamp-2 break-words">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="hover:text-gray-900 hover:underline"
                >
                  {breadcrumb.label}
                </Link>
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
