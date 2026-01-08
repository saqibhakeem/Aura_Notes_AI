import express from "express";
import {
  getSummariesByNote,
  getSummaryById
} from "../controllers/summary.controller.js";

const router = express.Router();

// List summaries for a note
router.get("/note/:noteId", getSummariesByNote);

// Summary detail
router.get("/:summaryId", getSummaryById);

export default router;
