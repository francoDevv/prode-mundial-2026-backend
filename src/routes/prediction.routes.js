import { Router } from "express";
import {
    createOrUpdatePrediction,
    getMyPredictions,
    recalculateMatchPredictions
} from "../controllers/prediction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrUpdatePrediction);

router.get("/my-predictions", authMiddleware, getMyPredictions)

router.post(
    "/recalculate/:matchId",
    authMiddleware,
    adminMiddleware,
    recalculateMatchPredictions
);

export default router;