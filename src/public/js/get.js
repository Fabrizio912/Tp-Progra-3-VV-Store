const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:3000";
const getIdProductForm = document.getElementById("getIdProductForm");

function validarFormulario(data) {
    const errores = [];

    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.price || data.price <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // Validacion de image cuando metamos Multer

    if (!["clothes", "shoes"].includes(data.category)) {
        errores.push("Debe seleccionar una categoria");
    }

    return errores;
}

function mostrarListaErrores(array) {
    let htmlErrores = "<div class=\"errores-container\">";
    array.forEach(error => {
        htmlErrores += `<p class="mensaje error">${error}</p>`;
    });
    htmlErrores += "</div>";
    contenedorProductos.innerHTML = htmlErrores;
}

function mostrarMensaje(estado, mensaje) {
    contenedorProductos.innerHTML = `<p class="mensaje ${estado}">${mensaje}</p>`;
}

getIdProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const idProd = Number(event.target.idProd.value.trim());

    if (!idProd || idProd <= 0) {
        return mostrarMensaje("error", "Ingresa un id valido");
    }

    try {
        const response = await fetch(`${urlBase}/api/products/${idProd}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", data.message);
        }

        renderizarProducto(data.payload[0]);

    } catch (error) {
        console.error("Error al obtener producto: ", error.message);
        mostrarMensaje("error", "Error de conexion con el servidor");
    }
});

function renderizarProducto(producto) {
    const categoria = producto.category === "clothes" ? "Indumentaria" : "Calzado";

    contenedorProductos.innerHTML = `
        <ul class="lista-container">
            <li class="lista-producto">
                <img src="${producto.image}" alt="${producto.name}" class="lista-producto_img">
                <p>Id: ${producto.id} / ${producto.name} / ${categoria} / ${producto.active ? "Activo" : "Inactivo"}<br>
                ${producto.description}<br>
                <strong>Precio: $${Number(producto.price).toLocaleString("es-AR")}</strong></p>
            </li>
        </ul>
    `;
}
