require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const prompt = "Summarize the following text: Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows developers to run JavaScript on the server side.";

    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log("✅ Gemini Response:\n", response.text());
  } catch (err) {
    console.error("❌ Gemini API Error:\n", err.message || err);
  }
}

testGemini();
