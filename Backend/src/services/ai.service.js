// src/services/ai.service.js

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateTags = async (title, description, content) => {
  try {
    const response = await groq.chat.completions.create({
    //   model: "llama3-8b-8192",
    model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a tagging assistant. You only respond with a valid JSON array of strings. No explanation, no markdown, no extra text. Only the JSON array.",
        },
        {
          role: "user",
          content: `Generate exactly 5 relevant tags for this content. Return only a JSON array like ["tag1", "tag2", "tag3", "tag4", "tag5"].
          
          Title: ${title}
          Description: ${description}
          Content: ${content.slice(0, 1000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const rawResponse = response.choices[0].message.content.trim();
    console.log("Raw text from Groq:", rawResponse);

    // Groq sometimes wraps in ```json — strip it just in case
    const cleaned = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const tags = JSON.parse(cleaned);

    if (!Array.isArray(tags)) {
      console.error("Groq did not return an array ❌");
      return [];
    }

    console.log("Tags generated ✅", tags);
    return tags;

  } catch (error) {
    console.error("Tag generation failed ❌", error.message);
    return [];
  }
};