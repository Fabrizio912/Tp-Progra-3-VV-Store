// controladores de ventas
import SaleModels from "../models/sale.models.js";

// POST sale -> Crear venta
export const createSale = async (req, res) => {

    try {

        // recibimos los datos ya parseados del cuerpo de la peticion
        // products es un array de ids, un id repetido cuenta como una unidad mas de ese producto
        const { date, user_name, products } = req.body;

        // validacion minima de datos
        if (!user_name || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Datos invalidos. Debes enviar user_name y products como array"
            });
        }

        // contamos cuantas unidades hay de cada producto -> { 3: 2, 7: 1 }
        const cantidades = {};

        for (const productId of products) {
            const id = Number(productId);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Todos los ids de products deben ser enteros positivos"
                });
            }

            cantidades[id] = (cantidades[id] || 0) + 1;
        }

        const ids = Object.keys(cantidades).map(Number);

        // trae los precios desde la base de datos, solo de productos activos
        const [rowsProducts] = await SaleModels.selectPricesByIds(ids);

        // si falta alguno es porque no existe o esta inactivo
        if (rowsProducts.length !== ids.length) {
            return res.status(400).json({
                message: "Hay productos inexistentes o inactivos en la compra"
            });
        }

        // calculamos el total en el servidor
        let total_price = 0;
        rowsProducts.forEach(prod => {
            total_price += Number(prod.price) * cantidades[prod.id];
        });

        // si el front no manda fecha, se usa la actual
        const saleDate = date || new Date();

        // 1. INSERTAMOS LA VENTA EN "sales"
        const [saleResult] = await SaleModels.insertNewSale(saleDate, total_price, user_name.trim());

        // 2. OBTENEMOS EL ID DE LA VENTA recien creada
        const saleId = saleResult.insertId; // (igual q haciamos en create product)

        // 3. INSERTAR CADA PRODUCTO EN "product_sales" (con su cantidad y el precio de ese momento)
        for (const prod of rowsProducts) {
            await SaleModels.insertIntoProductSales(prod.id, saleId, cantidades[prod.id], prod.price);
        }

        res.status(201).json({
            message: "Venta registrada con exito",
            saleId,
            total_price
        });


    } catch (error) {
        console.log("Error creando venta: ", error);

        res.status(500).json({
            message: "Error interno del servidor al crear una venta"
        });
    }
}