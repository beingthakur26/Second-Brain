// src/workers/queue.js

import { Queue } from "bullmq";
import redis from "../config/redis.js";

/* ─────────────────────────────────────────────
   Queue Instance
───────────────────────────────────────────── */

const itemQueue = new Queue("item-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // retry failed jobs
    backoff: {
      type: "exponential",
      delay: 2000, // retry delay
    },
    removeOnComplete: true, // auto clean successful jobs
    removeOnFail: false, // keep failed jobs for debugging
  },
});

/* ─────────────────────────────────────────────
   Add Job To Queue
───────────────────────────────────────────── */

export const addItemToQueue = async (itemId, url, userId) => {
  try {
    console.log(`Adding job to queue for item: ${itemId} 🔄`);

    const job = await itemQueue.add(
      "process-item",
      {
        itemId: itemId.toString(),
        url,
        userId: userId?.toString() || null,
      },
      {
        jobId: itemId.toString(), // prevents duplicate jobs
      }
    );

    console.log(`Job added successfully, jobId: ${job.id} ✅`);

    return job;
  } catch (error) {
    console.error("Failed to add job to queue ❌", error.message);
    console.error("Full queue error:", error);
    throw error;
  }
};

/* ─────────────────────────────────────────────
   Queue Events
───────────────────────────────────────────── */

itemQueue.on("error", (err) => {
  console.error("Queue error ❌", err);
});

/* ─────────────────────────────────────────────
   Exports
───────────────────────────────────────────── */

export { itemQueue };
export default itemQueue;