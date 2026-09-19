import { ChevronLeft, ChevronRight } from "lucide-react";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({ page, totalPages, onPageChange }: CatalogPaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item as number)}
              className={`min-w-9 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                page === item
                  ? "bg-gradient-brand text-white shadow-glass"
                  : "border border-border bg-card hover:border-primary/40 hover:text-primary"
              }`}
            >
              {item}
            </button>
          ),
        )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
