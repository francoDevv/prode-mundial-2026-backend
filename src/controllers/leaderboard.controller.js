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

export const getGroupStageLeaderboard = async (req, res) => {
    try {
        const predictions = await Prediction.find({
            calculated: true
        })
            .populate("user", "name username isActive")
            .populate("match");

        const result = {};

        for (let matchday = 1; matchday <= 3; matchday++) {
            const matchdayPredictions = predictions.filter((prediction) => {
                return (
                    prediction.user?.isActive &&
                    prediction.match?.stage === "GROUP_STAGE" &&
                    prediction.match?.matchday === matchday
                );
            });

            const usersMap = {};

            for (const prediction of matchdayPredictions) {
                const userId = prediction.user._id.toString();

                if (!usersMap[userId]) {
                    usersMap[userId] = {
                        id: prediction.user._id,
                        name: prediction.user.name,
                        username: prediction.user.username,
                        points: 0,
                        exactResults: 0
                    };
                }

                usersMap[userId].points += prediction.points;

                if (prediction.points === 3) {
                    usersMap[userId].exactResults += 1;
                }
            }

            const usersArray = Object.values(usersMap);

            const byPoints = [...usersArray]
                .sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    return b.exactResults - a.exactResults;
                })
                .map((user, index) => ({
                    position: index + 1,
                    ...user
                }));

            const byExactResults = [...usersArray]
                .sort((a, b) => {
                    if (b.exactResults !== a.exactResults) {
                        return b.exactResults - a.exactResults;
                    }

                    return b.points - a.points;
                })
                .map((user, index) => ({
                    position: index + 1,
                    ...user
                }));

            result[`matchday${matchday}`] = {
                byPoints,
                byExactResults
            };
        }

        res.status(200).json(result);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error al obtener ranking por fechas"
        });
    }
};