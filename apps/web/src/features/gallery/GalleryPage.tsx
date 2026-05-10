import { Layout } from "@/shared/components/Layout";
import flyers from "@/assets/work-flyers.jpg";
import cards from "@/assets/work-cards.jpg";
import mug from "@/assets/work-mug.jpg";
import stickers from "@/assets/work-stickers.jpg";
import banner from "@/assets/work-banner.jpg";


const gallery = [
  { src: cards, alt: "Tarjetas de presentación premium" },
  { src: flyers, alt: "Flyers a todo color" },
  { src: stickers, alt: "Stickers troquelados" },
  { src: mug, alt: "Taza sublimada" },
  { src: banner, alt: "Banner gran formato" },
];

export function GalleryPage() {
  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">
            Galería de trabajos
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Una muestra de los proyectos que hemos producido para nuestros
            clientes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="group overflow-hidden rounded-2xl bg-card shadow-card"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
