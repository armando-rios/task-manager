import { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeOnEsc && onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      const timer = setTimeout(() => {
        const focusableElements =
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        focusableElements?.[0]?.focus();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    }
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-theme-base/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Glow effect behind modal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-theme-primary/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]}
          glass-panel rounded-t-2xl md:rounded-2xl
          border border-theme-surface-2/50
          shadow-[0_0_30px_rgba(var(--color-glow-primary),0.15)]
          flex flex-col
          max-h-[90dvh] md:max-h-[85dvh]
          animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300
          motion-reduce:animate-none
          focus:outline-none
        `}
      >
        {/* Header */}
        {title && (
          <header className="flex items-center justify-between p-4 md:p-6 border-b border-theme-surface-2/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
              <h2
                id="modal-title"
                className="text-lg font-bold text-theme-text tracking-tight"
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-theme-surface-1 text-theme-subtext hover:text-theme-text transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-theme-surface-2/50 shrink-0">
            {footer}
          </footer>
        )}

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
