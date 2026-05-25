import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales invalidas"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Usuario desactivado"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Credenciales invalidas"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "Login correcto",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                totalPoints: user.totalPoints
            }
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}

export const current = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

