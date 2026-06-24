import { cn } from "@/lib/utils";

export function AppSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && (
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}