import Prediction from "../models/Prediction.js";
import Match from "../models/Match.js";
import User from "../models/User.js";
import { calculatePredictionPoints } from "../services/points.service.js";

export const createOrUpdatePrediction = async (req, res) => {
    try {
        const { matchId, predictedHomeGoals, predictedAwayGoals } = req.body;

        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({
                message: "Partido no encontrado"
            });
        }

        const now = new Date();

        if (now >= match.startDate) {
            return res.status(400).json({
                message: "El partido ya comenzo. No se puede modificar la prediccion"
            });
        }

        const prediction = await Prediction.findOneAndUpdate(
            {
                user: req.user._id,
                match: matchId
            },
            {
                user: req.user._id,
                match: matchId,
                predictedHomeGoals,
                predictedAwayGoals
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        )

        res.status(200).json({
            message: "Predicción guardada correctamente",
            prediction
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error al guardar la prediccion"
        });
    }
}

export const getMyPredictions = async (req, res) => {
    try {

        const predictions = await Prediction.find({
            user: req.user._id
        })
        .populate("match")
        .sort({ createdAt: -1 });

        res.status(200).json({
            predictions
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error al obtener predicciones"
        });
    }
};

export const recalculateMatchPredictions = async (req, res) => {
    try {
        const { matchId } = req.params;

        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({
                message: "Partido no encontrado"
            });
        }

        if (match.homeGoals === null || match.awayGoals === null) {
            return res.status(400).json({
                message: "El partido todavía no tiene resultado"
            });
        }

        const predictions = await Prediction.find({ match: matchId });

        for (const prediction of predictions) {
            const points = calculatePredictionPoints(prediction, match);

            prediction.points = points;
            prediction.calculated = true;

            await prediction.save();
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

        res.status(200).json({
            message: "Puntos recalculados correctamente",
            totalPredictions: predictions.length
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al recalcular puntos"
        });
    }
};