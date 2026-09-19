import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/shared/types/api";

interface CatalogFiltersProps {
  inputQ: string;
  q: string;
  cat: string;
  total: number;
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export function CatalogFilters({
  inputQ,
  q,
  cat,
  total,
  categories,
  onSearch,
  onCategoryChange,
}: CatalogFiltersProps) {
  return (
    <section className="border-b border-border bg-secondary/50 px-4 pb-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="pt-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search input */}
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={inputQ}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar producto…"
                aria-label="Buscar producto"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Filter count indicator */}
            {(cat || q) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {total} resultado{total !== 1 ? "s" : ""}
                <button
                  onClick={() => {
                    onSearch("");
                    onCategoryChange("");
                  }}
                  className="ml-1 flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition hover:border-primary/40 hover:text-primary"
                >
                  <X className="h-3 w-3" /> Limpiar
                </button>
              </div>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange("")}
              aria-pressed={cat === ""}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                cat === ""
                  ? "border-primary bg-gradient-brand text-white shadow-glass"
                  : "border-border bg-card hover:border-primary/40 hover:text-primary"
              }`}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => onCategoryChange(c._id)}
                aria-pressed={cat === c._id}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  cat === c._id
                    ? "border-primary bg-gradient-brand text-white shadow-glass"
                    : "border-border bg-card hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
