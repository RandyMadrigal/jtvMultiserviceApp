import { Layout } from "@/shared/components/Layout";
import { Award, Users, Clock, Target } from "lucide-react";


const stats = [
  { icon: Users, value: "500+", label: "Clientes felices" },
  { icon: Award, value: "10+", label: "Años de experiencia" },
  { icon: Clock, value: "24h", label: "Entregas expréss" },
  { icon: Target, value: "100%", label: "Garantía de calidad" },
];

export function AboutPage() {
  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">
            Sobre JTV Multiservice
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Nuestra misión</h2>
            <p className="mt-3 text-muted-foreground">
              loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Nuestra visión</h2>
            <p className="mt-3 text-muted-foreground">
              loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim
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
    </Layout>
  );
}
