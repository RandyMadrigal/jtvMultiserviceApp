import { Link } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import { Reveal } from "@/shared/components/Reveal";
import { PageHeader } from "@/shared/components/PageHeader";
import { QuoteCTA } from "@/shared/components/QuoteCTA";
import {
  Printer,
  Shirt,
  Package,
  Megaphone,
  Palette,
  Check,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "Impresión General",
    icon: Printer,
    color: "from-[#0099D9] to-[#0077B6]",
    services: [
      {
        name: "Tarjetas de presentación",
        desc: "Diseño e impresión en papel premium con acabados especiales.",
      },
      {
        name: "Volantes y brochures",
        desc: "Material publicitario para campañas, eventos y promociones.",
      },
      {
        name: "Afiches y pósters",
        desc: "Impresión de alta resolución en distintos formatos y tamaños.",
      },
      {
        name: "Carpetas corporativas",
        desc: "Papelería personalizada para presentaciones empresariales.",
      },
      {
        name: "Sobres y papel membretado",
        desc: "Identidad corporativa completa con tu logo y datos.",
      },
      {
        name: "Stickers y etiquetas en vinil",
        desc: "Troquelado, holográfico, adhesivo o resistente al agua.",
      },
      {
        name: "Talonarios",
        desc: "En papel autocopiante o simple para control de ventas.",
      },
      {
        name: "Sellos Gomigrafos",
        desc: "Automáticos, de madera o pre-tintados a tu medida.",
      },
      {
        name: "Libros, folletos y carpetas",
        desc: "Elaboración completa con encuadernación y acabados.",
      },
    ],
  },
  {
    title: "Material Publicitario y Promocional",
    icon: Shirt,
    color: "from-[#C1007E] to-[#7D0052]",
    services: [
      {
        name: "Camisetas personalizadas",
        desc: "Estampado o sublimación full color en todos los talles.",
      },
      {
        name: "Gorras bordadas o estampadas",
        desc: "Bordado de alta precisión o estampado digital.",
      },
      {
        name: "Llaveros, bolígrafos y tazas",
        desc: "Artículos promocionales personalizados con tu marca.",
      },
      {
        name: "Banner y letreros",
        desc: "Lona vinílica con ojales, ideal para eventos y negocios.",
      },
      {
        name: "Viniles decorativos y promocionales",
        desc: "Corte e instalación de vinilo para cualquier superficie.",
      },
      {
        name: "Cajas personalizadas",
        desc: "Packaging a medida con tu diseño y logo corporativo.",
      },
      {
        name: "Rotulación",
        desc: "Rotulación vehicular, local y de escaparates.",
      },
    ],
  },
  {
    title: "Publicidad Política y Campañas",
    icon: Megaphone,
    color: "from-[#0099D9] to-[#C1007E]",
    services: [
      {
        name: "Vallas publicitarias",
        desc: "Diseño y producción de vallas de gran formato y alto impacto.",
      },
      {
        name: "Banderolas y pancartas",
        desc: "Material liviano y resistente para eventos y campañas.",
      },
      {
        name: "Material POP",
        desc: "Abanicos personalizados, termos, banderas y más.",
      },
      {
        name: "Merchandising político",
        desc: "Camisetas, gorras y afiches para campañas electorales.",
      },
      {
        name: "Diseño de logos",
        desc: "Identidad visual para tu campaña, partido o movimiento.",
      },
    ],
  },
  {
    title: "Diseño Gráfico Profesional",
    icon: Palette,
    color: "from-[#7D0052] to-[#C1007E]",
    services: [
      {
        name: "Branding e identidad visual",
        desc: "Construcción completa de tu marca desde el concepto.",
      },
      {
        name: "Diseño de logotipos",
        desc: "Logos únicos y memorables para empresas y proyectos.",
      },
    ],
  },
  {
    title: "Venta de Materiales",
    icon: Package,
    color: "from-[#0077B6] to-[#0099D9]",
    services: [
      {
        name: "Material gastable",
        desc: "Todo lo que necesitas para tu taller de impresión.",
      },
      {
        name: "Papel, cartón y adhesivo",
        desc: "Venta de papel, cartón, adhesivo, satinado y más.",
      },
    ],
  },
];


export function ServicesPage() {
  return (
    <Layout>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/50 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(0,153,217,0.2) 0%, transparent 70%)," +
              "radial-gradient(ellipse 50% 70% at 90% 50%, rgba(193,0,126,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-3 duration-700 fill-mode-both">
            Producción gráfica integral
          </span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 fill-mode-both">
            Servicios
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground animate-in fade-in duration-700 delay-200 fill-mode-both">
            Desde una tarjeta hasta una valla publicitaria — cualquier idea, la
            imprimimos con la calidad que mereces.
          </p>
        </div>
      </section>

      {/* ── Service Categories ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-16 px-4 md:px-6">
          {categories.map((cat) => (
            <Reveal key={cat.title}>
              {/* Category Header */}
              <div className="mb-8 flex items-center gap-4">
                <div
                  className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br ${cat.color} text-white shadow-glass`}
                >
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold md:text-2xl">{cat.title}</h2>
                </div>
                <div className="ml-auto hidden h-px flex-1 bg-linear-to-r from-border to-transparent md:block" />
              </div>

              {/* Service Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.services.map((s) => (
                  <div
                    key={s.name}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glass"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,153,217,0.04) 0%, rgba(193,0,126,0.03) 100%)",
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <h3 className="font-bold font-display text-sm">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
          <Reveal zoom>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 shadow-elegant md:p-14">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 65% 70% at 80% 20%, rgba(0,153,217,0.4) 0%, transparent 60%)," +
                    "radial-gradient(ellipse 55% 60% at 10% 80%, rgba(193,0,126,0.35) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Trabajos a medida
                  </span>
                  <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                    ¿No ves lo que buscas?
                  </h2>
                  <p className="mt-1.5 text-white/65">
                    Hacemos trabajos personalizados — pregúntanos sin compromiso.
                  </p>
                </div>
                <Link
                  to="/contacto"
                  className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-brand px-7 py-3.5 text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow"
                >
                  Solicitar cotización <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
