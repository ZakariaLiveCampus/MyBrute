import express from "express";
import { recordBattle } from "../controllers/battleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/record", authMiddleware, recordBattle);

export default router;
