import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({
                message: "No autirizado. Token no encontrado"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Usuario desactivado"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        
        res.status(401).json({
            message: "Token invalido o expirado"
        });
    }
}