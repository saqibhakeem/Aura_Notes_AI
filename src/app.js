import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/notes.routes.js";
import summaryRoutes from "./routes/summary.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);

export default app;
