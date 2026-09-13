"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { Check, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  exiting: boolean;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const variantConfig: Record<
  ToastVariant,
  { icon: typeof Check; bgClass: string; iconClass: string; textClass: string }
> = {
  success: {
    icon: Check,
    bgClass: "bg-stone-900",
    iconClass: "text-emerald-400",
    textClass: "text-white",
  },
  error: {
    icon: AlertCircle,
    bgClass: "bg-red-900",
    iconClass: "text-red-300",
    textClass: "text-red-50",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-amber-800",
    iconClass: "text-amber-300",
    textClass: "text-amber-50",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-900",
    iconClass: "text-blue-300",
    textClass: "text-blue-50",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success", duration: number = 3000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant, exiting: false }]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 200);
      }, duration);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center">
        {toasts.map((toast) => {
          const config = variantConfig[toast.variant];
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-full ${config.bgClass} shadow-lg backdrop-blur-sm ${
                toast.exiting ? "toast-exit" : "toast-enter"
              }`}
            >
              <Icon className={`w-4 h-4 ${config.iconClass} shrink-0`} />
              <span className={`text-sm font-medium ${config.textClass}`}>
                {toast.message}
              </span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors ml-1 pointer-events-auto"
              >
                <X className={`w-3.5 h-3.5 ${config.textClass} opacity-60`} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
