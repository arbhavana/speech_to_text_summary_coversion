const { AssemblyAI } = require("assemblyai");
require("dotenv").config();

const ASSEMBLY_API_KEY= process.env.ASSEMBLY_API_KEY;

const client = new AssemblyAI({
  apiKey: "f95d887c6fc643528485537c61aa40ab", // Replace if needed
});

async function testAssembly() {
  try {
    const result = await client.transcripts.list();
    console.log("AssemblyAI Key is VALID");
  } catch (err) {
    console.error("AssemblyAI Key is INVALID:", err.message);
  }
}

testAssembly();
