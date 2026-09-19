export interface Admin {
  _id: string;
  email: string;
  createdAt: string;
  isRoot?: boolean;
  verified?: boolean;
}

export interface PaginatedAdmins {
  items: Admin[];
  total: number;
  page: number;
  totalPages: number;
}

export const PAGE_SIZE = 10;
