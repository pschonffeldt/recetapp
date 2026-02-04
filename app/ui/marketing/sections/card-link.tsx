import Link from "next/link";
import type { ReactNode } from "react";

type CardLinkProps = {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function CardLink({
  href,
  title,
  description,
  className,
  children,
}: CardLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "group flex h-full flex-col",
        "rounded-md border bg-white p-6 shadow-sm transition",
        "hover:shadow-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className ?? "",
      ].join(" ")}
    >
      {/* Title */}
      <div
        className={[
          "text-base font-semibold tracking-tight text-gray-900",
          "leading-6",
          "line-clamp-2", // allow up to 2 lines
          "min-h-[3rem]", // 2 lines * 1.5rem line-height = 3rem
          "group-hover:underline",
        ].join(" ")}
      >
        {title}
      </div>

      {/* Description */}
      {description ? (
        <p
          className={[
            "mt-2 text-sm leading-5 text-gray-600",
            "line-clamp-2",
            "sm:line-clamp-3",
            "flex-1",
          ].join(" ")}
        >
          {description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      {children ? <div className="mt-4">{children}</div> : null}
    </Link>
  );
}
