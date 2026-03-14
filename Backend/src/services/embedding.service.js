// src/services/embedding.service.js

import axios from "axios";

// Jina AI embedding API — free tier, 1M tokens included
// model outputs 768-dimensional vectors
export const generateEmbedding = async (text) => {
  try {
    const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 512);

    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        input: [cleanText],
        model: "jina-embeddings-v2-base-en",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const vector = response.data.data[0].embedding;
    console.log(`Embedding generated ✅ — vector size: ${vector.length}`);
    return vector;

  } catch (error) {
    console.error("Embedding generation failed ❌", error.message);
    return null;
  }
};