type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-emerald-400/[0.08] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>

      <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{description}</p>
    </section>
  );
}