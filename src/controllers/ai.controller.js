import pool from "../config/db.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateSummary = async (req, res) => {
  const { noteId, content } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are an expert technical writer. Summarize the following notes into a brief executive overview followed by a bulleted list of key takeaways and action items."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    const summaryText = completion.choices[0].message.content;

    const result = await pool.query(
      "INSERT INTO summaries(note_id, summary_text) VALUES($1,$2) RETURNING *",
      [noteId, summaryText]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summary failed" });
  }
};

export const generateQuiz = async (req, res) => {
  const { noteId, content } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gemini-flash-2.5",
      messages: [
        {
          role: "system",
          content:
            "Generate 3 multiple choice questions from the text. " +
            "Return JSON with question, options A-D, and correct answer."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    const quizData = JSON.parse(
      completion.choices[0].message.content
    );

    const quizRes = await pool.query(
      "INSERT INTO quizzes(note_id) VALUES($1) RETURNING *",
      [noteId]
    );

    const quizId = quizRes.rows[0].id;

    for (const q of quizData.questions) {
      await pool.query(
        `INSERT INTO quiz_questions
         (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          quizId,
          q.question,
          q.A,
          q.B,
          q.C,
          q.D,
          q.answer
        ]
      );
    }

    res.json({ quizId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI quiz generation failed" });
  }
};
