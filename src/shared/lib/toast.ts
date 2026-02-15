import toast from "@arxdn/toast";

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      className: "ui-toast ui-toast-success",
      duration: 3000,
      position: "bottom-center",
    }),

  error: (message: string) =>
    toast.error(message, {
      className: "ui-toast ui-toast-error",
      duration: 4000,
      position: "bottom-center",
    }),

  warning: (message: string) =>
    toast.warning(message, {
      className: "ui-toast ui-toast-warning",
      duration: 3500,
      position: "bottom-center",
    }),

  info: (message: string) =>
    toast.info(message, {
      className: "ui-toast ui-toast-info",
      duration: 3000,
      position: "bottom-center",
    }),

  loading: (message: string) =>
    toast.info(message, {
      className: "ui-toast ui-toast-info",
      duration: 0,
      position: "bottom-center",
    }),
};
