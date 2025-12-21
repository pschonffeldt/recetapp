type InfoCardProps = {
  title: string;
  body: string;
  className?: string;
};

export default function InfoCard({
  title,
  body,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
    </div>
  );
}
