import type { Category } from "@/shared/types/api";

export type Status = "disponible" | "agotado" | "promocion";

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: Array<{ url: string }>;
  status: Status;
}

export const STATUS_STYLES: Record<Status, string> = {
  disponible: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/20",
  agotado: "bg-muted text-muted-foreground border border-border",
  promocion: "bg-[#C1007E]/12 text-[#C1007E] border border-[#C1007E]/20",
};
export const STATUS_LABEL: Record<Status, string> = {
  disponible: "Disponible",
  agotado: "Agotado",
  promocion: "Promoción",
};

export const PAGE_SIZE = 12;
