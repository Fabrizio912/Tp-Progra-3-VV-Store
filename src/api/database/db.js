// Importamos mysql2 en modo promesas para hacer peticiones asincronas a la BBDD
import mysql2 from "mysql2/promise";

// Importamos de environments la info de la conexion a la BBDD
import environments from "../config/environments.js";

// Usamos el destructuring para extraer el objeto database
const { database } = environments;

// Creamos un pool de conexiones (conexiones activas y reutilizables)
const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

// Exportamos el pool de conexiones para que pueda ser usado en otros archivos
export default connection;
