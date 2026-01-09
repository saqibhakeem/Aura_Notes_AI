import pool from "../config/db.js";

export const createNote = async (req, res) => {
  const { userId, title, content } = req.body;
  try{
  const result = await pool.query(
    "INSERT INTO notes(user_id,title,content) VALUES($1,$2,$3) RETURNING *",
    [userId, title, content]
  );

  res.status(201).json(result.rows[0]);
}catch(e){

  res.status(500).json({message: e.message})

}
};

export const getNotes = async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id=$1 ORDER BY created_at DESC",
    [userId]
  );

  res.json(result.rows);
};

export const getNoteById = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0]);
};

export const deleteNote = async (req, res) => {
  await pool.query(
    "DELETE FROM notes WHERE id=$1",
    [req.params.id]
  );

  res.json({ message: "Note deleted" });
};
