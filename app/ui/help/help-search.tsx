import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

export default function HelpSearch({
  action,
  defaultValue,
}: {
  action: string; // "/help" or `/help/${category}`
  defaultValue?: string;
}) {
  return (
    <form action={action} method="GET" className="w-full">
      <div className="relative">
        <input
          name="q"
          defaultValue={defaultValue ?? ""}
          placeholder="How can we help?"
          className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MagnifyingGlassCircleIcon className="h-5 w-5" />
        </div>
      </div>
    </form>
  );
}
