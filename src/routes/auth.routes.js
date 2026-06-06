import { Router } from "express";
import { login, current, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/current", authMiddleware, current);
router.post("/logout", logout);

export default router;