"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/ui/toast/toast-provider";
import { setContactSolved } from "@/app/lib/contact/contact-actions";

export default function ContactInboxMarkSolvedButton({
  id,
  isSolved,
  size = "sm",
}: {
  id: string;
  isSolved: boolean;
  size?: "sm" | "md";
}) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, start] = useTransition();

  const cls = size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        start(async () => {
          const fd = new FormData();
          fd.set("id", id);
          fd.set("solved", String(!isSolved));

          const res = await setContactSolved(fd);

          if (res.ok) {
            push({
              variant: "success",
              title: isSolved ? "Marked unsolved" : "Marked solved",
              message: "Contact message updated.",
            });
            router.refresh();
            return;
          }

          push({
            variant: "error",
            title: "Couldn’t update message",
            message: res.message ?? "Something went wrong.",
          });
        });
      }}
      className={[
        "rounded-md font-medium",
        cls,
        pending ? "opacity-70" : "",
        isSolved
          ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-blue-600 text-white hover:bg-blue-700",
      ].join(" ")}
    >
      {pending ? "Updating..." : isSolved ? "Mark unsolved" : "Mark solved"}
    </button>
  );
}
