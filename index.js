//Importamos lo necesario
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { productRoutes, viewRoutes } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js";

//las config:
const app = express();
const PORT = environments.port;

app.set("view engine", "ejs"); // EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // carpeta de las vistas EJS


// Middlewares (clase 06-11)
app.use(cors());
app.use(loggerUrl);
app.use(express.json());

// Archivos estaticos (css, js, img) que vienen desde src/public
app.use(express.static(join(__dirname, "src/public")));


//Rutas:
// Rutas endpoints
app.use("/api/products", productRoutes);

// Rutas vistas
app.use("/dashboard", viewRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
