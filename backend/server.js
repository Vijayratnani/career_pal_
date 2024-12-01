require("dotenv").config(); // To load GEMINI_API_KEY from .env
const cors = require("cors");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Use CORS middleware first, before any routes are defined
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this specific frontend URL
  methods: ['GET', 'POST'], // Specify the allowed HTTP methods (GET, POST, etc.)
  allowedHeaders: ['Content-Type'], // Specify allowed headers
}));

app.use(express.json());

// Initialize GoogleGenerativeAI with the API key from the environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST endpoint to generate career advice
app.post("/api/generate-advice", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt input
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt cannot be empty" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    // Ensure `response.text()` is handled correctly
    const advice = await result.response.text();
    res.json({ advice });
  } catch (error) {
    console.error("Error generating advice:", error.message);
    res.status(500).json({ error: "Failed to generate advice. Please try again later." });
  }
});

// Server listening on the defined port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
