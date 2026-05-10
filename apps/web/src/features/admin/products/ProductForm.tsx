import { useEffect, useRef, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { apiClient } from "../lib/api-client";

type Status = "disponible" | "agotado" | "promocion";
type UploadPhase = "idle" | "compressing" | "uploading" | "processing";

interface Category { _id: string; name: string; }

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  image_url: string;
  image_public_id: string;
  status: Status;
  createdBy?: { _id: string; email: string } | null;
  createdAt?: string;
}

interface Props {
  product?: Product;
  onSuccess: () => void;
  onClose: () => void;
}

// ── Comprime la imagen en el browser antes de enviarla ────────────────────────
// Reduce el tamaño del archivo manteniendo buena calidad visual.
async function compressImage(file: File, maxPx = 1280, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const scale  = Math.min(maxPx / Math.max(img.width, img.height), 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Mantiene PNG si la imagen original es PNG (transparencia), sino WebP
      const outType = file.type === "image/png" ? "image/png" : "image/webp";
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Compression failed")); return; }
          // Si la compresión resulta más pesada que el original, usa el original
          const out = blob.size < file.size
            ? new File([blob], file.name, { type: outType })
            : file;
          resolve(out);
        },
        outType,
        quality,
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

// ── Labels por fase de carga ──────────────────────────────────────────────────
const PHASE_LABEL: Record<UploadPhase, string> = {
  idle:        "",
  compressing: "Comprimiendo imagen…",
  uploading:   "Subiendo imagen…",
  processing:  "Procesando en servidor…",
};

export function ProductForm({ product, onSuccess, onClose }: Props) {
  const isEdit = !!product;

  const [categories,    setCategories]   = useState<Category[]>([]);
  const [name,          setName]         = useState(product?.name         ?? "");
  const [description,   setDesc]         = useState(product?.description  ?? "");
  const [categoryId,    setCategoryId]   = useState(product?.category._id ?? "");
  const [status,        setStatus]       = useState<Status>(product?.status ?? "disponible");
  const [imageFile,     setImageFile]    = useState<File | null>(null);
  const [preview,       setPreview]      = useState<string>(product?.image_url ?? "");
  const [uploadPhase,   setUploadPhase]  = useState<UploadPhase>("idle");
  const [uploadPct,     setUploadPct]    = useState(0);
  const [error,         setError]        = useState("");

  const fileRef    = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string>("");  // ref para revocar en cleanup

  const isUploading = uploadPhase !== "idle";

  // Carga categorías una sola vez al montar
  useEffect(() => {
    apiClient.get<Category[]>("/categories").then(({ data }) => {
      setCategories(data);
      if (!product && data.length > 0) setCategoryId(data[0]._id);
    });
  }, []);

  // Libera la object URL al desmontar para evitar memory leaks
  useEffect(() => {
    return () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); };
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Muestra la imagen original de inmediato mientras se comprime
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
    setUploadPhase("compressing");

    try {
      const compressed = await compressImage(file);
      // Reemplaza la preview con la versión comprimida
      URL.revokeObjectURL(tempUrl);
      const compressedUrl = URL.createObjectURL(compressed);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = compressedUrl;
      setPreview(compressedUrl);
      setImageFile(compressed);
    } catch {
      // Si la compresión falla usa el archivo original
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = tempUrl;
      setImageFile(file);
    } finally {
      setUploadPhase("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !imageFile) { setError("La imagen es requerida"); return; }
    if (!categoryId)           { setError("Selecciona una categoría"); return; }

    setError("");
    setUploadPct(0);
    setUploadPhase("uploading");

    const form = new FormData();
    form.append("name",        name);
    form.append("description", description);
    form.append("category",    categoryId);
    form.append("status",      status);
    if (imageFile) form.append("image", imageFile);

    // Cuando el browser termina de enviar los bytes (100%), el backend
    // aún está procesando la imagen en Cloudinary → cambia la fase.
    const onUploadProgress = ({ loaded, total }: { loaded: number; total?: number }) => {
      if (!total) return;
      const pct = Math.round((loaded / total) * 100);
      setUploadPct(pct);
      if (pct === 100) setUploadPhase("processing");
    };

    try {
      if (isEdit) {
        await apiClient.put(`/products/${product._id}`, form, { onUploadProgress });
      } else {
        await apiClient.post("/products", form, { onUploadProgress });
      }
      onSuccess();
    } catch {
      setError("Ocurrió un error al guardar. Intenta de nuevo.");
      setUploadPhase("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-card">

        {/* ── Overlay de carga ────────────────────────────────────── */}
        {isUploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-card/95 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />

            <p className="text-sm font-medium text-foreground">
              {PHASE_LABEL[uploadPhase]}
            </p>

            {uploadPhase === "uploading" && (
              <div className="w-56 space-y-1">
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-150"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-muted-foreground">{uploadPct}%</p>
              </div>
            )}
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">{isEdit ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onClose} disabled={isUploading}
            className="rounded-md p-1 hover:bg-secondary disabled:opacity-40">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Image */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen {!isEdit && <span className="text-destructive">*</span>}
            </label>
            <div
              onClick={() => !isUploading && fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-4 transition hover:border-primary/50 ${isUploading ? "cursor-default opacity-50" : ""}`}
            >
              {uploadPhase === "compressing" ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Comprimiendo…</p>
                </div>
              ) : preview ? (
                <img src={preview} alt="preview" className="h-32 w-full object-contain" />
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir imagen</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP — máx. 5 MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input required maxLength={120} value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">Descripción</label>
            <textarea maxLength={500} rows={3} value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Categoría *</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
              >
                {categories.length === 0 && <option value="">Sin categorías</option>}
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Estado *</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
              >
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
                <option value="promocion">Promoción</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isUploading}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-40"
            >
              Cancelar
            </button>
            <button type="submit" disabled={isUploading || categories.length === 0}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {isEdit ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
