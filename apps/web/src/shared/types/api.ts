export interface Category {
  _id: string;
  name: string;
}

export interface ProductImage {
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  status: "disponible" | "agotado" | "promocion";
  category: Category;
  images: ProductImage[];
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
