// server.js
import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Configurações
// ----------------------
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Coloque index.html e script.js na pasta /public

// ----------------------
// Rota para chat
// ----------------------
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt vazio" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini", // GPT-5 mini
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const message = data.choices[0].message.content;
    res.json({ message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ----------------------
// Rota para geração de imagem
// ----------------------
app.post("/api/image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt vazio" });

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512"
      })
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;
    res.json({ imageUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar imagem" });
  }
});

// ----------------------
// Iniciar servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
