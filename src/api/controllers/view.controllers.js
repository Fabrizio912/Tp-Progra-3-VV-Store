import ProductModels from "../models/product.models.js";

export const vistaProductos = async (req, res) => {
    // Es el back office, así que van todos, también los inactivos
    const [rows] = await ProductModels.selectAllProducts();

    res.render("index", {
        title: "Dashboard principal",
        listaProductos: rows
    });
}

export const vistaConsultar = (req, res) => {
    res.render("get", { title: "Consultar producto" });
}

export const vistaCrear = (req, res) => {
    res.render("post", {
        title: "Crear producto",
        about: "Crear nuevo producto"
    });
}

export const vistaModificar = (req, res) => {
    res.render("put", { title: "Modificar producto" });
}

export const vistaEliminar = (req, res) => {
    res.render("delete", { title: "Eliminar producto" });
}
