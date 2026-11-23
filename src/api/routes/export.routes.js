//Rutas de exportacion
import { Router } from "express";
import { excelProducts } from "../controllers/export.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();

// solo un admin logueado puede descargar el excel
router.get("/products", requireLogin, excelProducts);

export default router;