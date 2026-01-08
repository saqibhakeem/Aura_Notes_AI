import pool from "../config/db.js";

export const getSummaryById = async (req, res) => {
  const { summaryId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM summaries WHERE id = $1",
      [summaryId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

export const getSummariesByNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM summaries WHERE note_id = $1 ORDER BY created_at DESC",
      [noteId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
};
