import { Link } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import {
  Printer,
  Image as ImageIcon,
  Stamp,
  Sparkles,
  Tag,
  FileText,
  Coffee,
  Flag,
  ArrowRight,
} from "lucide-react";

const items = [
  {
    icon: Printer,
    title: "Impresión digital",
    desc: "Trabajos a color y B/N en distintos gramajes y formatos.",
  },
  {
    icon: FileText,
    title: "Flyers",
    desc: "Volantes publicitarios para campañas y eventos.",
  },
  {
    icon: Tag,
    title: "Tarjetas de presentación",
    desc: "Diseño + impresión en papel premium con acabados especiales.",
  },
  {
    icon: Flag,
    title: "Banners",
    desc: "Lona vinílica con ojales, ideal para promociones.",
  },
  {
    icon: Sparkles,
    title: "Stickers",
    desc: "Vinilo troquelado, holográfico o resistente al agua.",
  },
  {
    icon: ImageIcon,
    title: "Letreros",
    desc: "PVC, acrílico, vinilo cortado e instalación.",
  },

  {
    icon: Coffee,
    title: "Tazas personalizadas",
    desc: "Cerámica sublimada full color, regalos memorables.",
  },
  {
    icon: Stamp,
    title: "Sellos",
    desc: "Automáticos, de madera o pre-tintados.",
  },
  {
    icon: FileText,
    title: "Invitaciones",
    desc: "Diseño exclusivo para bodas, XV años y graduaciones.",
  },
];

export function ServicesPage() {
  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Servicios</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Producción gráfica integral. Cualquier idea, la imprimimos.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 md:px-6">
          {items.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl bg-gradient-brand p-8 text-brand-foreground shadow-elegant md:p-12">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  ¿No ves lo que buscas?
                </h2>
                <p className="mt-1 text-white/80">
                  Hacemos trabajos personalizados — pregúntanos.
                </p>
              </div>
              <Link
                to="/contacto"
                className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
              >
                Solicitar cotización <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
