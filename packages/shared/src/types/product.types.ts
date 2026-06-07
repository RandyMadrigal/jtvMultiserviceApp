export type ProductStatus = "disponible" | "agotado" | "promocion";

export interface ImageItem {
  url:       string;
  public_id: string;
}

export interface ProductDto {
  _id:         string;
  name:        string;
  description: string;
  category:    { _id: string; name: string };
  images:      ImageItem[];
  status:      ProductStatus;
  createdBy:   { email: string } | null;
  createdAt:   string;
  updatedAt:   string;
}

export interface CreateProductInput {
  name:        string;
  description: string;
  category:    string;
  status:      ProductStatus;
}
