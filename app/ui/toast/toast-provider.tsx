"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type ToastAction = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive";
};

export type Toast = {
  id: string;
  title?: string;
  message: string;
  variant?: "success" | "info" | "warning" | "error" | "neutral" | "confirm";
  duration?: number; // ms; ignored for confirm
  actions?: ToastAction[]; // confirm/cancel, etc.
};

type Ctx = {
  push: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  /** Promise that resolves true/false after user clicks */
  confirm: (opts: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "primary";
  }) => Promise<boolean>;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider/>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pendingResolvers = useRef(new Map<string, (v: boolean) => void>());
  const timers = useRef(new Map<string, number>());
  const [mounted, setMounted] = useState(false);

  // Only render the portal on the client
  useEffect(() => setMounted(true), []);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current.clear();
    };
  }, []);

  const clearTimer = (id: string) => {
    const t = timers.current.get(id);
    if (t != null) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  };

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimer(id);

    const res = pendingResolvers.current.get(id);
    if (res) {
      res(false); // closing a confirm = cancel
      pendingResolvers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, duration: 3000, variant: "neutral", ...t };
      setToasts((prev) => [...prev, toast]);

      if (toast.variant !== "confirm" && toast.duration && toast.duration > 0) {
        const timeoutId = window.setTimeout(() => dismiss(id), toast.duration);
        timers.current.set(id, timeoutId);
      }
      return id;
    },
    [dismiss]
  );

  const confirm = useCallback(
    async (opts: {
      title?: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      variant?: "destructive" | "primary";
    }) => {
      const id = Math.random().toString(36).slice(2);
      const result = new Promise<boolean>((resolve) => {
        pendingResolvers.current.set(id, resolve);
      });

      setToasts((prev) => [
        ...prev,
        {
          id,
          variant: "confirm",
          title: opts.title ?? "Confirm action",
          message: opts.message,
          duration: 0, // no auto-close
          actions: [
            {
              label: opts.cancelText ?? "Cancel",
              variant: "secondary",
              onClick: () => {
                dismiss(id);
                const r = pendingResolvers.current.get(id);
                if (r) {
                  r(false);
                  pendingResolvers.current.delete(id);
                }
              },
            },
            {
              label: opts.confirmText ?? "Confirm",
              variant:
                opts.variant === "destructive" ? "destructive" : "primary",
              onClick: () => {
                dismiss(id);
                const r = pendingResolvers.current.get(id);
                if (r) {
                  r(true);
                  pendingResolvers.current.delete(id);
                }
              },
            },
          ],
        },
      ]);

      return result;
    },
    [dismiss]
  );

  const value = useMemo<Ctx>(
    () => ({ push, dismiss, confirm }),
    [push, dismiss, confirm]
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <ToastViewport toasts={toasts} onClose={dismiss} />,
          document.body
        )}
    </ToastCtx.Provider>
  );
}

/** Presentation */
function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: string) => void;
}) {
  // Mobile: top-center. Desktop (md+): top-right.
  return (
    <div
      className="
        fixed inset-x-0 top-2 z-[1000] mx-auto w-full max-w-sm px-2
        md:right-4 md:left-auto md:top-4 md:mx-0 md:w-96
        space-y-2
      "
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            rounded-xl shadow-lg border p-4 bg-white
            animate-in fade-in slide-in-from-top-2
            data-[variant=success]:border-green-200
            data-[variant=info]:border-blue-200
            data-[variant=warning]:border-amber-200
            data-[variant=error]:border-red-200
            data-[variant=confirm]:border-gray-200
          `}
          data-variant={t.variant}
          role={t.variant === "confirm" ? "dialog" : "status"}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {t.title ? (
                <p className="font-medium text-gray-900">{t.title}</p>
              ) : null}
              <p className="text-sm text-gray-700">{t.message}</p>

              {/* Actions */}
              {t.actions && t.actions.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {t.actions.map((a, i) => (
                    <button
                      key={i}
                      onClick={a.onClick}
                      className={buttonClass(a.variant)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              aria-label="Close"
              onClick={() => onClose(t.id)}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function buttonClass(variant: ToastAction["variant"]) {
  switch (variant) {
    case "destructive":
      return "inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500";
    case "secondary":
      return "inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50";
    default:
      return "inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500";
  }
}
