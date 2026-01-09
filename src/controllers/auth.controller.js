import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try{await pool.query(
    "INSERT INTO users(name, email, password_hash) VALUES($1,$2,$3)",
    [name, email, hash]
  );

  res.status(201).json({ message: "User registered" });
}catch(e){
   
    if (e.code === '23505') { // Unique violation
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message:  e.message });
  

}
};

export const login = async (req, res) => {
  const { email, password } = req.body;

 
  try{ const userRes = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userRes.rows.length === 0)
    return res.status(401).json({ message: "Invalid credentials" });

  const user = userRes.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({ userId: user.id, name: user.name, email: user.email });
}catch(e){
  res.status(500).json({message: err.message})
}
};
