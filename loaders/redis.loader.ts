import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis: ReturnType<typeof createClient> = createClient({
  url: redisUrl,
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected");
  }
}

export async function disconnectRedis() {
  if (redis.isOpen) {
    await redis.disconnect();
    console.log("Redis disconnected");
  }
}
