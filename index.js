//Importamos lo necesario
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import session from "express-session"; // Sesiones para el login de el admin
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { authRoutes, exportRoutes, productRoutes, saleRoutes, userRoutes, viewRoutes } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js";

//las config:
const app = express();
const PORT = environments.port;
const { session_key } = environments;

app.set("view engine", "ejs"); // EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // carpeta de las vistas EJS


// Middlewares (clase 06-11)
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes
app.use(loggerUrl); // Middleware logger para mostrar por consola las solicitudes de nuestro servidor

// Parseamos el JSON que enviamos en los formularios para recibirlos como objetos
app.use(express.json()); // Parseamos el JSON recibido en el body automaticamente
app.use(express.urlencoded({ extended: true })); // Para recibir los datos de los <form> HTML (login, crear admin)

// Middleware de sesion
app.use(session({
    secret: session_key, // Firma las cookies para q dps no se manipulen
    resave: false, // No guarda la sesion si no hubo cambios
    saveUninitialized: false // No guarda sesiones vacias (hasta que alguien haga login)
}));

// Archivos estaticos (css, js, img) que vienen desde src/public
app.use(express.static(join(__dirname, "src/public")));


//Rutas:
// Rutas productos
app.use("/api/products", productRoutes);//todas las peticiones que apunten a /api/products se redirigen a product.routes

// Rutas de usuarios
app.use("/api/users", userRoutes);

// Rutas vistas
app.use("/dashboard", viewRoutes); // Redirigimos las consultas a /dashboard a la ruta de vistas

// Rutas de exportacion (excel)
app.use("/export", exportRoutes);// TODO, dps hay q agregar este endpoint a un boton de "Descarga excel productos"

// Rutas de autenticacion: GET /, GET y POST /login, POST /logout
app.use("/", authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
