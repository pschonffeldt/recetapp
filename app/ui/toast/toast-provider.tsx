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

/** ************************************
 * Types
 * ************************************/

export type ToastAction = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive";
};

type ToastDirection = "ltr" | "rtl";

export type Toast = {
  id: string;
  title?: string;
  message: string;
  variant?: "success" | "info" | "warning" | "error" | "neutral" | "confirm";
  duration?: number; // ms; ignored for confirm
  actions?: ToastAction[];
  showProgress?: boolean; // defaults true for non-confirm
};

// Public API exposed via context
type Ctx = {
  push: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string, opts?: { resolveIfPending?: boolean }) => void; // ← changed
  confirm: (opts: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "primary";
  }) => Promise<boolean>;
  setToastDuration: (ms: number) => void;
  setToastDirection: (dir: "ltr" | "rtl") => void;
};

const ToastCtx = createContext<Ctx | null>(null);

/** ************************************
 * Global config (edit here)
 * ************************************/
export const TOAST_CONFIG: {
  defaultDuration: number; // ms
  direction: ToastDirection; // drain direction for progress
} = {
  defaultDuration: 5000,
  // "rtl" = drains right→left, "ltr" = left→right
  // direction: "rtl",
  direction: "ltr",
};

/** ************************************
 * Hook
 * ************************************/
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider/>");
  return ctx;
}

/** ************************************
 * Provider (state + portal + API)
 * ************************************/
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pendingResolvers = useRef(new Map<string, (v: boolean) => void>());
  const timers = useRef(new Map<string, number>());
  const [mounted, setMounted] = useState(false);

  // configurable defaults (seeded from TOAST_CONFIG)
  const [defaults, setDefaults] = useState<{
    duration: number;
    direction: ToastDirection;
  }>({
    duration: TOAST_CONFIG.defaultDuration,
    direction: TOAST_CONFIG.direction,
  });

  const setToastDuration = useCallback((ms: number) => {
    setDefaults((d) => ({ ...d, duration: Math.max(0, ms | 0) }));
  }, []);

  const setToastDirection = useCallback((dir: ToastDirection) => {
    setDefaults((d) => ({ ...d, direction: dir }));
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
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

  const dismiss = useCallback(
    (id: string, opts?: { resolveIfPending?: boolean }) => {
      setToasts((t) => t.filter((x) => x.id !== id));
      clearTimer(id);

      const res = pendingResolvers.current.get(id);
      if (res && (opts?.resolveIfPending ?? true)) {
        res(false); // only resolve(false) when we mean “cancel/close”
        pendingResolvers.current.delete(id);
      }
    },
    []
  );

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = {
        id,
        duration: TOAST_CONFIG.defaultDuration, // ← here
        variant: "neutral",
        showProgress: t.variant !== "confirm" ? true : false,
        ...t,
      };
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
          duration: 0,
          actions: [
            {
              label: opts.cancelText ?? "Cancel",
              variant: "secondary",
              onClick: () => {
                dismiss(id, { resolveIfPending: false }); // ← don't pre-resolve
                const r = pendingResolvers.current.get(id);
                if (r) {
                  r(false);
                  pendingResolvers.current.delete(id);
                }
              },
            },
            {
              label: opts.confirmText ?? "Delete",
              variant:
                opts.variant === "destructive" ? "destructive" : "primary",
              onClick: () => {
                dismiss(id, { resolveIfPending: false }); // ← don't pre-resolve
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
    () => ({
      push,
      dismiss,
      confirm,
      setToastDuration,
      setToastDirection,
    }),
    [push, dismiss, confirm, setToastDuration, setToastDirection]
  );

  return (
    <ToastCtx.Provider value={value}>
      {/* Always render the app content */}
      {children}

      {/* Only mount the portal on the client */}
      {mounted &&
        createPortal(
          <ToastViewport
            toasts={toasts}
            onClose={(id) => dismiss(id)}
            defaults={{
              duration: TOAST_CONFIG.defaultDuration,
              direction: TOAST_CONFIG.direction,
            }}
          />,
          document.body
        )}
    </ToastCtx.Provider>
  );

  /** ************************************
   * Presentation (pure UI)
   * ************************************/
  function ProgressBar({
    duration,
    variant = "neutral",
    direction = TOAST_CONFIG.direction, // ← default
  }: {
    duration: number;
    variant?: Toast["variant"];
    direction?: "ltr" | "rtl";
  }) {
    const [started, setStarted] = useState(false);
    useEffect(() => {
      const id = requestAnimationFrame(() => setStarted(true));
      return () => cancelAnimationFrame(id);
    }, []);

    const barColor =
      variant === "success"
        ? "bg-green-500/80"
        : variant === "info"
        ? "bg-blue-500/80"
        : variant === "warning"
        ? "bg-amber-500/80"
        : variant === "error"
        ? "bg-red-500/80"
        : "bg-gray-500/70";

    return (
      <div className="relative mt-3 h-1 overflow-hidden rounded">
        <div
          className={`${barColor} h-full will-change-transform`}
          style={{
            transformOrigin: direction === "rtl" ? "right" : "left",
            transform: started ? "scaleX(0)" : "scaleX(1)",
            transitionProperty: "transform",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "linear",
          }}
        />
      </div>
    );
  }

  function ToastViewport({
    toasts,
    onClose,
    defaults,
  }: {
    toasts: Toast[];
    onClose: (id: string) => void;
    defaults: { duration: number; direction: ToastDirection };
  }) {
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

                {t.actions?.length ? (
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
                ) : null}

                {t.variant !== "confirm" &&
                t.showProgress !== false &&
                (t.duration ?? 0) > 0 ? (
                  <ProgressBar
                    duration={t.duration ?? defaults.duration} // ← safe fallback
                    variant={t.variant}
                    direction={defaults.direction} // ← from config
                  />
                ) : null}
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

  /** ************************************
   * Styling helpers
   * ************************************/
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
}
