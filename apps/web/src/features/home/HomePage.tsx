import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Layout } from "@/shared/components/Layout";
import heroImg from "@/assets/logoJtv.jpg";
import {
  ArrowRight,
  Printer,
  Tag,
  Stamp,
  Sparkles,
  Zap,
  Heart,
  Shirt,
  Flag,
  CheckCircle,
} from "lucide-react";
import { api } from "@/shared/lib/api";
import { useInView } from "@/shared/hooks/useInView";
import { QuoteCTA } from "@/shared/components/QuoteCTA";
import type { Product, PaginatedProducts } from "@/shared/types/api";

const services = [
  {
    icon: Printer,
    label: "Impresión General",
    desc: "Tarjetas, volantes, brochures, afiches, carpetas corporativas, sobres y talonarios.",
    color: "from-[#0099D9] to-[#0077B6]",
  },
  {
    icon: Sparkles,
    label: "Stickers & Etiquetas",
    desc: "Vinilo troquelado, holográfico, adhesivo y resistente al agua en cualquier forma.",
    color: "from-[#C1007E] to-[#7D0052]",
  },
  {
    icon: Stamp,
    label: "Sellos Gomigrafos",
    desc: "Automáticos, de madera o pre-tintados. Papel membretado con tu identidad.",
    color: "from-[#0099D9] to-[#C1007E]",
  },
  {
    icon: Flag,
    label: "Banners & Letreros",
    desc: "Lona vinílica con ojales, viniles decorativos, cajas personalizadas y rotulación.",
    color: "from-[#7D0052] to-[#C1007E]",
  },
  {
    icon: Shirt,
    label: "Material Promocional",
    desc: "Camisetas, gorras bordadas, llaveros, bolígrafos y tazas con tu marca.",
    color: "from-[#0077B6] to-[#0099D9]",
  },
  {
    icon: Tag,
    label: "Diseño & Publicidad",
    desc: "Branding, logotipos, vallas publicitarias, banderolas y merchandising político.",
    color: "from-[#C1007E] to-[#0099D9]",
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
];

// Animation class helpers
const fadeUp = (visible: boolean, delay = 0) =>
  visible
    ? `animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both`
    : "opacity-0";

const fadeIn = (visible: boolean) =>
  visible ? "animate-in fade-in duration-700 fill-mode-both" : "opacity-0";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  const { ref: servicesRef, inView: servicesInView } = useInView();
  const { ref: reasonsRef, inView: reasonsInView } = useInView();
  const { ref: featuredRef, inView: featuredInView } = useInView();
  const { ref: ctaRef, inView: ctaInView } = useInView();

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<PaginatedProducts>("/products?limit=6&page=1", { signal: controller.signal })
      .then(({ data }) => setFeatured(data.items))
      .catch((err) => {
        if (!axios.isCancel(err)) setFeatured([]);
      });
    return () => controller.abort();
  }, []);

  return (
    <Layout>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      {/* Hero animates on mount — no IntersectionObserver needed */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 75% 15%, rgba(0,153,217,0.32) 0%, transparent 65%)," +
              "radial-gradient(ellipse 55% 55% at 15% 85%, rgba(193,0,126,0.28) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-2 md:items-center md:gap-10 md:px-6 md:py-32">
          {/* Left — Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/75 animate-in fade-in slide-in-from-top-3 duration-700 fill-mode-both">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand inline-block" />
              Imprenta · Diseño · Producción
            </span>

            <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
              Damos vida a <br className="hidden md:block" />
              tus ideas{" "}
              <span className="text-gradient-brand">
                en tinta
                <br className="hidden md:block" /> y color.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 md:text-lg animate-in fade-in duration-700 delay-300 fill-mode-both">
              En JTV Multiservice transformamos tus diseños en productos
              impresos de alta calidad. Desde una tarjeta de presentación hasta
              un banner gigante.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-500 fill-mode-both">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 hover:border-white/30"
              >
                Solicitar cotización
              </Link>
            </div>
          </div>

          {/* Right — Logo / Visual */}
          <div className="flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both">
            <div className="relative w-full max-w-sm">
              <div
                className="absolute inset-[-2px] rounded-3xl opacity-60"
                style={{
                  background: "var(--gradient-brand)",
                  filter: "blur(24px)",
                }}
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-3xl glass p-3 shadow-glow">
                <img
                  src={heroImg}
                  alt="JTV Multiservice — productos impresos"
                  width={600}
                  height={400}
                  className="w-full rounded-2xl object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-6 rounded-2xl glass px-4 py-3 shadow-glass animate-in fade-in slide-in-from-bottom-3 duration-700 delay-700 fill-mode-both">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#0099D9]" />
                  <span className="text-xs font-semibold text-white">
                    Calidad garantizada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────────────── */}
      <section className="py-24">
        <div ref={servicesRef} className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Section header */}
          <div
            className={`mx-auto max-w-2xl text-center ${fadeUp(servicesInView)}`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Lo que hacemos
            </span>
            <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">
              Servicios que
              <span className="text-gradient-brand"> transforman</span> tu marca
            </h2>
            <p className="mt-4 text-muted-foreground">
              Ofrecemos una amplia gama de servicios personalizados adaptados a
              cualquier necesidad gráfica o publicitaria.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.label}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-elegant ${fadeUp(servicesInView)}`}
                style={
                  servicesInView
                    ? { animationDelay: `${100 + i * 80}ms` }
                    : undefined
                }
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
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

      {/* ── POR QUÉ ELEGIRNOS ────────────────────────────────────────── */}
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

        <div
          ref={reasonsRef}
          className="relative mx-auto max-w-7xl px-4 md:px-6"
        >
          <div
            className={`mx-auto max-w-2xl text-center ${fadeUp(reasonsInView)}`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Nuestra diferencia
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nos comprometemos con tu marca como si fuera nuestra.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className={`group relative rounded-2xl bg-card p-6 shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-glass ${fadeUp(reasonsInView)}`}
                style={
                  reasonsInView
                    ? { animationDelay: `${100 + i * 100}ms` }
                    : undefined
                }
              >
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glass">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold font-display text-base">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-24">
          <div ref={featuredRef} className="mx-auto max-w-7xl px-4 md:px-6">
            <div
              className={`flex items-end justify-between gap-4 ${fadeUp(featuredInView)}`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Del catálogo
                </span>
                <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                  Productos destacados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Una muestra de lo que producimos a diario.
                </p>
              </div>
              <Link
                to="/catalogo"
                className="hidden items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary md:inline-flex"
              >
                Ver todo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <article
                  key={p._id}
                  className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-elegant ${fadeUp(featuredInView)}`}
                  style={
                    featuredInView
                      ? { animationDelay: `${100 + i * 80}ms` }
                      : undefined
                  }
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={p.images[0]?.url ?? ""}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                        {p.category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold font-display text-base">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div
              className={`mt-8 flex justify-center md:hidden ${fadeIn(featuredInView)}`}
              style={featuredInView ? { animationDelay: "600ms" } : undefined}
            >
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground"
              >
                Ver catálogo completo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-12 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div
            ref={ctaRef}
            className={ctaInView ? "animate-in fade-in zoom-in-95 duration-700 fill-mode-both" : "opacity-0"}
          >
            <QuoteCTA
              eyebrow="Cotiza gratis"
              headline="¿Listo para imprimir tu próxima idea?"
              subtitle="Cuéntanos tu proyecto y recibe una cotización personalizada sin costo y sin compromiso."
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
