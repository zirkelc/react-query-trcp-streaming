import { RedisMemoryServer } from "redis-memory-server";
import { createClient, type RedisClientType } from "redis";

let redisServer: RedisMemoryServer | null = null;
let redisClient: RedisClientType | null = null;

/** Start Redis memory server and return connection details */
export async function startRedis(): Promise<{ host: string; port: number }> {
  if (!redisServer) {
    console.log(`[redis] Starting Redis memory server...`);
    redisServer = new RedisMemoryServer();
  }

  const host = await redisServer.getHost();
  const port = await redisServer.getPort();

  console.log(`[redis] Redis running at ${host}:${port}`);

  return { host, port };
}

/** Get or create Redis client */
export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    const { host, port } = await startRedis();
    redisClient = createClient({
      socket: { host, port },
    });
    await redisClient.connect();
    console.log(`[redis] Client connected`);
  }

  return redisClient;
}

/** Stop Redis server */
export async function stopRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (redisServer) {
    await redisServer.stop();
    redisServer = null;
  }
  console.log(`[redis] Stopped`);
}
