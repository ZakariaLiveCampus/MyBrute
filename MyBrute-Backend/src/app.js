import express from 'express';
import { checkConnection } from './config/db.js';
import createAllTable from './utils/dbUtils.js';
import authRoutes from './routes/authRoutes.js';
import bruteRoutes from "./routes/bruteRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import cors from 'cors';
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes)
app.use("/api/brutes", bruteRoutes);
app.use("/api/battles", battleRoutes);

app.listen(3000, async() => {
    console.log("Server running on port 3000");
    try {
        await checkConnection();
        await createAllTable();
    } catch (error) {
        console.log("Failed to initialize the database", error);
    }
});