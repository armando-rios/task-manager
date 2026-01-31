import { toast } from '@arxdn/toast';

export const toastStyles = {
  success:
    'bg-theme-surface-1 text-theme-priority-low border border-theme-priority-low px-4 py-3 rounded-lg shadow-lg',
  error:
    'bg-theme-surface-1 text-theme-priority-high border border-theme-priority-high px-4 py-3 rounded-lg shadow-lg',
  warning:
    'bg-theme-surface-1 text-theme-priority-medium border border-theme-priority-medium px-4 py-3 rounded-lg shadow-lg',
  info: 'bg-theme-surface-1 text-theme-primary border border-theme-primary px-4 py-3 rounded-lg shadow-lg',
};

export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      className: toastStyles.success,
      ...options,
    });
  },
  error: (message, options = {}) => {
    return toast.error(message, {
      className: toastStyles.error,
      ...options,
    });
  },
  warning: (message, options = {}) => {
    return toast.warning?.(message, {
      className: toastStyles.warning,
      ...options,
    });
  },
  info: (message, options = {}) => {
    return toast.info?.(message, {
      className: toastStyles.info,
      ...options,
    });
  },
};

export default showToast;

