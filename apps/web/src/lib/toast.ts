import { toast } from "sonner";

export const appToast = {
  loading(message: string, id?: string) {
    return toast.loading(message, { id });
  },

  success(message: string, id?: string) {
    return toast.success(message, { id });
  },

  error(message: string, id?: string) {
    return toast.error(message, { id });
  },

  info(message: string, id?: string) {
    return toast.info(message, { id });
  },
};