const loggerUrl = (req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    next();
}

const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "El id debe ser un numero entero positivo" });
    }

    req.id = id;
    next();
}

// Sirve para POST y PUT
const validateProduct = (req, res, next) => {
    // Con Express 5 el body puede venir undefined si no llegó un JSON
    const { id, name, description, image, price, category, active } = req.body ?? {};
    const errores = [];

    if (!name || !image || !price || !category) {
        errores.push("Faltan campos requeridos");
    }

    if (typeof name !== "string" || name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Opcional, pero si viene tiene que ser texto
    if (description !== undefined && (typeof description !== "string" || description.length > 255)) {
        errores.push("La descripcion debe ser texto de hasta 255 caracteres");
    }

    if (typeof price !== "number" || price <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!["clothes", "shoes"].includes(category)) {
        errores.push("Categoria invalida (clothes o shoes)");
    }

    // En PUT además hace falta el id y el active
    if (req.method === "PUT") {
        if (!Number.isInteger(id) || id <= 0) {
            errores.push("El id debe ser un numero entero positivo");
        }
        if (![0, 1].includes(active)) {
            errores.push("El campo active debe ser 0 o 1");
        }
    }

    if (errores.length > 0) {
        console.log(errores);
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next();
}

export { loggerUrl, validateId, validateProduct }