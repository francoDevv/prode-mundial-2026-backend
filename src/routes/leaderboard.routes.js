import { Router } from "express";
import { getLeaderboard, getGroupStageLeaderboard } from "../controllers/leaderboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getLeaderboard);

router.get("/group-stage", authMiddleware, getGroupStageLeaderboard);
    
export default router;