import { MessageCircle } from "lucide-react";

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "10000000000";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${waNumber}?text=Hola%20JTV%20Multiservice%2C%20quiero%20una%20cotización`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-elegant transition-transform hover:scale-110"
      style={{ backgroundColor: "oklch(0.65 0.17 150)" }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
