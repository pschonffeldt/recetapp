import Link from "next/link";
import type { ReactNode } from "react";

type CardLinkProps = {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode; // optional extra content
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
        "group rounded-md border bg-white p-6 shadow-sm transition",
        "hover:shadow",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className ?? "",
      ].join(" ")}
    >
      <div className="text-base font-semibold group-hover:underline">
        {title}
      </div>

      {description ? (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      ) : null}

      {children}
    </Link>
  );
}
