import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startSyncMatchesJob } from "./jobs/syncMatches.job.js";

dotenv.config();

connectDB();

if (process.env.ENABLE_SYNC_JOB === "true") {
    console.log("Cron de sincronización ACTIVADO");
    startSyncMatchesJob();
} else {
    console.log("Cron de sincronización DESACTIVADO");
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});