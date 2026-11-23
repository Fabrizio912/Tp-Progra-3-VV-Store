// controladores de autenticacion
import UserModels from "../models/user.models.js";
import bcrypt from "bcrypt"; // Importamos bcrypt

// vista login
export const vistaLogin = (req, res) => {
    res.render("login", {
        title: "Login Admin",
        about: "Introduzca sus credenciales"
    });
}

// login usuario admin
export const loginUserAdmin = async (req, res) => {
    try {

        /* Podemos recibir los datos de email y password de login.ejs ya como un objeto 
        app.use(express.urlencoded({extended: true}));*/
        const { email, password } = req.body ?? {};

        // evitamos una consulta innecesaria a la BBDD
        if (!email || !password) {
            return res.status(400).render("login", {
                title: "Login Admin",
                about: "Introduzca sus credenciales",
                error: "Todos los campos son obligatorios"
            });
        }

        // traemos solamente el usuario admin que tenga ese email con bycript
        const [rows] = await UserModels.selectAdminUser(email);

        // mismo mensaje si no existe el usuario o si el password es incorrecto, asi no revelamos que emails estan registrados
        const credencialesInvalidas = () => res.status(401).render("login", {
            title: "Login Admin",
            about: "Introduzca sus credenciales",
            error: "Email o password incorrectos"
        });

        if (rows.length === 0) {
            return credencialesInvalidas();
        }

        const user = rows[0]; // En caso de que exista el usuario, lo guardo en la variable user

        // compara el password del form con el hash guardado
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return credencialesInvalidas();
        }

        // guardamos la sesion (nunca el password)
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        // guardada la sesion y redirije a la vista /dashboard/principal
        res.redirect("/dashboard/principal");

    } catch (error) {
        console.log("Error en el login: ", error);

        res.status(500).json({
            message: "Error interno del servidor al hacer login"
        });
    }
}

// logout de admin
export const logoutUserAdmin = (req, res) => {
    // destruimos la sesion existente
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al destruir la sesion: ", err);
            return res.status(500).json({
                message: "Error al destruir la sesion"
            });
        }

        // Eliminada exitosamente la sesion, redirigimos a login
        res.redirect("/login");
    });
}
