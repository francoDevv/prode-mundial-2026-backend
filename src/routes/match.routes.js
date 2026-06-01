import { Router } from "express";
import { syncMatches, getMatches, getMatchesWithUserPredictions, getNextArgentinaMatch, getTodayMatches } from "../controllers/match.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/sync", authMiddleware, adminMiddleware, syncMatches);
router.get("/", authMiddleware, getMatches);
router.get("/with-predictions", authMiddleware, getMatchesWithUserPredictions);
router.get("/next-argentina", authMiddleware, getNextArgentinaMatch);
router.get("/today", authMiddleware, getTodayMatches);

export default router;