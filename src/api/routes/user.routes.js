//rutas de usuario
import { Router } from "express";
import { createUserAdmin } from "../controllers/user.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

// solo un admin logueado puede crear a otro admin
router.post("/", requireLogin, createUserAdmin);

export default router;
