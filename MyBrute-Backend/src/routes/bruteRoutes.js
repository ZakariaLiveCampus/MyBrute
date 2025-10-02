import express from "express";
import { create, getMyBrutes, getStats, getOpponents  } from "../controllers/bruteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, create);
router.get("/my-brutes", authMiddleware, getMyBrutes);
router.get("/:bruteId/stats", authMiddleware, getStats);
router.get("/opponents", authMiddleware, getOpponents);

export default router;
