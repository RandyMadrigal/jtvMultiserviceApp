export interface CategoryDto {
  _id:        string;
  name:       string;
  createdBy:  { _id: string; email: string } | null;
  createdAt:  string;
  updatedAt:  string;
}

export interface CreateCategoryInput {
  name: string;
}
