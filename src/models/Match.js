import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
    {
        apiMatchId: {
            type: Number,
            required: true,
            unique: true
        },

        homeTeam: {
            type: String,
            required: true
        },

        awayTeam: {
            type: String,
            required: true
        },

        homeTeamShortName: {
            type: String
        },

        awayTeamShortName: {
            type: String
        },

        startDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true
        },

        stage: {
            type: String
        },

        group: {
            type: String
        },

        matchday: {
            type: Number
        },

        homeGoals: {
            type: Number,
            default: null
        },

        awayGoals: {
            type: Number,
            default: null
        },

        winner: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

matchSchema.index({ startDate: 1 });
matchSchema.index({ stage: 1, matchday: 1 });
matchSchema.index({ status: 1, startDate: 1 });

const Match = mongoose.model("Match", matchSchema);

export default Match;