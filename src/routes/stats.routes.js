import { Router } from "express";
import { getMyStats } from "../controllers/stats.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyStats);

export default router;