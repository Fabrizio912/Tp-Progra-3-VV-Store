// rutas de autenticacion
import { Router } from "express";
import { loginUserAdmin, logoutUserAdmin, vistaLogin } from "../controllers/auth.controllers.js";
const router = Router();

// la ruta raiz "/" muestra el login
router.get("/", vistaLogin);

// vista del login
router.get("/login", vistaLogin);

// funcionalidad para login
router.post("/login", loginUserAdmin);

// funcionalidad para logout
router.post("/logout", logoutUserAdmin);

export default router;
