import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImg from "@/assets/logoJtv.jpg";

export function HeroSection() {
  // Hero animates on mount — no IntersectionObserver needed
  return (
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

          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            TU SOLUCIÓN <br className="hidden md:block" />
            <span className="text-gradient-brand">GRÁFICA.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 md:text-lg animate-in fade-in duration-700 delay-300 fill-mode-both">
            En JTV Multiservice transformamos tus diseños en productos impresos de alta calidad.
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
                <span className="text-xs font-semibold text-white">Calidad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
