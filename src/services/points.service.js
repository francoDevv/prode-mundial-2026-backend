export const calculatePredictionPoints = (prediction, match) => {
    const predictedHome = prediction.predictedHomeGoals;
    const predictedAway = prediction.predictedAwayGoals;

    const realHome = match.homeGoals;
    const realAway = match.awayGoals;

    const exactResult =
        predictedHome === realHome &&
        predictedAway === realAway;

    if (exactResult) {
        return 3;
    }

    const predictedWinner = getWinner(predictedHome, predictedAway);
    const realWinner = getWinner(realHome, realAway);

    if (predictedWinner === realWinner) {
        return 1;
    }

    return 0;
};

const getWinner = (homeGoals, awayGoals) => {
    if (homeGoals > awayGoals) return "HOME_TEAM";
    if (awayGoals > homeGoals) return "AWAY_TEAM";
    return "DRAW";
};