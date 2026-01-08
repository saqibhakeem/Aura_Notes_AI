import pool from "../config/db.js";


export const getQuizzesByNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM quizzes WHERE note_id = $1 ORDER BY created_at DESC",
      [noteId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};


export const getQuizWithQuestions = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quizRes = await pool.query(
      "SELECT * FROM quizzes WHERE id = $1",
      [quizId]
    );

    const questionsRes = await pool.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = $1",
      [quizId]
    );

    res.json({
      quiz: quizRes.rows[0],
      questions: questionsRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz details" });
  }
};
