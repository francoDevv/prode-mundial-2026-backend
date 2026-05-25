import bcrypt from "bcrypt";
import User from "../models/User.js"

export const createUser = async (req, res) => {
    try {
        const {name, username, password, role} = req.body;

        // Veriricamos si existe el usuario
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400),json({
                message: "El usuario ya existe"
            });
        }

        // Hasheamos la constaseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos usuario
        const newUser = new User ({
            name,
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "Usuario creado con exito",
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                role: newUser.role
            }
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error interno en el servidor"
        });
    }
}