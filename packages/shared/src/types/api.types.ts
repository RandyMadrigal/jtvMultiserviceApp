export interface PaginatedResponse<T> {
  items:      T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ApiError {
  error:    string;
  code?:    string;
  details?: Record<string, string[]>;
}
