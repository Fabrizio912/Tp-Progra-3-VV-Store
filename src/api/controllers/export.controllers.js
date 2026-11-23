//Controladores de exportacion
import ExcelJS from "exceljs"; // Importamos ExcelJS
import ProductModels from "../models/product.models.js"; // Importamos los modelos

export const excelProducts = async (req, res) => {
    try {
        // obtenemos todos los productos
        const [rows] = await ProductModels.selectAllProducts();

        // creamos un libro de excel y una hoja
        const workbook = new ExcelJS.Workbook(); // Crea un nuevo archivo de Excel en memoria "un libro"
        const worksheet = workbook.addWorksheet("Productos")

        // Encabezados
        worksheet.columns = [ // Definimos las columnas de las hojas
            { header: "ID", key: "id", width: 10 },
            { header: "Nombre", key: "name", width: 50 },
            { header: "Precio", key: "price", width: 20 },
        ];

        // agregamos los datos, inserta cada registro como una nueva fila en la hoja
        rows.forEach(row => worksheet.addRow(row)); // recorremos todos los registros q nos provee la BBDD

        // configuramos la respuesta HTTP para la descarga
        res.setHeader( // definimos las cabeceras HTTP para q el navegador sepa q la respuesta es un archivo de excel
            "Content-Type", // tipo MIME oficial para archivos ".xlsx"
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // le pone nombre al archivo e indica al navegador que lo descargue
        res.setHeader("Content-Disposition", "attachment; filename=productos.xlsx");

        // enviamos el archivo y esperamos a q escriba el contenido del libro excel en la respuesta HTTP
        await workbook.xlsx.write(res); // Esperamos a q se complete la escritura antes de continuar

        res.end(); // cerramos la conexion HTTP, proporcionando una respuesta

    } catch (error) {
        console.log("Error descargando excel de productos: ", error);

        res.status(500).json({
            message: "Error interno del servidor al obtener productos"
        });
    }
}