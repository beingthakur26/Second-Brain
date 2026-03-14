import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

console.log("OpenAI Key loaded:", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

import { Worker } from "bullmq";
import mongoose from "mongoose";
import redis from "../config/redis.js";

import { itemModel } from "../models/item.model.js";
import { extractFromUrl } from "../services/extractor.service.js";
import { generateTags } from "../services/ai.service.js";
import { generateEmbedding } from "../services/embedding.service.js";

import qdrant, { COLLECTION_NAME } from "../config/qdrant.js";

/* ─────────────────────────────────────────────
   MongoDB Connection
───────────────────────────────────────────── */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Worker MongoDB connected ✅");
  } catch (error) {
    console.error("Worker MongoDB error ❌", error.message);
    process.exit(1);
  }
};

await connectDB();

/* ─────────────────────────────────────────────
   Worker Processor
───────────────────────────────────────────── */

const worker = new Worker(
  "item-processing",
  async (job) => {

    const { itemId, url, userId } = job.data;

    console.log(`\nProcessing job for item: ${itemId}`);

    try {

      /* ───── STEP 1 — Extract metadata ───── */

      console.log("Step 1: Extracting metadata... 🔄");

      const extracted = await extractFromUrl(url);

      if (!extracted) {
        throw new Error("Extraction returned empty result");
      }

      console.log("Step 1: Extraction complete ✅");


      /* ───── STEP 2 — Generate AI Tags ───── */

      let tags = [];

      if (extracted.title || extracted.description || extracted.content) {

        console.log("Step 2: Generating AI tags... 🔄");

        tags = await generateTags(
          extracted.title,
          extracted.description,
          extracted.content
        );

        console.log("Step 2: Tags generated ✅", tags);

      } else {
        console.log("Step 2 skipped (no content)");
      }


      /* ───── STEP 3 — Generate Embedding ───── */

      console.log("Step 3: Generating embedding... 🔄");

      const textForEmbedding = `
        ${extracted.title}
        ${extracted.description}
        ${extracted.content?.slice(0, 300)}
      `.trim();

      const embedding = await generateEmbedding(textForEmbedding);

      console.log("Step 3: Embedding generated ✅");


      /* ───── STEP 4 — Store vector in Qdrant ───── */

      let embeddingId = "";
      let relatedItems = [];

      if (embedding) {

        console.log("Step 4: Storing vector in Qdrant... 🔄");

        const numericId = Date.now();

        await qdrant.upsert(COLLECTION_NAME, {
          wait: true,
          points: [
            {
              id: numericId,
              vector: embedding,
              payload: {
                itemId: itemId.toString(),
                userId: userId || "",
                url: url,
              },
            },
          ],
        });

        embeddingId = numericId.toString();

        console.log("Step 4: Vector stored in Qdrant ✅", embeddingId);


        /* ───── STEP 5 — Find Related Items ───── */

        console.log("Step 5: Searching related items... 🔄");

        const results = await qdrant.search(COLLECTION_NAME, {
          vector: embedding,
          limit: 6,
          score_threshold: 0.5,
          with_payload: true,
        });

        relatedItems = results
          .map((r) => r.payload.itemId)
          .filter((id) => id !== itemId.toString())
          .slice(0, 5);

        console.log("Step 5: Related items found ✅", relatedItems);
      }


      /* ───── STEP 6 — Update MongoDB ───── */

      console.log("Step 6: Updating MongoDB... 🔄");

      await itemModel.findByIdAndUpdate(itemId, {
        $set: {
          title: extracted.title || "",
          description: extracted.description || "",
          thumbnail: extracted.thumbnail || "",
          content: extracted.content || "",
          type: extracted.type || "link",
          tags: tags,
          embeddingId: embeddingId,
          relatedItems: relatedItems,
          status: "ready",
        },
      });

      console.log("Step 6: MongoDB updated ✅");
      console.log(`Item fully processed: ${itemId} 🎉`);

    } catch (error) {

      console.error(`Processing failed for item: ${itemId} ❌`, error.message);

      await itemModel.findByIdAndUpdate(itemId, {
        $set: { status: "failed" },
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);


/* ─────────────────────────────────────────────
   Worker Events
───────────────────────────────────────────── */

worker.on("active", (job) => {
  console.log(`Job ${job.id} started 🔄`);
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed ✅`);
});

worker.on("failed", (job, error) => {
  console.log(`Job ${job?.id} failed ❌`, error.message);
});

worker.on("error", (err) => {
  console.error("Worker error ❌", err);
});