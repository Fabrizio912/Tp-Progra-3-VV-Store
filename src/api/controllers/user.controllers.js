// controladores de usuario
import UserModels from "../models/user.models.js";
import bcrypt from "bcrypt"; // Para hashear el password antes de guardarlo

// creacion de los usuarios admin
export const createUserAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body ?? {};

    // si faltara algun campo de informacion en el form, lo vemos en la vista en un parrafo de error
        if (!name || !email || !password) {
            return res.status(400).render("post", {
                title: "Crear producto",
                about: "Crear nuevo producto",
                error: "Todos los campos son obligatorios al crear un admin"
            });
        }

        // rondas de sal (cantidad de veces que se aleatorizan los caracteres)
        const saltRounds = 10;

        // Hasheamos (ciframos) el password recibido en el req.body, nunca se guarda como viene
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await UserModels.createAdminUser(name.trim(), email.trim(), hashedPassword);

        res.status(201).render("post", {
            title: "Crear producto",
            about: "Crear nuevo producto",
            exito: "Usuario admin creado exitosamente"
        });

    } catch (error) {
        console.log("Error en el registro de usuarios admin: ", error);

        // email repetido (users.email es UNIQUE)
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).render("post", {
                title: "Crear producto",
                about: "Crear nuevo producto",
                error: "Ya existe un usuario con ese email"
            });
        }

        res.status(500).json({
            message: "Error interno del servidor al crear usuario admin"
        });
    }
}
