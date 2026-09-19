import { useInView } from "@/shared/hooks/useInView";
import { reasons } from "./home.data";
import { fadeUp } from "./animations";

export function ReasonsSection() {
  const { ref: reasonsRef, inView: reasonsInView } = useInView();

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-secondary/60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 95% 50%, rgba(0,153,217,0.12) 0%, transparent 70%)," +
            "radial-gradient(ellipse 50% 60% at 5% 50%, rgba(193,0,126,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div ref={reasonsRef} className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className={`mx-auto max-w-2xl text-center ${fadeUp(reasonsInView)}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Nuestra diferencia
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">¿Por qué elegirnos?</h2>
          <p className="mt-4 text-muted-foreground">
            Nos comprometemos con tu marca como si fuera nuestra.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={`group relative rounded-2xl bg-card p-6 shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-glass ${fadeUp(reasonsInView)}`}
              style={reasonsInView ? { animationDelay: `${100 + i * 100}ms` } : undefined}
            >
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glass">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold font-display text-base">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
