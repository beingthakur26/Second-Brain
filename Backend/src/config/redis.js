import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_URL,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,

  retryStrategy(times) {
    if (times > 10) {
      console.error("Redis max retries reached ❌");
      return null;
    }
    return 3000;
  },
});

// connection logs
redis.on("connect", () => {
  console.log("Redis connected ✅");
});

redis.on("error", (err) => {
  console.error("Redis connection error ❌", err.message);
});

// sanity check
if (!process.env.REDIS_PORT) {
  console.error("REDIS_PORT missing in .env ❌");
}

export default redis;