export interface AdminDto {
  _id:       string;
  email:     string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email:    string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
}
