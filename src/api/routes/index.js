// Archivo de barril: centraliza todas las rutas
import productRoutes from "./product.routes.js"; // Importamos las rutas de product.routes con este nombre
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js"; // Importamos las vistas de autenticacion
import userRoutes from "./user.routes.js";
import saleRoutes from "./sale.routes.js";
import exportRoutes from "./export.routes.js";

// Exportamos todas las rutas
export {
    productRoutes,
    viewRoutes,
    authRoutes,
    userRoutes,
    saleRoutes,
    exportRoutes
}
