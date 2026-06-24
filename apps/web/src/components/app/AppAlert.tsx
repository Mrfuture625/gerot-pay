"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AppAlertProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function AppAlert({
  open,
  title = "Notice",
  message,
  onClose,
}: AppAlertProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#090a0d] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-zinc-400">{message}</p>

        <Button
          type="button"
          onClick={onClose}
          className="mt-4 w-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
}