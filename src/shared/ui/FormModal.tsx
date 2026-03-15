import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface FormModalProps {
  open: boolean;
  title: string;
  primaryColor: string;
  submitLabel?: string;
  isValid?: boolean;
  onSubmit: () => void;
  onClose: () => void;
  children: ReactNode;
}

export function FormModal({
  open,
  title,
  primaryColor,
  submitLabel = "Guardar",
  isValid = true,
  onSubmit,
  onClose,
  children,
}: FormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-neutral-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">{children}</div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-neutral-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-700 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!isValid}
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
