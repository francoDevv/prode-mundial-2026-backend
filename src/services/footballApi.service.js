import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const footballApi = axios.create({
    baseURL: process.env.FOOTBALL_API_BASE_URL,
    headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_TOKEN
    }
});

export const getWorldCupMatchesFromApi = async () => {
    const response = await footballApi.get(
        `/competitions/${process.env.FOOTBALL_WORLD_CUP_CODE}/matches`
    );

    return response.data.matches;
};