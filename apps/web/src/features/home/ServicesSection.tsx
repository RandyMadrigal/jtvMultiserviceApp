import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/shared/hooks/useInView";
import { services } from "./home.data";
import { fadeUp, fadeIn } from "./animations";

export function ServicesSection() {
  const { ref: servicesRef, inView: servicesInView } = useInView();

  return (
    <section className="py-24">
      <div ref={servicesRef} className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <div className={`mx-auto max-w-2xl text-center ${fadeUp(servicesInView)}`}>
          <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">
            Servicios que
            <span className="text-gradient-brand"> transforman</span> tu marca
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ofrecemos una amplia gama de servicios personalizados adaptados a cualquier necesidad
            gráfica o publicitaria.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.label}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-elegant ${fadeUp(servicesInView)}`}
              style={servicesInView ? { animationDelay: `${100 + i * 80}ms` } : undefined}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,153,217,0.04) 0%, rgba(193,0,126,0.04) 100%)",
                }}
                aria-hidden="true"
              />
              <div
                className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${s.color} text-white shadow-glass`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold font-display">{s.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 flex justify-center ${fadeIn(servicesInView)}`}
          style={servicesInView ? { animationDelay: "600ms" } : undefined}
        >
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-all duration-200 hover:border-primary/40 hover:text-primary"
          >
            Ver todos los servicios <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
