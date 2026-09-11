"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { Check } from "lucide-react";

interface ToastItem {
  id: string;
  message: string;
  exiting: boolean;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium shadow-lg ${
              toast.exiting ? "toast-exit" : "toast-enter"
            }`}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
