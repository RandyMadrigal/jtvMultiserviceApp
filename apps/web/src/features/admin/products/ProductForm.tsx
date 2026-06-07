import { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
} from "lucide-react";
import { apiClient } from "@/shared/lib/api-client";

/* ── Tipos ─────────────────────────────────────────────────────────────────── */
type Status = "disponible" | "agotado" | "promocion";
type CardState = "idle" | "uploading" | "done" | "error";

interface Category {
  _id: string;
  name: string;
}
interface ImageItem {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: ImageItem[];
  status: Status;
  createdBy?: { _id: string; email: string } | null;
  createdAt?: string;
}

interface ProductCard {
  tempId: string;
  file: File | null; // null = imagen existente sin cambios (modo edición)
  preview: string;
  name: string;
  description: string;
  categoryId: string;
  status: Status;
  state: CardState;
  progress: number;
  errorMsg: string;
}

interface Props {
  product?: Product;
  categories?: Category[];
  onSuccess: () => void;
  onClose: () => void;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */
async function compressImage(
  file: File,
  maxPx = 1280,
  q = 0.85,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(maxPx / Math.max(img.width, img.height), 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      const outType = file.type === "image/png" ? "image/png" : "image/webp";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }
          resolve(
            blob.size < file.size
              ? new File([blob], file.name, { type: outType })
              : file,
          );
        },
        outType,
        q,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

function makeCard(
  override: Partial<ProductCard> & { preview: string; categoryId: string },
): ProductCard {
  return {
    tempId: crypto.randomUUID(),
    file: null,
    name: "",
    description: "",
    status: "disponible",
    state: "idle",
    progress: 0,
    errorMsg: "",
    ...override,
  };
}

/* ── Indicador de estado por tarjeta ───────────────────────────────────────── */
function CardStatus({ card }: { card: ProductCard }) {
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
          {card.progress < 100
            ? `Subiendo… ${card.progress}%`
            : "Procesando en servidor…"}
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
      <AlertCircle className="h-3.5 w-3.5" />{" "}
      {card.errorMsg || "Error al subir"}
    </div>
  );
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Liberar object URLs al desmontar ────────────────────────────────── */
  useEffect(() => {
    return () => {
      cards.forEach((c) => {
        if (c.file && c.preview.startsWith("blob:"))
          URL.revokeObjectURL(c.preview);
      });
    };
  }, []);

  /* ── Helpers de actualización ────────────────────────────────────────── */
  const updateCard = (tempId: string, patch: Partial<ProductCard>) =>
    setCards((prev) =>
      prev.map((c) => (c.tempId === tempId ? { ...c, ...patch } : c)),
    );

  /* ── Selección de archivos (modo crear) ──────────────────────────────── */
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    if (cards.length + selected.length > 10) {
      setGlobalError(
        `Máximo 10 productos por lote. Ya tienes ${cards.length} seleccionados.`,
      );
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setGlobalError("");
    setCompressing(true);

    const compressed = await Promise.all(
      selected.map((f) => compressImage(f).catch(() => f)),
    );
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
      if (card?.file && card.preview.startsWith("blob:"))
        URL.revokeObjectURL(card.preview);
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

    const onUploadProgress = ({
      loaded,
      total,
    }: {
      loaded: number;
      total?: number;
    }) => {
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
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Error al guardar";
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
      setGlobalError(
        "Algunos productos tuvieron errores. Corrígelos e intenta de nuevo.",
      );
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* ── Modo CREAR: zona de selección de archivos ── */}
            {!isEdit && (
              <div>
                <div
                  onClick={() =>
                    !submitting && !compressing && fileRef.current?.click()
                  }
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 py-4 transition hover:border-primary/50 ${submitting || compressing ? "cursor-default opacity-50" : ""}`}
                >
                  {compressing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Comprimiendo…
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {cards.length === 0
                          ? "Seleccionar imágenes"
                          : "Agregar más imágenes"}
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
              <div
                key={card.tempId}
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
                        <img
                          src={card.preview}
                          alt=""
                          className="h-full w-full object-cover"
                        />
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
                      {idx === 0 && (
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
                          onChange={handleReplaceImage}
                        />
                      </>
                    )}
                  </div>

                  {/* ── Campos del producto ── */}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Producto #{idx + 1}
                      </span>
                      {!isEdit && card.state !== "done" && (
                        <button
                          type="button"
                          onClick={() => removeCard(card.tempId)}
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
                      onChange={(e) =>
                        updateCard(card.tempId, { name: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
                    />

                    {/* Descripción */}
                    <textarea
                      maxLength={500}
                      rows={2}
                      placeholder="Descripción (opcional)"
                      value={card.description}
                      disabled={submitting || card.state === "done"}
                      onChange={(e) =>
                        updateCard(card.tempId, { description: e.target.value })
                      }
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
                          disabled={
                            submitting ||
                            card.state === "done" ||
                            categories.length === 0
                          }
                          onChange={(e) =>
                            updateCard(card.tempId, {
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
                        >
                          {categories.length === 0 && (
                            <option value="">Sin categorías</option>
                          )}
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
                          onChange={(e) =>
                            updateCard(card.tempId, {
                              status: e.target.value as Status,
                            })
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
                        >
                          <option value="disponible">Disponible</option>
                          <option value="agotado">Agotado</option>
                          <option value="promocion">Promoción</option>
                        </select>
                      </div>
                    </div>

                    {/* Estado de carga por tarjeta */}
                    <CardStatus card={card} />
                  </div>
                </div>
              </div>
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
