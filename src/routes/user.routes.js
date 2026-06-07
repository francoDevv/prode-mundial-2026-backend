import { Router } from "express";
import {
    getUsers,
    createUser,
    updateUser,
    toggleUserStatus
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.post("/", authMiddleware, adminMiddleware, createUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.patch("/:id/toggle-status", authMiddleware, adminMiddleware, toggleUserStatus);

export default router;