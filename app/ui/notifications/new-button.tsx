import Link from "next/link";
import { canManageNotifications } from "@/app/lib/auth-helpers";

export default async function NewNotificationButton() {
  const allowed = await canManageNotifications(); // returns boolean
  if (!allowed) return null;

  return (
    <Link
      href="/dashboard/notifications/new"
      className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black/80"
    >
      New notification
    </Link>
  );
}
