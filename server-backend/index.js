const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { AssemblyAI } = require("assemblyai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("./database.js"); 

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const ASSEMBLY_API_KEY= process.env.ASSEMBLY_API_KEY;
const GEMINI_API_KEY= process.env.GEMINI_API_KEY;

const assemblyClient = new AssemblyAI({ apiKey: ASSEMBLY_API_KEY });

//Transcribe audio using AssemblyAI
const transcribeAudio = async (filePath) => {
  const transcript = await assemblyClient.transcripts.transcribe({ audio: filePath });
  return transcript.text;
};

//Summarize transcript using Gemini
const summarizeTranscript = async (transcript) => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Summarize the following transcript in a few concise sentences:\n\n${transcript}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

//File upload + transcription + summary + database store
app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = file.path;

    const transcript = await transcribeAudio(filePath);
    const summary = await summarizeTranscript(transcript);

    //Insert into DB
    

    fs.unlinkSync(filePath); // delete local file

    res.json({ transcript, summary });
    await pool.query(
      `INSERT INTO transcriptions (filename, filetype, filesize, transcript, summary)
       VALUES ($1, $2, $3, $4, $5)`,
      [file.originalname, file.mimetype, file.size, transcript, summary]
    );
  } catch (err) {
    console.error("Error:", err.message || err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/", (req, res) => {
  res.send("Server running on http://localhost:5000");
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
