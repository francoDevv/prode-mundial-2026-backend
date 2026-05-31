import Match from "../models/Match.js";
import { getWorldCupMatchesFromApi } from "../services/footballApi.service.js";
import Prediction from "../models/Prediction.js";

export const syncMatches = async (req, res) => {
    try {
        const matches = await getWorldCupMatchesFromApi();

        let createdOrUpdated = 0;

        for (const apiMatch of matches) {
            await Match.findOneAndUpdate(
                {apiMatchId: apiMatch.id},
                {
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
                    homeGoals: apiMatch.score?.fullTime?.home ?? null,
                    awayGoals: apiMatch.score?.fullTime?.away ?? null,
                    winner: apiMatch.score?.winner ?? null
                },
                {
                    upsert: true,
                    new: true
                }
            );

            createdOrUpdated++;
        }

        res.status(200).json({
            message: "Partidos sincronizados correctamente",
            total: createdOrUpdated
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error al sincronizar los partidos"
        });
    }
}

export const getMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ startDate: 1 });

        res.status(200).json({
            matches
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener partidos"
        });
    }
};

export const getMatchesWithUserPredictions = async (req, res) => {
    try {
        const matches = await Match.find().sort({ startDate: 1 });

        const predictions = await Prediction.find({
            user: req.user._id
        });

        const matchesWithPredictions = matches.map((match) => {
            const prediction = predictions.find((prediction) => {
                return prediction.match.toString() === match._id.toString();
            });

            const now = new Date();

            return {
                ...match.toObject(),
                prediction: prediction || null,
                predictionClosed: now >= match.startDate
            };
        });

        res.status(200).json({
            matches: matchesWithPredictions
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al obtener partidos con predicciones"
        });
    }
};

export const getNextArgentinaMatch = async (req, res) => {
    try {

        const match = await Match.findOne({
            status: "TIMED",
            $or: [
                { homeTeam: "Argentina" },
                { awayTeam: "Argentina" }
            ]
        }).sort({
            startDate: 1
        });

        res.status(200).json({
            match
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al obtener próximo partido de Argentina"
        });
    }
};