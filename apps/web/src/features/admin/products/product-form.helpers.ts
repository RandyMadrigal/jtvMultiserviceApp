/* ── Tipos ─────────────────────────────────────────────────────────────────── */
export type Status = "disponible" | "agotado" | "promocion";
export type CardState = "idle" | "uploading" | "done" | "error";

export interface Category {
  _id: string;
  name: string;
}
export interface ImageItem {
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

export interface ProductCard {
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

/* ── Helpers ───────────────────────────────────────────────────────────────── */
export async function compressImage(file: File, maxPx = 1280, q = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(maxPx / Math.max(img.width, img.height), 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const outType = file.type === "image/png" ? "image/png" : "image/webp";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }
          resolve(blob.size < file.size ? new File([blob], file.name, { type: outType }) : file);
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

export function makeCard(
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
