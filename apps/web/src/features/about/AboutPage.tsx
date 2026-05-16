import { Layout } from "@/shared/components/Layout";
import { Award, Users, Clock, Target, CheckCircle } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Clientes satisfechos" },
  { icon: Award, value: "10+", label: "Años de experiencia" },
  { icon: Clock, value: "24h", label: "Entregas exprés" },
  { icon: Target, value: "100%", label: "Garantía de calidad" },
];

const values = [
  "Calidad garantizada en cada proyecto",
  "Atención personalizada",
  "Entregas puntuales",
];

export function AboutPage() {
  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">
            Sobre JTV Multiservice
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground text-justify">
            JTV MULTI-SERVICE es una empresa dedicada a brindar servicios de
            impresión y soluciones gráficas, con un compromiso firme en la
            calidad, puntualidad y atención personalizada. Nuestro objetivo es
            ofrecer servicios de productos impresos y promocionales de alto
            impacto para lograr los objetivos propuestos.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Nuestra misión</h2>
            <p className="mt-3 text-muted-foreground">
              Ofrecer servicios de impresión y soluciones gráficas de alto
              impacto que ayuden a nuestros clientes a comunicar su marca,
              alcanzar sus objetivos y destacarse en el mercado, con calidad
              garantizada, entregas puntuales y atención personalizada en cada
              proyecto.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Nuestra visión</h2>
            <p className="mt-3 text-muted-foreground">
              Ser la empresa de referencia en impresión y diseño gráfico en
              Santo Domingo, reconocida por la excelencia en cada pieza que
              producimos, la fidelidad de nuestros clientes y nuestra capacidad
              de adaptarnos a las necesidades gráficas de cualquier sector.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-card p-6 text-center shadow-card"
            >
              <div className="mx-auto mb-3 inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-bold md:text-3xl">
            Valores que nos caracterizan
          </h2>
          <ul className="mt-6 space-y-4">
            {values.map((v) => (
              <li key={v} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl bg-secondary/60 p-6 text-sm text-muted-foreground md:p-8">
            <p>
              <span className="font-semibold text-foreground">RNC:</span>{" "}
              1-33-41691-3
            </p>
            <p className="mt-1">
              <span className="font-semibold text-foreground">Dirección:</span>{" "}
              Av. España No. 2, Local 204, Isabel La Católica, Zona Colonial,
              Santo Domingo, D.N.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
