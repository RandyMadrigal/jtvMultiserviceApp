import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ProductCard } from "./product-form.helpers";

/* ── Indicador de estado por tarjeta ───────────────────────────────────────── */
export function ProductCardStatus({ card }: { card: ProductCard }) {
  if (card.state === "idle") return null;

  if (card.state === "uploading")
    return (
      <div className="mt-3 space-y-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150"
            style={{ width: `${card.progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {card.progress < 100 ? `Subiendo… ${card.progress}%` : "Procesando en servidor…"}
        </p>
      </div>
    );

  if (card.state === "done")
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> Producto creado
      </div>
    );

  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5" /> {card.errorMsg || "Error al subir"}
    </div>
  );
}
