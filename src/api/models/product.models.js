// Modelos de producto
import connection from "../database/db.js";

// Traer productos activos
const selectActiveProducts = () => {
    const sql = "SELECT id, name, description, price, image, category FROM products WHERE active = 1";
    return connection.query(sql);
}

// Traer todos los productos
const selectAllProducts = () => {
    const sql = "SELECT id, name, description, price, image, category, active FROM products";
    return connection.query(sql);
}

// Traer producto por id
// ahora solo devolvemos los campos necesarios, no todo pq gracias a los ? (placeholders) la consulta SQL es mas segura
const selectProductById = (id) => {
    const sql = "SELECT id, name, description, price, image, category, active FROM products WHERE id = ?";
    return connection.query(sql, [id]);
}

// Crear nuevo producto: active queda en 1 por defecto en la base
const insertNewProduct = (name, description, image, category, price) => {
    const sql = "INSERT INTO products (name, description, image, category, price) VALUES (?, ?, ?, ?, ?)";
    return connection.query(sql, [name, description, image, category, price]);
}

// Actualizar producto
const updateProduct = (name, description, image, price, category, active, id) => {
    const sql = "UPDATE products SET name = ?, description = ?, image = ?, price = ?, category = ?, active = ? WHERE id = ?";
    return connection.query(sql, [name, description, image, price, category, active, id]);
}

// // Eliminar producto: No se borra la fila porque product_sales la referencia, solo se desactiva
const deleteProduct = (id) => {
    const sql = "UPDATE products SET active = 0 WHERE id = ?";
    return connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct,
    selectActiveProducts
}