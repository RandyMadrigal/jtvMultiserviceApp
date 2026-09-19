import type { ChangeEvent, RefObject } from "react";
import { X, Upload, Loader2, CheckCircle2, Star } from "lucide-react";
import { ProductCardStatus } from "./ProductCardStatus";
import type { Category, ProductCard, Status } from "./product-form.helpers";

interface Props {
  card: ProductCard;
  index: number;
  isEdit: boolean;
  submitting: boolean;
  categories: Category[];
  editFileRef: RefObject<HTMLInputElement | null>;
  onChange: (patch: Partial<ProductCard>) => void;
  onRemove: () => void;
  onReplaceImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

/* ── Tarjeta de un producto dentro del formulario ──────────────────────────── */
export function ProductCardItem({
  card,
  index,
  isEdit,
  submitting,
  categories,
  editFileRef,
  onChange,
  onRemove,
  onReplaceImage,
}: Props) {
  return (
    <div
      className={`rounded-xl border bg-background p-4 transition-colors ${
        card.state === "done"
          ? "border-green-300 bg-green-50/30"
          : card.state === "error"
            ? "border-destructive/40 bg-destructive/5"
            : card.state === "uploading"
              ? "border-primary/40 bg-primary/5"
              : "border-border"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* ── Imagen ── */}
        <div className="relative shrink-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-secondary">
            {card.preview ? (
              <img src={card.preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {/* Overlay de estado sobre la imagen */}
            {card.state === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {card.state === "done" && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/40">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
            )}

            {/* Badge Principal */}
            {index === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-primary px-1 py-0.5 text-[9px] font-semibold text-primary-foreground">
                <Star className="h-2 w-2" /> Principal
              </span>
            )}
          </div>

          {/* Botón cambiar imagen (modo edición) */}
          {isEdit && (
            <>
              <button
                type="button"
                onClick={() => editFileRef.current?.click()}
                disabled={submitting}
                className="mt-1 w-full rounded text-center text-[10px] text-muted-foreground underline hover:text-foreground disabled:opacity-40"
              >
                Cambiar
              </button>
              <input
                ref={editFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onReplaceImage}
              />
            </>
          )}
        </div>

        {/* ── Campos del producto ── */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Producto #{index + 1}
            </span>
            {!isEdit && card.state !== "done" && (
              <button
                type="button"
                onClick={onRemove}
                disabled={submitting}
                className="rounded p-0.5 text-muted-foreground hover:text-destructive disabled:opacity-40"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Nombre */}
          <input
            required
            maxLength={120}
            placeholder="Nombre del producto *"
            value={card.name}
            disabled={submitting || card.state === "done"}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
          />

          {/* Descripción */}
          <textarea
            maxLength={500}
            rows={2}
            placeholder="Descripción (opcional)"
            value={card.description}
            disabled={submitting || card.state === "done"}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
          />

          {/* Categoría + Estado */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-0.5 block text-xs font-medium text-muted-foreground">
                Categoría *
              </label>
              <select
                required
                value={card.categoryId}
                disabled={submitting || card.state === "done" || categories.length === 0}
                onChange={(e) => onChange({ categoryId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
              >
                {categories.length === 0 && <option value="">Sin categorías</option>}
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs font-medium text-muted-foreground">
                Estado *
              </label>
              <select
                value={card.status}
                disabled={submitting || card.state === "done"}
                onChange={(e) => onChange({ status: e.target.value as Status })}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
              >
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
                <option value="promocion">Promoción</option>
              </select>
            </div>
          </div>

          {/* Estado de carga por tarjeta */}
          <ProductCardStatus card={card} />
        </div>
      </div>
    </div>
  );
}
