import { Router } from "express";
import { login, current } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/current", authMiddleware, current);

export default router;