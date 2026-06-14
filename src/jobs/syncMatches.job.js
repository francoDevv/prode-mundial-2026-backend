import cron from "node-cron";
import Match from "../models/Match.js";
import Prediction from "../models/Prediction.js";
import User from "../models/User.js";
import { getWorldCupMatchesFromApi } from "../services/footballApi.service.js";
import { calculatePredictionPoints } from "../services/points.service.js";
import { clearCache } from "../services/cache.service.js";

const syncMatchesJob = async () => {
    try {
        console.log("Sincronizando partidos...");

        const matches = await getWorldCupMatchesFromApi();

        for (const apiMatch of matches) {
            const updateData = {
                apiMatchId: apiMatch.id,
                homeTeam: apiMatch.homeTeam?.name || "Por definir",
                awayTeam: apiMatch.awayTeam?.name || "Por definir",
                homeTeamShortName: apiMatch.homeTeam?.shortName || "",
                awayTeamShortName: apiMatch.awayTeam?.shortName || "",
                startDate: apiMatch.utcDate,
                status: apiMatch.status,
                stage: apiMatch.stage,
                group: apiMatch.group,
                matchday: apiMatch.matchday,
            };

            // Solo sobreescribir scores y status si la API los provee con valores reales
            const apiHome = apiMatch.score?.fullTime?.home;
            const apiAway = apiMatch.score?.fullTime?.away;
            if (apiHome !== null && apiHome !== undefined && apiAway !== null && apiAway !== undefined) {
                updateData.homeGoals = apiHome;
                updateData.awayGoals = apiAway;
                updateData.winner = apiMatch.score?.winner ?? null;
                updateData.status = apiMatch.status;
            } else {
                // Si la API no trae scores, no tocar status (puede estar FINISHED manual)
                delete updateData.status;
            }

            const match = await Match.findOneAndUpdate(
                { apiMatchId: apiMatch.id },
                updateData,
                {
                    upsert: true,
                    new: true
                }
            );

            if (
                match.homeGoals !== null &&
                match.awayGoals !== null &&
                match.status === "FINISHED"
            ) {
                const predictions = await Prediction.find({
                    match: match._id
                });

                for (const prediction of predictions) {
                    const points = calculatePredictionPoints(prediction, match);

                    prediction.points = points;
                    prediction.calculated = true;

                    await prediction.save();
                }
            }
        }

        const users = await User.find();

        for (const user of users) {
            const userPredictions = await Prediction.find({
                user: user._id,
                calculated: true
            });

            let total = 0;

            for (const prediction of userPredictions) {
                total += prediction.points;
            }

            user.totalPoints = total;
            await user.save();
        }

        clearCache();
        console.log("Sincronización finalizada");

    } catch (error) {
        console.log("Error en syncMatchesJob:", error.message);
    }
};

export const startSyncMatchesJob = () => {
    cron.schedule("*/5 * * * *", syncMatchesJob);
};