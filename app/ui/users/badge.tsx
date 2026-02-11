import clsx from "clsx";

export function Badge({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BadgeMuted({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="border-gray-200 bg-gray-50 text-gray-500 font-normal">
      {children}
    </Badge>
  );
}
