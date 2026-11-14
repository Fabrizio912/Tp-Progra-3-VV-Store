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
    contenedorProductos.innerHTML = `
        <ul class="lista-container">
            <li class="lista-producto">
                <img src="${producto.image}" alt="${producto.name}" class="lista-producto_img">
                <p>Id: ${producto.id} / ${producto.name} / <strong>Precio: $${Number(producto.price).toLocaleString("es-AR")}</strong></p>
                <p><button id="updateProduct-button">Actualizar producto</button></p>
            </li>
        </ul>
    `;

    document.getElementById("updateProduct-button").addEventListener("click", () => {
        if (confirm("Queres actualizar este producto?")) {
            mostrarFormProducto(producto);
        } else {
            alert("Actualizacion cancelada");
        }
    });
}

function mostrarFormProducto(producto) {
    contenedorProductos.innerHTML = `
    <section class="updateProduct-container">
        <h2>Actualizar producto</h2>

        <form id="updateProductForm">
            <input type="hidden" name="id" value="${producto.id}">

            <label for="categoryProd">Categoria</label>
            <select name="category" id="categoryProd" required>
                <option value="clothes" ${producto.category === "clothes" ? "selected" : ""}>Indumentaria</option>
                <option value="shoes" ${producto.category === "shoes" ? "selected" : ""}>Calzado</option>
            </select>

            <label for="imageProd">Imagen (URL)</label>
            <input type="text" name="image" id="imageProd" value="${producto.image}" required>

            <label for="nameProd">Nombre</label>
            <input type="text" name="name" id="nameProd" value="${producto.name}" required>

            <label for="descriptionProd">Descripcion</label>
            <input type="text" name="description" id="descriptionProd" value="${producto.description}" maxlength="255">

            <label for="priceProd">Precio</label>
            <input type="number" name="price" id="priceProd" value="${producto.price}" min="1" step="0.01" required>

            <label for="activeProd">Activo</label>
            <select name="active" id="activeProd" required>
                <option value="1" ${producto.active ? "selected" : ""}>Activado</option>
                <option value="0" ${producto.active ? "" : "selected"}>Desactivado</option>
            </select>

            <input type="submit" value="Actualizar producto">
        </form>
    </section>
    `;

    document.getElementById("updateProductForm").addEventListener("submit", actualizarProducto);
}

async function actualizarProducto(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObj = Object.fromEntries(formData.entries());

    // Parseamos a los tipos que espera la API
    formObj.id = Number(formObj.id);
    formObj.price = Number(formObj.price);
    formObj.active = Number(formObj.active);
    formObj.name = formObj.name.trim();
    formObj.description = formObj.description.trim();

    const errores = validarFormulario(formObj);

    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj)
        });

        const result = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", result.message);
        }

        mostrarMensaje("exito", result.message);

    } catch (error) {
        console.error("Error en la actualizacion del producto: ", error);
        mostrarMensaje("error", "Error de conexion con el servidor");
    }
}
