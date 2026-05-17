interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, className }: PageHeaderProps) {
  return (
    <section className={`relative overflow-hidden border-b border-border bg-secondary/50 py-16 ${className ?? ""}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(0,153,217,0.2) 0%, transparent 70%)," +
            "radial-gradient(ellipse 50% 70% at 5% 50%, rgba(193,0,126,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-3 duration-700 fill-mode-both">
          {eyebrow}
        </span>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 fill-mode-both">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-muted-foreground animate-in fade-in duration-700 delay-200 fill-mode-both">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
