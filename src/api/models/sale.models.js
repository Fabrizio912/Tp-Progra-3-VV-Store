// Modelos de ventas
import connection from "../database/db.js";

// inserta una nueva venta
const insertNewSale = (date, total_price, user_name) => {
    // insertamos la venta en la tabla 'sales'
    const sql = "INSERT INTO sales (date, total_price, user_name) VALUES (?, ?, ?)";
    return connection.query(sql, [date, total_price, user_name]);
}

// traemos el precio real de los productos que estan activos (el precio NO se lo confiamos al cliente)
const selectPricesByIds = (ids) => {
    const sql = "SELECT id, price FROM products WHERE active = 1 AND id IN (?)";
    return connection.query(sql, [ids]);
}

// insertamos en product_sales
const insertIntoProductSales = (productId, saleId, quantity, unitPrice) => {
    const sql = "INSERT INTO product_sales (product_id, sale_id, quantity, unit_price) VALUES (?, ?, ?, ?)";
    return connection.query(sql, [productId, saleId, quantity, unitPrice]);
}

export default {
    insertNewSale,
    selectPricesByIds,
    insertIntoProductSales
}
