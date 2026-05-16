export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-pink">
            — {eyebrow}
          </span>
        )}
        <h1 className="mt-1 font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}