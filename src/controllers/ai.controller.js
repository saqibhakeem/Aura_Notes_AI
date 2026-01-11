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
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            `You are an expert academic evaluator. Generate a challenging and accurate quiz based on the provided notes.\nInstructions:\nQuantity: 10 Multiple Choice Questions (MCQs).\nFormat: Each question has 4 options (A, B, C, D).\nCorrect Answer: Identify the correct option.\nTitle: Create a 2-3 word title.\nOutput Format: Respond only in valid JSON format. Do not include any introductory text, markdown code blocks, or explanations.\nJSON Schema:\n{"title":"Quiz Title","questions":[{"id":1,"question":"Question text here?","options":{"A":"Option A text","B":"Option B text","C":"Option C text","D":"Option D text"},"answer":"A"}]}`
                
        },
        {
          role: "user",
          content: content
        }
        
        
      ],
      response_format: { type: "json_object" }
    });

    

    const quizData = JSON.parse(
      completion.choices[0].message.content
    );

    const quizRes = await pool.query(
      "INSERT INTO quizzes(note_id, quiz_title) VALUES($1, $2) RETURNING id",
      [noteId, quizData.title] 
    );
    if (!quizRes.rows || quizRes.rows.length === 0) {
    throw new Error("Failed to insert quiz into database");
}

const quizId = quizRes.rows[0].id;

   
    const quizTitle = quizRes.rows[0].title;
    const insertedQuestions = [];

    for (const q of quizData.questions) {
      const qRes= await pool.query(
      `INSERT INTO quiz_questions
      (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
      quizId,
      q.question,
      q.options.A, // Accessing nested options A
      q.options.B, // Accessing nested options B
      q.options.C, // Accessing nested options C
      q.options.D, // Accessing nested options D
      q.answer     // Accessing 'answer' (which is 'A', 'B', etc.)
      ]
  );
    insertedQuestions.push(qRes.rows[0])
}


res.json({ quizId, title: quizTitle, questions: insertedQuestions });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI quiz generation failed" });
  }
};
