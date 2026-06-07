import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/match.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js"
import statsRoutes from "./routes/stats.routes.js"

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://prode.hydroseteint.com",
    "https://prode-hydroseteint.web.app",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API Prode Mundial funcionando")
})

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/predictions", predictionRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/stats", statsRoutes);

export default app;