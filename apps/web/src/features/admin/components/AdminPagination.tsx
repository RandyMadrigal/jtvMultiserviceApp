import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Mostrando {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md p-1.5 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
          .reduce<(number | "…")[]>((acc, n, idx, arr) => {
            if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
            acc.push(n);
            return acc;
          }, [])
          .map((n, i) =>
            n === "…" ? (
              <span key={`e-${i}`} className="px-1">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className={`min-w-8 rounded-md px-2 py-1 text-xs font-medium transition ${
                  n === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                {n}
              </button>
            ),
          )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md p-1.5 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
