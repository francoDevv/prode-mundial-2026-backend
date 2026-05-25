import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        match: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true
        },

        predictedHomeGoals: {
            type: Number,
            required: true,
            min: 0
        },

        predictedAwayGoals: {
            type: Number,
            required: true,
            min: 0
        },

        points: {
            type: Number,
            default: 0
        },

        calculated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

predictionSchema.index({ user: 1, match: 1}, {unique: true});

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;