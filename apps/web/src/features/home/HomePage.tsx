import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import heroImg from "@/assets/logoJtv.jpeg";
import {
  ArrowRight,
  Printer,
  Tag,
  Stamp,
  Sparkles,
  Zap,
  Heart,
  BadgeDollarSign,
  Shirt,
  Flag,
} from "lucide-react";
import { api } from "@/shared/lib/api";

interface Category {
  _id: string;
  name: string;
}
interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: Array<{ url: string }>;
}
interface PaginatedProducts {
  items: Product[];
}

const services = [
  {
    icon: Printer,
    label: "Impresión General",
    desc: "Tarjetas de presentación, volantes, brochures, afiches, pósters, carpetas corporativas, sobres y talonarios.",
  },
  {
    icon: Sparkles,
    label: "Stickers & Etiquetas",
    desc: "Vinilo troquelado, holográfico, adhesivo y resistente al agua. Libros, folletos y carpetas.",
  },
  {
    icon: Stamp,
    label: "Sellos Gomigrafos",
    desc: "Automáticos, de madera o pre-tintados. Papel membretado y sobres con tu identidad corporativa.",
  },
  {
    icon: Flag,
    label: "Banners & Letreros",
    desc: "Lona vinílica con ojales, viniles decorativos y promocionales, cajas personalizadas y rotulación.",
  },
  {
    icon: Shirt,
    label: "Material Promocional",
    desc: "Camisetas personalizadas, gorras bordadas o estampadas, llaveros, bolígrafos y tazas promocionales.",
  },
  {
    icon: Tag,
    label: "Diseño & Publicidad",
    desc: "Branding, logotipos, vallas publicitarias, banderolas, material POP y merchandising político.",
  },
];

const reasons = [
  {
    icon: Sparkles,
    title: "Calidad garantizada",
    desc: "Materiales premium y acabados impecables en cada proyecto.",
  },
  {
    icon: Zap,
    title: "Entregas puntuales",
    desc: "Producción ágil sin sacrificar la calidad de tu trabajo.",
  },
  {
    icon: Heart,
    title: "Atención personalizada",
    desc: "Te acompañamos desde la idea hasta el producto final.",
  },
  {
    icon: BadgeDollarSign,
    title: "Precios competitivos",
    desc: "Mejor relación calidad-precio del mercado local.",
  },
];

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<PaginatedProducts>("/products?limit=6&page=1")
      .then(({ data }) => setFeatured(data.items))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 30%, oklch(0.58 0.22 25 / 0.4), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
              Imprenta · Diseño
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Damos vida a tus ideas{" "}
              <span className="text-primary">en tinta y color.</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base text-white/75 md:text-lg">
              En JTV Multiservice transformamos tus diseños en productos
              impresos de alta calidad. Desde una tarjeta hasta un banner
              gigante.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
              >
                Ver Catálogo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={heroImg}
              alt="Productos impresos JTV Multiservice"
              width={1536}
              height={1024}
              className="w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Nuestros servicios
            </h2>
            <p className="mt-3 text-muted-foreground text-justify">
              Ofrecemos una amplia gama de servicios personalizados que se
              adaptan a cualquier necesidad.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.label}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{s.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Nos comprometemos con tu marca como si fuera nuestra.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl bg-card p-6 shadow-card"
              >
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Productos destacados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Una muestra de lo que producimos a diario.
                </p>
              </div>
              <Link
                to="/catalogo"
                className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:inline-flex"
              >
                Ver todo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <article
                  key={p._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="aspect-4/3 overflow-hidden bg-secondary">
                    <img
                      src={p.images[0]?.url ?? ""}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {p.category?.name}
                    </p>
                    <h3 className="mt-1 font-semibold">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="p-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-brand p-10 text-brand-foreground shadow-elegant md:p-14">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  ¿Listo para imprimir tu próxima idea?
                </h2>
                <p className="mt-2 text-white/80">
                  Cuéntanos tu proyecto y recibe una cotización personalizada.
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
