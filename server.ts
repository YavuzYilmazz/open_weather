import app from "./app";
import { connectDatabase, disconnectDatabase } from "./loaders/db.loader";
import { connectRedis, disconnectRedis } from "./loaders/redis.loader";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await disconnectRedis();
  await disconnectDatabase();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await disconnectRedis();
  await disconnectDatabase();
  process.exit(0);
});
