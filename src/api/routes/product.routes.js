/*=======================
    Rutas de producto
=======================*/
import { Router } from "express";
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProduct, getActiveProducts, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();

// IMPORTANTE: "/active" va antes de "/:id", si no Express tomaria "active" como un id
router.get("/active", getActiveProducts);
router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.post("/", validateProduct, createProduct);
router.put("/", validateProduct, modifyProduct);
router.delete("/:id", validateId, removeProduct);

export default router;
