import { useState } from "react";
import { Layout } from "@/shared/components/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "18096894995";

const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
      <section className="relative overflow-hidden border-b border-border bg-secondary/50 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(0,153,217,0.2) 0%, transparent 70%)," +
              "radial-gradient(ellipse 50% 70% at 5% 50%, rgba(193,0,126,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Estamos para ayudarte
          </span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Contáctanos</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Escríbenos y recibe tu cotización personalizada. Respondemos rápido
            por WhatsApp.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
          {/* Left — Contact info */}
          <div className="flex flex-col gap-4">
            {contacts.map((c) => {
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

              return c.href ? (
                <a
                  key={c.label}
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
                <div key={c.label}>{card}</div>
              );
            })}
          </div>

          {/* Right — Form */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
            {/* Form header */}
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
              {/* Name */}
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

              {/* Email */}
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
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Message */}
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
        </div>
      </section>
    </Layout>
  );
}
