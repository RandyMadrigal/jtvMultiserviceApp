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
  Shirt,
  Package,
  Megaphone,
  Palette,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "Impresión General",
    icon: Printer,
    services: [
      { name: "Tarjetas de presentación",        desc: "Diseño e impresión en papel premium con acabados especiales." },
      { name: "Volantes y brochures",             desc: "Material publicitario para campañas, eventos y promociones." },
      { name: "Afiches y pósters",               desc: "Impresión de alta resolución en distintos formatos y tamaños." },
      { name: "Carpetas corporativas",            desc: "Papelería personalizada para presentaciones empresariales." },
      { name: "Sobres y papel membretado",        desc: "Identidad corporativa completa con tu logo y datos." },
      { name: "Stickers y etiquetas en vinil",    desc: "Troquelado, holográfico, adhesivo o resistente al agua." },
      { name: "Talonarios",                       desc: "En papel autocopiante o simple para control de ventas." },
      { name: "Sellos Gomigrafos",               desc: "Automáticos, de madera o pre-tintados a tu medida." },
      { name: "Libros, folletos y carpetas",      desc: "Elaboración completa con encuadernación y acabados." },
    ],
  },
  {
    title: "Material Publicitario y Promocional",
    icon: Shirt,
    services: [
      { name: "Camisetas personalizadas",            desc: "Estampado o sublimación full color en todos los talles." },
      { name: "Gorras bordadas o estampadas",        desc: "Bordado de alta precisión o estampado digital." },
      { name: "Llaveros, bolígrafos y tazas",        desc: "Artículos promocionales personalizados con tu marca." },
      { name: "Banner y letreros",                   desc: "Lona vinílica con ojales, ideal para eventos y negocios." },
      { name: "Viniles decorativos y promocionales", desc: "Corte e instalación de vinilo para cualquier superficie." },
      { name: "Cajas personalizadas",               desc: "Packaging a medida con tu diseño y logo corporativo." },
      { name: "Rotulación",                          desc: "Rotulación vehicular, local y de escaparates." },
    ],
  },
  {
    title: "Publicidad Política y Campañas",
    icon: Megaphone,
    services: [
      { name: "Vallas publicitarias",  desc: "Diseño y producción de vallas de gran formato y alto impacto." },
      { name: "Banderolas y pancartas", desc: "Material liviano y resistente para eventos y campañas." },
      { name: "Material POP",           desc: "Abanicos personalizados, termos, banderas y más." },
      { name: "Merchandising político", desc: "Camisetas, gorras y afiches para campañas electorales." },
      { name: "Diseño de logos",        desc: "Identidad visual para tu campaña, partido o movimiento." },
    ],
  },
  {
    title: "Diseño Gráfico Profesional",
    icon: Palette,
    services: [
      { name: "Branding e identidad visual", desc: "Construcción completa de tu marca desde el concepto." },
      { name: "Diseño de logotipos",          desc: "Logos únicos y memorables para empresas y proyectos." },
    ],
  },
  {
    title: "Venta de Materiales",
    icon: Package,
    services: [
      { name: "Material gastable",              desc: "Todo lo que necesitas para tu taller de impresión." },
      { name: "Papel, cartón y adhesivo",       desc: "Venta de papel, cartón, adhesivo, satinado y más." },
    ],
  },
];

// suppress unused-import warnings for icons kept for potential future use
void [ImageIcon, Sparkles, Tag, FileText, Coffee, Flag, Stamp];

export function ServicesPage() {
  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Servicios</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Producción gráfica integral. Desde una tarjeta hasta una valla
            publicitaria — cualquier idea, la imprimimos.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-14 px-4 md:px-6">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div className="mb-6 flex items-center gap-3">
                <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold md:text-2xl">{cat.title}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.services.map((s) => (
                  <div
                    key={s.name}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
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
                  Hacemos trabajos personalizados — pregúntanos sin compromiso.
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
