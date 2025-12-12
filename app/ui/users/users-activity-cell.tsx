import { formatDateToLocal } from "@/app/lib/utils/format";

export default function ActivityCell({
  updated_at,
  password_changed_at,
  last_login_at,
}: {
  updated_at: string | null;
  password_changed_at: string | null;
  last_login_at: string | null;
}) {
  return (
    <div className="flex flex-col text-xs text-gray-500">
      <span>
        Profile updated: {updated_at ? formatDateToLocal(updated_at) : "—"}
      </span>
      <span>
        Password updated:{" "}
        {password_changed_at ? formatDateToLocal(password_changed_at) : "—"}
      </span>
      <span>
        Last login: {last_login_at ? formatDateToLocal(last_login_at) : "—"}
      </span>
    </div>
  );
}
