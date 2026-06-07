import axios from "axios";
import { apiBase } from "@/shared/config/env";

// Cliente sin autenticación para las páginas públicas
export const api = axios.create({ baseURL: apiBase });
