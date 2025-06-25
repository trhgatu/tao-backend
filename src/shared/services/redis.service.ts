import { redisClient } from "@config/redis";
import log from "@common/logger";

export const getCache = async <T = unknown>(key: string): Promise<T | null> => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      log.info(`[REDIS HIT] ${key}`);
    } else {
      log.info(`[REDIS MISS] ${key}`);
    }
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    log.error(`Redis get error (key: ${key}): ${err instanceof Error ? err.message : err}`);
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  data: T,
  ttlSeconds = 5
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (err) {
    log.error(`Redis set error (key: ${key}): ${err instanceof Error ? err.message : err}`);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    log.error(`Redis delete error (key: ${key}): ${err instanceof Error ? err.message : err}`);
  }
};

export const deleteKeysByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    log.error(`Redis pattern delete error (${pattern}): ${err instanceof Error ? err.message : err}`);
  }
};