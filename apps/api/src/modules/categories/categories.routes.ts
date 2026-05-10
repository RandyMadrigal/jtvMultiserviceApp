import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { categorySchema } from "./categories.types";
import { list, get, create, update, remove } from "./categories.controller";

export const categoriesRouter = Router();

// Público — el catálogo necesita las categorías para los filtros
categoriesRouter.get("/",    list);
categoriesRouter.get("/:id", get);

// Admin — requiere JWT
categoriesRouter.post("/",    requireAuth, validate(categorySchema),          create);
categoriesRouter.put("/:id",  requireAuth, validate(categorySchema.partial()), update);
categoriesRouter.delete("/:id", requireAuth, remove);
