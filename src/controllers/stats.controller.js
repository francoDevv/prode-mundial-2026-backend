import Prediction from "../models/Prediction.js";
import User from "../models/User.js";

export const getMyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            "name username totalPoints"
        );

        const predictions = await Prediction.find({
            user: req.user._id
        }).populate("match");

        const totalPredictions = predictions.length;

        const calculatedPredictions = predictions.filter((prediction) => {
            return prediction.calculated === true;
        });

        const exactResults = calculatedPredictions.filter((prediction) => {
            return prediction.points === 3;
        });

        const correctWinner = calculatedPredictions.filter((prediction) => {
            return prediction.points === 1;
        });

        const wrongPredictions = calculatedPredictions.filter((prediction) => {
            return prediction.points === 0;
        });

        const accuracy =
            calculatedPredictions.length > 0
                ? ((exactResults.length + correctWinner.length) / calculatedPredictions.length) * 100
                : 0;

        const response = {
            user,
            stats: {
                totalPoints: user.totalPoints,
                totalPredictions,
                calculatedPredictions: calculatedPredictions.length,
                exactResults: exactResults.length,
                correctWinner: correctWinner.length,
                wrongPredictions: wrongPredictions.length,
                accuracy: Number(accuracy.toFixed(2))
            }
        };

        res.status(200).json(response);
        
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error al obtener estadísticas"
        })
    }
}