import express from "express";
import {
  getQuizzesByNote,
  getQuizWithQuestions
} from "../controllers/quiz.controller.js";

const router = express.Router();

// List quizzes for a note
router.get("/note/:noteId", getQuizzesByNote);

// Quiz detail with questions
router.get("/:quizId", getQuizWithQuestions);

export default router;
