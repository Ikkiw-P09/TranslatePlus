import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve();

console.log(__dirname); // Keep this line for debugging

app.use(express.static(path.join(__dirname)));

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "xx.yy.p\nxx = ภาษาต้นทาง (ad = ตรวจจับภาษาอัตโนมัติ)\nyy = ภาษาปลายทาง\np = รูปแบบของคำ p = professional f = friendly\n\nเช่น\nad.jp.p\nHello\n\nAnswer : こにちわ\n\nรูปแบบ : คำแปลภาษาปลายทาง",
  safetySettings: safetySettings,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, sourceLanguage, targetLanguage, translationType } = req.body;

  console.log("------------------------------");
  console.log("Received request:", { text, sourceLanguage, targetLanguage, translationType });

  if (!text || !sourceLanguage || !targetLanguage || !translationType) {
    return res.status(400).json({ message: "All parameters are required." });
  }

  const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage} in ${translationType === "p" ? "professional" : "informal"} style:\n\n${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text();
    console.log("API Response:", translation, "-----------------------------\n");

    if (translation) {
      res.json({ translation: translation });
    } else {
      res.status(500).json({ message: "Empty response from the translation API." });
    }
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});