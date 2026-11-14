const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:3000";
const createProductForm = document.getElementById("createProductForm");

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

createProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObj = Object.fromEntries(formData.entries());

    // Parseamos los datos
    formObj.price = Number(formObj.price);
    formObj.name = formObj.name.trim();
    formObj.description = formObj.description.trim();

    const errores = validarFormulario(formObj);

    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj)
        });

        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", data.message);
        }

        mostrarMensaje("exito", `${data.message} con id ${data.productId}`);
        event.target.reset();

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        mostrarMensaje("error", "Error al enviar los datos");
    }
});
