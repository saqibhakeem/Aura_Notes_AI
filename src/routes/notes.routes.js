import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  deleteNote
} from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/", createNote);
router.get("/:userId", getNotes);
router.get("/detail/:id", getNoteById);
router.delete("/:id", deleteNote);

export default router;
