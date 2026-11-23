// Modelos de usuario
import connection from "../database/db.js";

// Traer un usuario admin por su email
const selectAdminUser = (email) => {
    const sql = "SELECT id, name, email, password FROM users WHERE email = ? AND is_admin = 1";
    return connection.query(sql, [email]);
}

// Crear un usuario admin (el password llega ya hasheado)
const createAdminUser = (name, email, password) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    return connection.query(sql, [name, email, password]);
}

export default {
    selectAdminUser,
    createAdminUser
}
