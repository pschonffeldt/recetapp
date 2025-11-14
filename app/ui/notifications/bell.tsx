import Link from "next/link";
import { fetchUnreadCount } from "@/app/lib/data";

export default async function Bell() {
  const unread = await fetchUnreadCount();

  return (
    <Link href="/dashboard/notifications" className="relative inline-block">
      {/* Simple bell icon (swap for lucide if you want) */}
      <span className="inline-block h-6 w-6">🔔</span>
      {unread > 0 && (
        <span className="absolute -right-2 -top-1 rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
          {unread}
        </span>
      )}
    </Link>
  );
}
