import { Layout } from "@/shared/components/Layout";
import {
  Award,
  Users,
  Clock,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Clientes satisfechos",
    color: "from-[#0099D9] to-[#0077B6]",
  },
  {
    icon: Award,
    value: "10+",
    label: "Años de experiencia",
    color: "from-[#C1007E] to-[#7D0052]",
  },
  {
    icon: Clock,
    value: "",
    label: "Entregas exprés",
    color: "from-[#0099D9] to-[#C1007E]",
  },
  {
    icon: Target,
    value: "100%",
    label: "Garantía de calidad",
    color: "from-[#7D0052] to-[#C1007E]",
  },
];

const values = [
  "Calidad garantizada en cada proyecto",
  "Atención personalizada de inicio a fin",
  "Entregas puntuales sin sacrificar calidad",
  "Materiales premium a precios competitivos",
  "Asesoría de diseño profesional incluida",
];

export function AboutPage() {
  return (
    <Layout>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/50 py-16">
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
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Quiénes somos
          </span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Sobre JTV Multiservice
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            JTV MULTI-SERVICE es una empresa dedicada a brindar servicios de
            impresión y soluciones gráficas, con un compromiso firme en la
            calidad, puntualidad y atención personalizada. Nuestro objetivo es
            ofrecer productos impresos y promocionales de alto impacto.
          </p>
        </div>
      </section>

      {/* ── Misión & Visión ─────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 md:px-6">
          {/* Misión */}
          <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-elegant md:p-10">
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,153,217,0.04) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-blue text-white shadow-glass">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">Nuestra misión</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ofrecer servicios de impresión y soluciones gráficas de alto
                impacto que ayuden a nuestros clientes a comunicar su marca,
                alcanzar sus objetivos y destacarse en el mercado, con calidad
                garantizada, entregas puntuales y atención personalizada en cada
                proyecto.
              </p>
            </div>
          </div>

          {/* Visión */}
          <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-elegant md:p-10">
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(193,0,126,0.04) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-magenta text-white shadow-glass">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">Nuestra visión</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ser la empresa de referencia en impresión y diseño gráfico en
                Santo Domingo, reconocida por la excelencia en cada pieza que
                producimos, la fidelidad de nuestros clientes y nuestra
                capacidad de adaptarnos a las necesidades gráficas de cualquier
                sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-secondary/60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,153,217,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              En números
            </span>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Resultados que nos respaldan
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-2xl bg-card p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
              >
                <div
                  className={`mx-auto mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${s.color} text-white shadow-glass`}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="text-4xl font-extrabold font-display text-gradient-brand">
                  {s.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-1 place-items-center text-center">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Lo que nos define
              </span>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Valores que nos caracterizan
              </h2>

              <p className="mt-3 leading-relaxed text-muted-foreground">
                Cada proyecto que tomamos es una oportunidad para demostrar
                nuestro compromiso con la excelencia.
              </p>

              <ul className="mt-7 space-y-3">
                {values.map((v) => (
                  <li
                    key={v}
                    className="flex items-center justify-center gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </span>

                    <span className="text-sm font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
