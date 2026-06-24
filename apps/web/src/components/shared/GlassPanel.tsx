import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}