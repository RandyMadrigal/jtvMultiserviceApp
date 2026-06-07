export function extractError(err: unknown, fallback = "Ha ocurrido un error"): string {
  return (
    (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? fallback
  );
}
