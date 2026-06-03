import User from "../models/User.js";
import Prediction from "../models/Prediction.js";

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select("name username totalPoints")
            .sort({ totalPoints: -1, name: 1 });

        const leaderboard = [];

        for (let i = 0; i < users.length; i++) {
            const user = users[i];

            const predictions = await Prediction.find({
                user: user._id,
                calculated: true
            });

            const exactResults = predictions.filter(
                (prediction) => prediction.points === 3
            ).length;

            const correctWinner = predictions.filter(
                (prediction) => prediction.points === 1
            ).length;

            leaderboard.push({
                position: i + 1,
                id: user._id,
                name: user.name,
                username: user.username,
                totalPoints: user.totalPoints,
                exactResults,
                correctWinner
            });
        }

        res.status(200).json({
            leaderboard
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al obtener el ranking"
        });
    }
};