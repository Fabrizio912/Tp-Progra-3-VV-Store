//Rutas de producto
import { Router } from "express"; // Importamos el middleware Router para gestionar las rutas
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProduct, getActiveProducts, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router(); // Funciona igual que una miniaplicacion de express

// IMPORTANTE: "/active" va antes de "/:id", si no Express tomaria "active" como un id
router.get("/active", getActiveProducts); // GET active products -> Obtener todos los productos activos
router.get("/", getAllProducts); // GET all products -> Obtener todos los productos
router.get("/:id", validateId, getProductById); // GET product by id -> Obtener producto por id
router.post("/", validateProduct, createProduct); // POST product -> Crear producto
router.put("/", validateProduct, modifyProduct); // PUT product -> Modificar producto
router.delete("/:id", validateId, removeProduct); // DELETE product -> Eliminar producto

export default router; // Se exportan todas las peticiones que atiende router
