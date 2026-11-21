//Controladores de producto
import ProductModels from "../models/product.models.js"; // Importamos los modelos


// Productos activos (los que ve el cliente)
export const getActiveProducts = async (req, res) => {
    try {
        const [rows] = await ProductModels.selectActiveProducts();

        if (rows.length === 0) {
            return res.status(404).json({ message: "No hay productos activos" });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.log("Error obteniendo productos activos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// Todos los productos, activos o no
export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await ProductModels.selectAllProducts();

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.log("Error obteniendo productos:", error);
        
        // Devolvemos error 500 si algo fallo en la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// El id ya viene validado por validateId
export const getProductById = async (req, res) => {
    // manejo de errores con try catch
    try {
        const [rows] = await ProductModels.selectProductById(req.id);

        // devolvemos 404 si no existe producto con ese id
        if (!rows.length) {
            return res.status(404).json({ message: `No existe el producto con id ${req.id}` });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.log("Error obteniendo producto por id:", error);
        // devolvemos 500 si algo fallo en la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// Los datos ya vienen validados por validateProduct
export const createProduct = async (req, res) => {
    try {
        const { name, description = "", image, category, price } = req.body;

        const [rows] = await ProductModels.insertNewProduct(name, description, image, category, price);

        res.status(201).json({
            message: "Producto creado con exito",
            productId: rows.insertId
        });
    } catch (error) {
        console.log("Error creando producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const modifyProduct = async (req, res) => {
    try {
        const { id, name, description = "", image, price, category, active } = req.body;

        const [result] = await ProductModels.updateProduct(name, description, image, price, category, active, id);

        // Uso affectedRows y no changedRows, porque si guardan sin cambiar nada
        // changedRows da 0 y no es un error
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `No existe el producto con id ${id}` });
        }

        res.status(200).json({ message: `Producto ${id} actualizado correctamente` });
    } catch (error) {
        console.log("Error modificando producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// No se borra de la base, solo se pone active = 0 (inactivo)
export const removeProduct = async (req, res) => {
    try {
        const [result] = await ProductModels.deleteProduct(req.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `No existe el producto con id ${req.id}` });
        }

        res.status(200).json({ message: `Producto ${req.id} dado de baja correctamente` });
    } catch (error) {
        console.log("Error eliminando producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}