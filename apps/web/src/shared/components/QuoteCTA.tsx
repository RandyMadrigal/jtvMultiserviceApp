import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface QuoteCTAProps {
  eyebrow?: string;
  headline: string;
  subtitle?: string;
  className?: string;
}

export function QuoteCTA({
  eyebrow = "Cotiza gratis",
  headline,
  subtitle = "Cuéntanos tu proyecto y recibe una cotización personalizada sin costo y sin compromiso.",
  className,
}: QuoteCTAProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-hero p-10 shadow-elegant md:p-14 ${className ?? ""}`}>
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
          <span className="inline-block rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-white text-balance md:text-3xl">
            {headline}
          </h2>
          <p className="mt-1.5 text-white/65">{subtitle}</p>
        </div>
        <Link
          to="/contacto"
          className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-brand px-7 py-3.5 text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow"
        >
          Solicitar cotización <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
