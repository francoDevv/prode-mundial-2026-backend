import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                role: newUser.role,
                isActive: newUser.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, role, password } = req.body;

        const updateData = {
            name,
            username,
            role
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario" });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: user.isActive
                ? "Usuario activado correctamente"
                : "Usuario desactivado correctamente",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al cambiar estado del usuario" });
    }
};