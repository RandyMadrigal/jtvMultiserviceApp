import { useState } from "react";
import { Layout } from "@/shared/components/Layout";
import { Reveal } from "@/shared/components/Reveal";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "18096894995";

const contacts = [
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    value: "809-689-4995 / 829-429-2714",
    href: "tel:+18096894995",
    color: "from-[#0099D9] to-[#0077B6]",
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "jtvmultiservice@gmail.com",
    href: "mailto:jtvmultiservice@gmail.com",
    color: "from-[#C1007E] to-[#7D0052]",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Calle Isabel la católica esquina Gabino Puello/ Plaza Dalbert",
    href: "https://maps.app.goo.gl/Yra711Zh7T4QihGBA",
    color: "from-[#0099D9] to-[#C1007E]",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lunes – Sábado · 8:00 a.m. – 5:00 p.m.",
    href: undefined,
    color: "from-[#7D0052] to-[#C1007E]",
  },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    const text = `Hola, soy ${form.name} (${form.email}). ${form.message}`;
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <Layout>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="Estamos para ayudarte"
        title="Contáctanos"
        subtitle="Escríbenos y recibe tu cotización personalizada. Respondemos rápido por WhatsApp."
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
          {/* Left — Contact info */}
          <div className="flex flex-col gap-4">
            {contacts.map((c, i) => {
              const card = (
                <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glass">
                  <div
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${c.color} text-white shadow-glass`}
                  >
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-0.5 font-medium leading-relaxed">
                      {c.value}
                    </p>
                  </div>
                </div>
              );

              const inner = c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    c.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="block"
                >
                  {card}
                </a>
              ) : (
                <div>{card}</div>
              );

              return (
                <Reveal key={c.label} delay={i * 80}>
                  {inner}
                </Reveal>
              );
            })}
          </div>

          {/* Right — Form */}
          <Reveal delay={100}>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
              <div className="mb-7">
                <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glass">
                  <Send className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">Solicita tu cotización</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Completa el formulario y te responderemos por WhatsApp.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={150}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Mensaje / Descripción del proyecto
                  </label>
                  <textarea
                    id="message"
                    required
                    maxLength={1000}
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Cuéntanos qué necesitas imprimir, cantidad, medidas, etc."
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
                  />
                  <p className="mt-1 text-right text-xs text-muted-foreground">
                    {form.message.length}/1000
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
