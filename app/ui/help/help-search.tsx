import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function HelpSearch({
  action,
  defaultValue,
}: {
  action: string;
  defaultValue?: string;
}) {
  return (
    <form action={action} method="GET" className="relative w-full">
      <input
        name="q"
        defaultValue={defaultValue ?? ""}
        placeholder="How can we help?"
        className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 pr-10 text-sm shadow-sm outline-none
                   text-gray-900 caret-gray-900
                   placeholder:text-gray-400
                   focus:ring-2 focus:ring-white/50"
        aria-label="Search help articles"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
