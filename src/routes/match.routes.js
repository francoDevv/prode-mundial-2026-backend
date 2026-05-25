import { Router } from "express";
import { syncMatches, getMatches, getMatchesWithUserPredictions } from "../controllers/match.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/sync", authMiddleware, adminMiddleware, syncMatches);
router.get("/", authMiddleware, getMatches);
router.get("/with-predictions", authMiddleware, getMatchesWithUserPredictions);

export default router;