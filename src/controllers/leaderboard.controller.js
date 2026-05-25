import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ isActive: true})
            .select("name username role totalPoints")
            .sort({ totalPoints: -1, name: 1 });

        const leaderboard = users.map((user, index) => {
            return {
                position: index + 1,
                name: user.name,
                username: user.username,
                role: user.role,
                totalPoints: user.totalPoints
            }
        });

        res.status(200).json({
            leaderboard
        })



        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error al obtener el ranking"
        });
    }
}