import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: "border-red-500/50 hover:border-red-500",
    warning: "border-yellow-500/50 hover:border-yellow-500",
    info: "border-blue-500/50 hover:border-blue-500",
  };

  const confirmButtonStyles = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
  };

  const iconColor = {
    danger: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const modalContent = (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-theme-base/80 backdrop-blur-md animate-in fade-in duration-300" />

      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-theme-primary/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Modal Container */}
      <div
        className={`
          relative w-full max-w-md
          glass-panel rounded-t-2xl md:rounded-2xl
          border ${variantStyles[variant]}
          shadow-[0_0_30px_rgba(var(--color-glow-primary),0.15)]
          animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-theme-surface-2/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-red-500/20" : variant === "warning" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}
            >
              <svg
                className={`w-5 h-5 ${iconColor[variant]}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {variant === "danger" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                ) : variant === "warning" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                )}
              </svg>
            </div>
            <h2
              id="confirm-modal-title"
              className="text-lg font-bold text-theme-text tracking-tight"
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-theme-surface-1 text-theme-subtext hover:text-theme-text transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <p className="text-sm text-theme-subtext leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-theme-surface-2/50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-theme-subtext hover:text-theme-text bg-theme-surface-0 rounded-lg hover:bg-theme-surface-1 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 ${confirmButtonStyles[variant]}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-theme-primary/30 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-theme-primary/30 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-theme-secondary/20 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-theme-secondary/20 rounded-br-2xl pointer-events-none" />
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
