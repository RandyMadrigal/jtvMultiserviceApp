import { Layout } from "@/components/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";


export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, soy ${form.name} (${form.email}). ${form.message}`;
    window.open(
      `https://wa.me/10000000000?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Contáctanos</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Escríbenos y recibe tu cotización personalizada. Respondemos rápido.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Teléfono", value: "+1 (000) 000-0000" },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "+1 (000) 000-0000",
              },
              {
                icon: Mail,
                label: "Correo",
                value: "contacto@jtvmultiservice.com",
              },
              {
                icon: MapPin,
                label: "Dirección",
                value:
                  "LOREN IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.",
              },
              {
                icon: Clock,
                label: "Horario",
                value: "Lun – Sáb · 8:00 A.M a 05:00 P.M",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
          >
            <h2 className="text-2xl font-bold">Solicita tu cotización</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa el formulario y te responderemos por WhatsApp.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="name">
                  Nombre
                </label>
                <input
                  id="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="email">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={150}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="message">
                  Mensaje
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
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition hover:opacity-90"
              >
                Enviar por WhatsApp <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
