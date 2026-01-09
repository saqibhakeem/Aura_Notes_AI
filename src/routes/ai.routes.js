import express from "express";
import { generateSummary, generateQuiz } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/summarize", generateSummary);
router.post("/quiz", generateQuiz);

export default router;
