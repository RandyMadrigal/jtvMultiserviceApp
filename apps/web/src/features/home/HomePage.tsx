import { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "@/shared/components/Layout";
import { api } from "@/shared/lib/api";
import { useInView } from "@/shared/hooks/useInView";
import { QuoteCTA } from "@/shared/components/QuoteCTA";
import type { Product, PaginatedProducts } from "@/shared/types/api";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { ReasonsSection } from "./ReasonsSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { Seo } from "@/shared/components/Seo";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  const { ref: ctaRef, inView: ctaInView } = useInView();

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<PaginatedProducts>("/products?limit=6&page=1", {
        signal: controller.signal,
      })
      .then(({ data }) => setFeatured(data.items))
      .catch((err) => {
        if (!axios.isCancel(err)) setFeatured([]);
      });
    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <Seo
        fullTitle
        title="JTV Multiservice | Imprenta y servicios gráficos en Santo Domingo"
        description="Imprenta en la Zona Colonial, Santo Domingo: tarjetas, stickers, banners, sellos, camisetas y más. Calidad, entrega rápida y cotización gratis."
        path="/"
      />
      <HeroSection />
      <ServicesSection />
      <ReasonsSection />
      <FeaturedProductsSection featured={featured} />

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-12 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div
            ref={ctaRef}
            className={
              ctaInView ? "animate-in fade-in zoom-in-95 duration-700 fill-mode-both" : "opacity-0"
            }
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
