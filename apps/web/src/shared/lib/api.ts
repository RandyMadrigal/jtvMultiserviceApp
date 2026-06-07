import axios from "axios";

// Cliente sin autenticación para las páginas públicas
export const api = axios.create({ baseURL: "/api" });
