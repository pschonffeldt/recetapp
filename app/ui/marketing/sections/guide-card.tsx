import Image from "next/image";
import Link from "next/link";

type GuideCardImage = {
  src: string;
  alt: string;
  priority?: boolean;
};

type GuideCardProps = {
  type: string;
  title: string;
  body: string;
  href: string;
  image?: GuideCardImage;
  imageSlot?: React.ReactNode;
  className?: string;
};

export function GuideCard({
  type,
  title,
  body,
  href,
  image,
  imageSlot,
  className,
}: GuideCardProps) {
  return (
    <Link
      href={href}
      className={[
        "group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className ?? "",
      ].join(" ")}
    >
      {/* Image header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {imageSlot ? (
          imageSlot
        ) : image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
              priority={image.priority ?? false}
            />
            {/* subtle polish overlay (optional but nice) */}
            {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" /> */}
          </>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-7">
        <div className="text-sm text-gray-600">{type}</div>

        <div className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-gray-900">
          {title}
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Read more
          </span>
          <span className="text-blue-600 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
