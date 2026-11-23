//Middlewares
// Funciones que se ejecutan entre la req y la res

// Middleware logger para mostrar por consola las solicitudes de nuestro servidor
const loggerUrl = (req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    next();
}

// Middleware para filtrar ids no validos
const validateId = (req, res, next) => {
    const id = Number(req.params.id);

	// Si el id no es un numero entero o es <= 0
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "El id debe ser un numero entero positivo" });
    }

    req.id = id;
    next();
}

// Middleware para validar los campos del formulario
const validateProduct = (req, res, next) => {
    const { id, name, description, image, price, category, active } = req.body ?? {};
    const errores = []; // Se crea un array vacio para ir metiendo los errores

    // Verificamos los datos de entrada
    if (!name || !image || !price || !category) {
        errores.push("Faltan campos requeridos");
    }

    // Verificamos name
    if (typeof name !== "string" || name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Opcional, pero si viene tiene que ser texto
    if (description !== undefined && (typeof description !== "string" || description.length > 255)) {
        errores.push("La descripcion debe ser texto de hasta 255 caracteres");
    }

	// Verificamos price
    if (typeof price !== "number" || price <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

	// Verificamos category
    if (!["clothes", "shoes"].includes(category)) {
        errores.push("Categoria invalida (clothes o shoes)");
    }

    // En PUT además se verifica el id y el active
    if (req.method === "PUT") {
        if (!Number.isInteger(id) || id <= 0) {
            errores.push("El id debe ser un numero entero positivo");
        }
        if (![0, 1].includes(active)) {
            errores.push("El campo active debe ser 0 o 1");
        }
    }

	// Si hay algun error en la lista, lo devolvemos en un 400
    if (errores.length > 0) {
        console.log(errores);
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next();// Damos paso al siguiente middleware o a la response
}

// Protege las vistas del admin: si no hay sesion, redirige al login
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();  // Damos paso al siguiente middleware o a procesar la respuesta
}

// Exportamos nuestros middlewares para poder usarlos en otros modulos
export { loggerUrl, 
    validateId, 
    validateProduct, 
    requireLogin 
}
