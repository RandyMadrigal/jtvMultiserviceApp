import { useEffect, useRef, useState } from "react";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { apiClient } from "@/shared/lib/api-client";
import { ProductCardItem } from "./ProductCardItem";
import {
  compressImage,
  makeCard,
  type Category,
  type Product,
  type ProductCard,
} from "./product-form.helpers";

export type { Product } from "./product-form.helpers";

interface Props {
  product?: Product;
  categories?: Category[];
  onSuccess: () => void;
  onClose: () => void;
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export function ProductForm({ product, categories: categoriesProp, onSuccess, onClose }: Props) {
  const isEdit = !!product;

  const [categories, setCategories] = useState<Category[]>(categoriesProp ?? []);
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [compressing, setCompressing] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const defaultCatId = categories[0]?._id ?? "";
  const allDone = cards.length > 0 && cards.every((c) => c.state === "done");
  const hasErrors = cards.some((c) => c.state === "error");

  /* ── Cargar categorías (solo si no vinieron como prop) ───────────────── */
  useEffect(() => {
    const initCards = (cats: Category[]) => {
      if (product && cats.length > 0) {
        setCards([
          makeCard({
            tempId: product._id,
            preview: product.images[0]?.url ?? "",
            name: product.name,
            description: product.description,
            categoryId: product.category._id,
            status: product.status,
          }),
        ]);
      }
    };

    if (categoriesProp && categoriesProp.length > 0) {
      initCards(categoriesProp);
      return;
    }

    apiClient.get<Category[]>("/categories").then(({ data }) => {
      setCategories(data);
      initCards(data);
    });
    // Inicialización única a propósito: si `product` o `categoriesProp` cambiaran y el efecto se
    // volviera a ejecutar, se reiniciarían las tarjetas y se perdería lo que el usuario ya editó.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Liberar object URLs al desmontar ────────────────────────────────── */
  useEffect(() => {
    return () => {
      cards.forEach((c) => {
        if (c.file && c.preview.startsWith("blob:")) URL.revokeObjectURL(c.preview);
      });
    };
  }, []);

  /* ── Helpers de actualización ────────────────────────────────────────── */
  const updateCard = (tempId: string, patch: Partial<ProductCard>) =>
    setCards((prev) => prev.map((c) => (c.tempId === tempId ? { ...c, ...patch } : c)));

  /* ── Selección de archivos (modo crear) ──────────────────────────────── */
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    if (cards.length + selected.length > 10) {
      setGlobalError(`Máximo 10 productos por lote. Ya tienes ${cards.length} seleccionados.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setGlobalError("");
    setCompressing(true);

    const compressed = await Promise.all(selected.map((f) => compressImage(f).catch(() => f)));
    const catId = defaultCatId;

    setCards((prev) => [
      ...prev,
      ...compressed.map((file) =>
        makeCard({
          file,
          preview: URL.createObjectURL(file),
          categoryId: catId,
        }),
      ),
    ]);

    setCompressing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Cambio de imagen en modo edición ────────────────────────────────── */
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cards[0]) return;
    setCompressing(true);
    const compressed = await compressImage(file).catch(() => file);
    const preview = URL.createObjectURL(compressed);
    updateCard(cards[0].tempId, { file: compressed, preview });
    setCompressing(false);
    if (editFileRef.current) editFileRef.current.value = "";
  };

  /* ── Quitar tarjeta ──────────────────────────────────────────────────── */
  const removeCard = (tempId: string) => {
    setCards((prev) => {
      const card = prev.find((c) => c.tempId === tempId);
      if (card?.file && card.preview.startsWith("blob:")) URL.revokeObjectURL(card.preview);
      return prev.filter((c) => c.tempId !== tempId);
    });
  };

  /* ── Submit ──────────────────────────────────────────────────────────── */
  const submitOne = async (card: ProductCard): Promise<void> => {
    updateCard(card.tempId, { state: "uploading", progress: 0, errorMsg: "" });

    const form = new FormData();
    form.append("name", card.name.trim());
    form.append("description", card.description.trim());
    form.append("category", card.categoryId);
    form.append("status", card.status);
    if (card.file) form.append("images", card.file);

    const onUploadProgress = ({ loaded, total }: { loaded: number; total?: number }) => {
      if (total)
        updateCard(card.tempId, {
          progress: Math.round((loaded / total) * 100),
        });
    };

    try {
      if (isEdit) {
        await apiClient.put(`/products/${product._id}`, form, {
          onUploadProgress,
        });
      } else {
        await apiClient.post("/products", form, { onUploadProgress });
      }
      updateCard(card.tempId, { state: "done", progress: 100 });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Error al guardar";
      updateCard(card.tempId, { state: "error", errorMsg: msg });
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    // Validación
    for (const card of cards) {
      if (!card.name.trim()) {
        setGlobalError("Todos los productos deben tener un nombre.");
        return;
      }
      if (!card.categoryId) {
        setGlobalError("Selecciona una categoría para cada producto.");
        return;
      }
    }

    setSubmitting(true);
    const results = await Promise.allSettled(cards.map(submitOne));
    setSubmitting(false);

    if (results.every((r) => r.status === "fulfilled")) {
      setTimeout(onSuccess, 600); // breve delay para mostrar "✓ Creado"
    } else {
      setGlobalError("Algunos productos tuvieron errores. Corrígelos e intenta de nuevo.");
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  const canSubmit = cards.length > 0 && !submitting && !allDone && !compressing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold">
              {isEdit
                ? "Editar producto"
                : `Nuevo${cards.length > 1 ? `s ${cards.length} productos` : " producto"}`}
            </h2>
            {!isEdit && cards.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Completa la información de cada imagen
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md p-1 hover:bg-secondary disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* ── Modo CREAR: zona de selección de archivos ── */}
            {!isEdit && (
              <div>
                <div
                  onClick={() => !submitting && !compressing && fileRef.current?.click()}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 py-4 transition hover:border-primary/50 ${submitting || compressing ? "cursor-default opacity-50" : ""}`}
                >
                  {compressing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Comprimiendo…</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {cards.length === 0 ? "Seleccionar imágenes" : "Agregar más imágenes"}
                      </span>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFiles}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  Hasta 10 imágenes · máx. 10 MB c/u
                </p>
              </div>
            )}

            {/* ── Sin tarjetas (modo crear) ── */}
            {!isEdit && cards.length === 0 && !compressing && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <Upload className="mx-auto mb-3 h-8 w-8 opacity-40" />
                Selecciona una o más imágenes para comenzar
              </div>
            )}

            {/* ── Tarjetas ── */}
            {cards.map((card, idx) => (
              <ProductCardItem
                key={card.tempId}
                card={card}
                index={idx}
                isEdit={isEdit}
                submitting={submitting}
                categories={categories}
                editFileRef={editFileRef}
                onChange={(patch) => updateCard(card.tempId, patch)}
                onRemove={() => removeCard(card.tempId)}
                onReplaceImage={handleReplaceImage}
              />
            ))}
          </div>

          {/* Footer fijo */}
          <div className="border-t border-border px-6 py-4 space-y-3">
            {globalError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {globalError}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {cards.length > 0 &&
                  !isEdit &&
                  `${cards.filter((c) => c.state === "done").length}/${cards.length} procesados`}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40"
                >
                  {allDone ? "Cerrar" : "Cancelar"}
                </button>
                {!allDone && (
                  <button
                    type="submit"
                    disabled={!canSubmit || categories.length === 0}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Guardando…
                      </span>
                    ) : isEdit ? (
                      "Guardar cambios"
                    ) : (
                      `Crear ${cards.length > 1 ? `${cards.length} productos` : "producto"}`
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
