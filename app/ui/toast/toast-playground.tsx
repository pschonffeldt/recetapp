"use client";

import { useEffect } from "react";
import { Button } from "@/app/ui/button";
import { useToast } from "@/app/ui/toast/toast-provider";

export default function ToastPlayground() {
  const { push, confirm } = useToast();

  // Seed a full set on first mount
  useEffect(() => {
    demoAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demoAll = () => {
    push({ variant: "success", title: "Success", message: "Recipe saved." });
    push({
      variant: "info",
      title: "Info",
      message: "Background sync started.",
    });
    push({ variant: "warning", title: "Warning", message: "Unsaved changes." });
    push({
      variant: "error",
      title: "Error",
      message: "Couldn’t reach the server.",
    });
    push({
      variant: "neutral",
      title: "Neutral",
      message: "Plain notification with default styling.",
    });

    // demo with custom actions
    const id = push({
      variant: "info",
      title: "With actions",
      message: "You can attach custom buttons.",
      actions: [
        {
          label: "Primary",
          variant: "primary",
          onClick: () =>
            push({ variant: "success", message: "Primary clicked" }),
        },
        {
          label: "Secondary",
          variant: "secondary",
          onClick: () =>
            push({ variant: "neutral", message: "Secondary clicked" }),
        },
      ],
    });

    // you could also dismiss using dismiss(id) if you want
  };

  const demoConfirm = async () => {
    const ok = await confirm({
      title: "Delete recipe?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (ok) {
      push({ variant: "success", message: "Confirmed ✅" });
    } else {
      push({ variant: "neutral", message: "Cancelled" });
    }
  };

  const demoPasswordUpdated = () => {
    push({
      variant: "success",
      title: "Password updated",
      message: "Your password was changed successfully.",
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Toast playground</h2>
      <p className="text-sm text-gray-600">
        This page spawns all variants on mount. Use the buttons to trigger again
        while you edit toast code.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={demoAll}>
          Spawn all
        </Button>
        <Button type="button" onClick={demoConfirm}>
          Show confirm
        </Button>
        <Button type="button" onClick={demoPasswordUpdated}>
          Password updated
        </Button>
      </div>
    </section>
  );
}
